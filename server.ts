import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import app from './api/index';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Express and Vite server mounting for local development / Node production
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

// Start local server only when not running inside Vercel serverless environment
if (!process.env.VERCEL) {
  startServer();
}

export default app;
