/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type BrainTumorClass = 'Glioma' | 'Meningioma' | 'No Tumor' | 'Pituitary';

export interface ClassProbabilities {
  Glioma: number;
  Meningioma: number;
  'No Tumor': number;
  Pituitary: number;
  [key: string]: number;
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  filename: string;
  originalImage: string; // Data URL or asset path
  predicted_class: BrainTumorClass | string;
  confidence: number; // 0 to 1
  probabilities: ClassProbabilities;
  segmentation_mask: string; // Base64 string or data URL
  gradcam_image: string; // Base64 string or data URL
}

export interface BackendStatus {
  configured: boolean;
  colabUrl: string | null;
  isReachable: boolean;
  latencyMs: number | null;
  testError: string | null;
  timestamp: string;
}

export type ActiveTab = 'landing' | 'dashboard' | 'analyze' | 'results';
