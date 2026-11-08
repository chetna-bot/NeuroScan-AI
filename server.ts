import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Default permanent Colab backend URL specified by user
const DEFAULT_COLAB_URL = 'https://renewable-ultra-underfed.ngrok-free.dev';

// Dynamic in-memory runtime override for Colab URL if user tests or updates it via UI
let dynamicColabUrl = process.env.COLAB_API_URL?.trim() || DEFAULT_COLAB_URL;

// Helper to sanitize backend URL (strips /docs, /redoc, /predict, /openapi.json, trailing slashes)
function sanitizeBackendUrl(rawUrl: string): string {
  if (!rawUrl) return '';
  let url = rawUrl.trim();
  url = url.replace(/\/(docs|redoc|predict|openapi\.json)(\/.*)?$/i, '');
  url = url.replace(/\/+$/, '');
  return url;
}

// Helper to get active Colab backend URL
function getActiveColabUrl(): string {
  const url = dynamicColabUrl || process.env.COLAB_API_URL || DEFAULT_COLAB_URL;
  return sanitizeBackendUrl(url);
}

// Configure multer for in-memory file buffers (max 25MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowed.includes(file.mimetype.toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format. Only JPG, JPEG, and PNG images are supported.'));
    }
  },
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 1. Health & Status Check Endpoint
app.get('/api/status', async (_req: Request, res: Response) => {
  const colabUrl = getActiveColabUrl();
  const isConfigured = Boolean(colabUrl);

  let isReachable = false;
  let testError: string | null = null;
  let latencyMs: number | null = null;

  if (isConfigured) {
    try {
      const startTime = Date.now();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      // Attempt to ping root or health
      const response = await fetch(`${colabUrl}/`, {
        method: 'GET',
        signal: controller.signal,
      }).catch(async () => {
        // Fallback test to /docs or /health
        return await fetch(`${colabUrl}/docs`, {
          method: 'GET',
          signal: controller.signal,
        });
      });

      clearTimeout(timeoutId);
      latencyMs = Date.now() - startTime;
      isReachable = response.status < 500;
    } catch (err: unknown) {
      isReachable = false;
      testError = err instanceof Error ? err.message : 'Connection timed out or failed';
    }
  }

  res.json({
    configured: isConfigured,
    colabUrl: colabUrl ? colabUrl.replace(/:\/\/[^@]+@/, '://') : null,
    isReachable,
    latencyMs,
    testError,
    timestamp: new Date().toISOString(),
  });
});

// 2. Configure / Update Colab URL in current runtime
app.post('/api/config', (req: Request, res: Response) => {
  const { colabUrl } = req.body;
  if (typeof colabUrl === 'string') {
    const cleaned = sanitizeBackendUrl(colabUrl);
    dynamicColabUrl = cleaned || DEFAULT_COLAB_URL;
    res.json({
      success: true,
      colabUrl: dynamicColabUrl,
      message: 'Colab backend URL successfully connected.',
    });
  } else {
    res.status(400).json({ error: 'Invalid URL provided.' });
  }
});

// 3. MRI Analysis Proxy Endpoint -> forwards to Colab's /predict
app.post(
  '/api/analyze',
  upload.fields([{ name: 'image', maxCount: 1 }, { name: 'file', maxCount: 1 }]),
  async (req: Request, res: Response) => {
    try {
      const colabUrl = getActiveColabUrl();

      if (!colabUrl) {
        res.status(503).json({
          error:
            'Colab backend URL is not configured. Set COLAB_API_URL in your environment or configure the Colab tunnel URL in the Backend Connection panel.',
          code: 'BACKEND_NOT_CONFIGURED',
        });
        return;
      }

      // Extract uploaded image file
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
      const uploadedFile = files?.image?.[0] || files?.file?.[0];

      let imageBuffer: Buffer | null = null;
      let filename = 'mri_scan.jpg';
      let mimetype = 'image/jpeg';

      if (uploadedFile) {
        imageBuffer = uploadedFile.buffer;
        filename = uploadedFile.originalname || 'mri_scan.jpg';
        mimetype = uploadedFile.mimetype || 'image/jpeg';
      } else if (req.body?.image) {
        // Base64 string payload
        const base64Data = req.body.image.replace(/^data:image\/\w+;base64,/, '');
        imageBuffer = Buffer.from(base64Data, 'base64');
        if (req.body.filename) filename = req.body.filename;
      }

      if (!imageBuffer || imageBuffer.length === 0) {
        res.status(400).json({
          error: 'No valid MRI image provided. Please upload a JPG, JPEG, or PNG file.',
          code: 'INVALID_IMAGE',
        });
        return;
      }

      const targetEndpoint = `${colabUrl}/predict`;

      // Build multipart FormData for standard FastAPI UploadFile
      const formData = new FormData();
      const uint8 = new Uint8Array(imageBuffer);
      const blob = new Blob([uint8], { type: mimetype });
      formData.append('file', blob, filename);
      formData.append('image', blob, filename);

      const controller = new AbortController();
      // Generous timeout for deep learning inference (up to 45 seconds)
      const timeoutId = setTimeout(() => controller.abort(), 45000);

      let colabResponse: globalThis.Response;
      try {
        colabResponse = await fetch(targetEndpoint, {
          method: 'POST',
          body: formData,
          signal: controller.signal,
        });
      } catch (networkErr: unknown) {
        clearTimeout(timeoutId);
        const errMsg = networkErr instanceof Error ? networkErr.message : 'Network error';
        res.status(502).json({
          error: `Failed to connect to Colab backend at ${targetEndpoint}. Please verify that your Google Colab notebook is actively executing and the public tunnel (ngrok / localtunnel) is online.`,
          details: errMsg,
          code: 'BACKEND_CONNECTION_FAILED',
        });
        return;
      }

      clearTimeout(timeoutId);

      if (!colabResponse.ok) {
        const errorText = await colabResponse.text().catch(() => '');
        res.status(colabResponse.status).json({
          error: `Colab backend returned HTTP ${colabResponse.status}: ${errorText || colabResponse.statusText}`,
          code: 'BACKEND_PREDICTION_ERROR',
          details: errorText,
        });
        return;
      }

      const predictionData = await colabResponse.json();

      // Validate required response fields
      if (!predictionData.predicted_class || predictionData.confidence === undefined) {
        res.status(502).json({
          error:
            'The Colab backend returned an unexpected response structure. Expected keys: predicted_class, confidence, probabilities, segmentation_mask, gradcam_image.',
          rawResponse: predictionData,
          code: 'INVALID_BACKEND_SCHEMA',
        });
        return;
      }

      // Return actual backend results directly to frontend
      res.json(predictionData);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Internal Server Error';
      res.status(500).json({
        error: message,
        code: 'PROXY_SERVER_ERROR',
      });
    }
  }
);

// Express and Vite server mounting
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[NeuroScan AI] Server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
