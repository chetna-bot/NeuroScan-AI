/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BackendStatus } from '../types/analysis';
import { configureBackendUrl, fetchBackendStatus } from '../services/api';
import { X, Check, Copy, Radio, Terminal, AlertCircle } from 'lucide-react';

interface ColabSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: BackendStatus | null;
  onStatusUpdated: (status: BackendStatus) => void;
}

export const ColabSetupModal: React.FC<ColabSetupModalProps> = ({
  isOpen,
  onClose,
  status,
  onStatusUpdated,
}) => {
  const [inputUrl, setInputUrl] = useState(
    status?.colabUrl || 'https://renewable-ultra-underfed.ngrok-free.dev'
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const handleSaveAndTest = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    setErrorMessage(null);

    try {
      await configureBackendUrl(inputUrl.trim());
      const updatedStatus = await fetchBackendStatus();
      onStatusUpdated(updatedStatus);

      if (updatedStatus.isReachable) {
        setSaveMessage(`Connected successfully! Ping response latency: ${updatedStatus.latencyMs}ms`);
      } else if (updatedStatus.configured) {
        setSaveMessage('URL saved. Waiting for Colab endpoint to respond...');
      } else {
        setSaveMessage('Colab URL cleared.');
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to update backend URL');
    } finally {
      setIsSaving(false);
    }
  };

  const colabScriptSnippet = `# ==============================================================================
# NeuroScan AI - Google Colab FastAPI Inference Backend
# Requirements: pip install fastapi uvicorn python-multipart pyngrok tensorflow numpy opencv-python pillow
# ==============================================================================

import io
import base64
import numpy as np
import tensorflow as tf
from PIL import Image
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pyngrok import ngrok

app = FastAPI(title="NeuroScan AI Colab Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CLASSES = ["Glioma", "Meningioma", "No Tumor", "Pituitary"]

@app.get("/")
def health_check():
    return {"status": "online", "model": "NeuroScan AI (EfficientNetB0 + U-Net + Grad-CAM)"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # 1. Read input image
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")
    image_resized = image.resize((224, 224))
    img_array = np.array(image_resized) / 255.0
    input_tensor = np.expand_dims(img_array, axis=0)

    # 2. Classification Model Inference (e.g. EfficientNetB0)
    # probabilities = classification_model.predict(input_tensor)[0]
    # For demonstration or testing with actual weights:
    raw_probs = [0.94, 0.03, 0.01, 0.02] # Replace with model prediction array
    predicted_idx = int(np.argmax(raw_probs))
    predicted_class = CLASSES[predicted_idx]
    confidence = float(raw_probs[predicted_idx])
    
    prob_dict = {cls: float(raw_probs[i]) for i, cls in enumerate(CLASSES)}

    # 3. U-Net Lesion Segmentation Inference
    # mask = unet_model.predict(np.expand_dims(np.array(image.resize((256, 256)))/255.0, axis=0))[0]
    # Encode mask to base64 PNG:
    mask_uint8 = (np.zeros((224, 224), dtype=np.uint8)) # Replace with your real mask array
    mask_img = Image.fromarray(mask_uint8)
    mask_buffer = io.BytesIO()
    mask_img.save(mask_buffer, format="PNG")
    mask_base64 = base64.b64encode(mask_buffer.getvalue()).decode('utf-8')

    # 4. Grad-CAM Saliency Map Backpropagation
    # gradcam_heatmap = generate_gradcam(classification_model, input_tensor, predicted_idx)
    gradcam_buffer = io.BytesIO()
    image_resized.save(gradcam_buffer, format="PNG")
    gradcam_base64 = base64.b64encode(gradcam_buffer.getvalue()).decode('utf-8')

    return {
        "predicted_class": predicted_class,
        "confidence": confidence,
        "probabilities": prob_dict,
        "segmentation_mask": mask_base64,
        "gradcam_image": gradcam_base64
    }

# Start public tunnel using ngrok in Colab:
# ngrok.set_auth_token("YOUR_NGROK_TOKEN")
# public_url = ngrok.connect(8000).public_url
# print("Colab Backend URL:", public_url)
# uvicorn.run(app, host="0.0.0.0", port=8000)
`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(colabScriptSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <Radio className="w-4 h-4 text-teal-600" />
            <h3 className="text-sm font-semibold text-slate-900">
              Google Colab Backend Connection
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-600">
          {/* Status Box */}
          <div className="p-4 rounded border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-700">Connection Status:</span>
              <span
                className={`font-mono font-medium ${
                  status?.isReachable
                    ? 'text-teal-700'
                    : status?.configured
                    ? 'text-amber-700'
                    : 'text-slate-500'
                }`}
              >
                {status?.isReachable
                  ? `Active (Latency: ${status.latencyMs ?? '--'}ms)`
                  : status?.configured
                  ? 'Configured (Endpoint Unreachable)'
                  : 'Not Configured'}
              </span>
            </div>
            {status?.testError && (
              <p className="text-rose-600 font-mono text-[11px] pt-1">
                Notice: {status.testError}
              </p>
            )}
          </div>

          {/* Form */}
          <div className="space-y-2">
            <label className="block font-medium text-slate-700">
              Colab Backend Tunnel URL (<code className="text-slate-800">COLAB_API_URL</code>)
            </label>
            <p className="text-slate-500 text-[11px]">
              Enter the public URL provided by ngrok or localtunnel from your Google Colab instance (e.g.,{' '}
              <code className="text-slate-700">https://xxxx.ngrok-free.app</code>). The server-side proxy
              forwards requests to <code className="text-slate-700">/predict</code>.
            </p>
            <div className="flex gap-2">
              <input
                type="url"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://your-colab-tunnel.ngrok-free.app"
                className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
              />
              <button
                onClick={handleSaveAndTest}
                disabled={isSaving}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-medium rounded transition-colors whitespace-nowrap"
              >
                {isSaving ? 'Testing...' : 'Save & Test'}
              </button>
            </div>

            {saveMessage && (
              <p className="text-teal-700 text-xs flex items-center gap-1.5 pt-1">
                <Check className="w-3.5 h-3.5" />
                {saveMessage}
              </p>
            )}

            {errorMessage && (
              <p className="text-rose-600 text-xs flex items-center gap-1.5 pt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errorMessage}
              </p>
            )}
          </div>

          {/* Colab Instructions & Starter Script */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-medium text-slate-800">
                <Terminal className="w-3.5 h-3.5 text-slate-500" />
                <span>Colab FastAPI Starter Code (/predict)</span>
              </div>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1 text-[11px] font-medium text-teal-700 hover:text-teal-800 transition-colors"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3 h-3 text-teal-600" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" /> Copy Python Code
                  </>
                )}
              </button>
            </div>
            <p className="text-slate-500 text-[11px]">
              Run this script inside your Google Colab notebook alongside your trained weights to expose the
              FastAPI <code className="text-slate-700">/predict</code> endpoint with the expected response structure.
            </p>
            <pre className="p-3 bg-slate-900 text-slate-200 rounded text-[11px] font-mono overflow-x-auto max-h-48 border border-slate-800 leading-relaxed">
              {colabScriptSnippet}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium rounded text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
