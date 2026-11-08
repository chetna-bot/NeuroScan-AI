/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnalysisResult, BackendStatus } from '../types/analysis';

export async function fetchBackendStatus(): Promise<BackendStatus> {
  try {
    const res = await fetch('/api/status');
    if (!res.ok) {
      throw new Error(`Status check returned ${res.status}`);
    }
    return await res.json();
  } catch (err: unknown) {
    return {
      configured: false,
      colabUrl: null,
      isReachable: false,
      latencyMs: null,
      testError: err instanceof Error ? err.message : 'Failed to reach API server',
      timestamp: new Date().toISOString(),
    };
  }
}

export async function configureBackendUrl(colabUrl: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch('/api/config', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ colabUrl }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Failed to update URL (HTTP ${res.status})`);
  }
  return await res.json();
}

export async function uploadAndAnalyzeMri(
  file: File | Blob,
  filename: string,
  previewDataUrl: string
): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append('image', file, filename);
  formData.append('file', file, filename);

  const res = await fetch('/api/analyze', {
    method: 'POST',
    body: formData,
  });

  const responseJson = await res.json().catch(() => null);

  if (!res.ok) {
    const errorMessage =
      responseJson?.error ||
      `Analysis request failed with status ${res.status}: ${res.statusText}`;
    const errorDetails = responseJson?.details ? ` (${responseJson.details})` : '';
    const err = new Error(errorMessage + errorDetails);
    (err as unknown as { code?: string }).code = responseJson?.code || 'ANALYSIS_ERROR';
    throw err;
  }

  // Format base64 images if they don't already contain data URL prefixes
  const formatBase64 = (rawStr: string | null | undefined): string => {
    if (!rawStr || typeof rawStr !== 'string') return '';
    if (rawStr.startsWith('data:image')) return rawStr;
    return `data:image/png;base64,${rawStr}`;
  };

  const result: AnalysisResult = {
    id: `NS-${Date.now().toString().slice(-6)}`,
    timestamp: new Date().toISOString(),
    filename,
    originalImage: previewDataUrl,
    predicted_class: responseJson.predicted_class,
    confidence: typeof responseJson.confidence === 'number' ? responseJson.confidence : 0,
    probabilities: responseJson.probabilities || {
      Glioma: 0,
      Meningioma: 0,
      'No Tumor': 0,
      Pituitary: 0,
    },
    segmentation_mask: formatBase64(responseJson.segmentation_mask),
    gradcam_image: formatBase64(responseJson.gradcam_image),
  };

  return result;
}
