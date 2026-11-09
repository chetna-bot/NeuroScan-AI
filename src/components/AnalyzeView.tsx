/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { ActiveTab, AnalysisResult } from '../types/analysis';
import { uploadAndAnalyzeMri } from '../services/api';
import {
  Upload,
  FileImage,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Sparkles,
  Info,
  X,
  Lock,
} from 'lucide-react';

interface AnalyzeViewProps {
  onAnalysisSuccess: (result: AnalysisResult) => void;
  onTabChange: (tab: ActiveTab) => void;
  currentUser: import('firebase/auth').User | import('../services/firebase').AppUser | null;
  onOpenAuthModal: (reason?: string) => void;
}

export const AnalyzeView: React.FC<AnalyzeViewProps> = ({
  onAnalysisSuccess,
  onTabChange,
  currentUser,
  onOpenAuthModal,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate file
  const validateAndSetFile = (file: File) => {
    setErrorMessage(null);
    setErrorCode(null);

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      setErrorMessage(
        `Invalid file type "${file.type || 'unknown'}". Please upload a JPG, JPEG, or PNG image.`
      );
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 25MB limit. Please provide a smaller image.');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setErrorMessage(null);
    setErrorCode(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Load sample axial MRI scan
  const loadSampleScan = async () => {
    try {
      setErrorMessage(null);
      setErrorCode(null);
      const samplePath = '/src/assets/images/mri_brain_axial_scan_1794122030039.jpg';
      const response = await fetch(samplePath);
      const blob = await response.blob();
      const file = new File([blob], 'sample_axial_t1_brain_mri.jpg', { type: 'image/jpeg' });
      validateAndSetFile(file);
    } catch {
      setErrorMessage('Failed to load sample image.');
    }
  };

  // Client-side image optimizer to safely stay below Vercel's 4.5MB serverless payload limit
  const optimizeImageForUpload = async (file: File): Promise<File> => {
    if (file.size <= 2 * 1024 * 1024) return file;
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1600;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            const cleanName = file.name.replace(/\.[^.]+$/, '.jpg');
            resolve(new File([blob], cleanName, { type: 'image/jpeg' }));
          },
          'image/jpeg',
          0.90
        );
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(file);
      };
      img.src = url;
    });
  };

  // Run analysis submission
  const handleSubmitAnalysis = async () => {
    if (!selectedFile || !previewUrl) return;

    setIsAnalyzing(true);
    setErrorMessage(null);
    setErrorCode(null);

    try {
      setAnalysisStep('Optimizing MRI scan for neural inference pipeline...');
      const fileToSend = await optimizeImageForUpload(selectedFile);

      setAnalysisStep('Executing EfficientNetB0 deep classification layers...');
      await new Promise((r) => setTimeout(r, 350));

      setAnalysisStep('Computing U-Net convolutional lesion segmentation mask...');
      await new Promise((r) => setTimeout(r, 350));

      setAnalysisStep('Backpropagating gradient activations (Grad-CAM)...');
      const result = await uploadAndAnalyzeMri(fileToSend, fileToSend.name, previewUrl);

      setAnalysisStep('Analysis complete! Formatting comprehensive clinical report...');
      await new Promise((r) => setTimeout(r, 250));

      onAnalysisSuccess(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Analysis failed';
      const code = (err as unknown as { code?: string })?.code || null;
      setErrorMessage(msg);
      setErrorCode(code);
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title & Context */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 uppercase tracking-wider">
          <span>Inference Stage</span>
          <span aria-hidden="true">·</span>
          <span>Neuroimaging Upload</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
          Brain MRI Diagnostic Analysis
        </h1>
        <p className="text-xs text-slate-600 mt-1 max-w-2xl">
          Upload an axial, coronal, or sagittal magnetic resonance imaging slice (JPG, JPEG, PNG). The platform
          executes deep learning classification (EfficientNetB0), U-Net lesion segmentation, and Grad-CAM backpropagation interpretability.
        </p>
      </div>

      {/* Clinician status banner when not signed in with cloud */}
      {!currentUser && (
        <div className="p-3 bg-slate-100/90 border border-slate-200 rounded text-slate-700 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-medium text-slate-900">Clinician Workspace Active</span>
            <span className="text-slate-500 text-[11px] hidden sm:inline">
              · Instant neural processing and local report saving enabled
            </span>
          </div>
          <button
            onClick={() => onOpenAuthModal('Sign in to sync patient records with your cloud account.')}
            className="text-xs text-teal-700 hover:text-teal-800 font-semibold underline underline-offset-2 shrink-0"
          >
            Cloud Sync Sign In
          </button>
        </div>
      )}

      {!previewUrl ? (
        <div className="space-y-4">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-10 sm:p-14 text-center cursor-pointer transition-colors bg-white ${
              isDragging
                ? 'border-teal-600 bg-teal-50/20'
                : 'border-slate-300 hover:border-slate-400'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,image/jpeg,image/png"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="max-w-md mx-auto space-y-4">
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-600">
                <Upload className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-slate-900">
                  Select or drag & drop brain MRI scan
                </h3>
                <p className="text-xs text-slate-500">
                  Supported formats: <strong className="text-slate-700">JPG, JPEG, PNG</strong> (max 25MB).
                </p>
              </div>

              <div className="pt-2">
                <span className="inline-flex px-4 py-2 bg-slate-900 text-white text-xs font-medium rounded hover:bg-slate-800 transition-colors shadow-sm">
                  Browse Files
                </span>
              </div>
            </div>
          </div>

          {/* Quick Sample Scan Option */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded border border-slate-200 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <FileImage className="w-4 h-4 text-teal-600" />
              <span>
                Want to test immediately? Load a verified clinical axial brain MRI slice:
              </span>
            </div>
            <button
              onClick={loadSampleScan}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 underline underline-offset-4"
            >
              Load Sample MRI Scan
            </button>
          </div>
        </div>
      ) : (
        /* Image Preview & Confirmation Card */
        <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2">
              <FileImage className="w-4 h-4 text-slate-700" />
              <h3 className="text-sm font-semibold text-slate-900">
                Selected MRI Scan Preview
              </h3>
            </div>
            <button
              onClick={clearSelection}
              disabled={isAnalyzing}
              className="text-xs text-slate-500 hover:text-slate-700 disabled:opacity-50 flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Change Image</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Image Stage */}
            <div className="md:col-span-5 bg-black rounded overflow-hidden aspect-square flex items-center justify-center p-2 border border-slate-800">
              <img
                src={previewUrl}
                alt="Selected brain MRI scan preview"
                className="max-h-full max-w-full object-contain"
              />
            </div>

            {/* Metadata & Confirmation */}
            <div className="md:col-span-7 space-y-4 text-xs">
              <div className="space-y-2">
                <div className="text-[11px] font-mono uppercase text-slate-400">
                  File Metadata
                </div>
                <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded border border-slate-200 font-mono text-[11px]">
                  <div>
                    <span className="text-slate-400 block">Name:</span>
                    <span className="text-slate-900 truncate block font-medium">
                      {selectedFile?.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Size:</span>
                    <span className="text-slate-900 block font-medium">
                      {selectedFile ? (selectedFile.size / 1024).toFixed(1) + ' KB' : '--'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Format:</span>
                    <span className="text-slate-900 block font-medium">
                      {selectedFile?.type || 'image/jpeg'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Pipeline:</span>
                    <span className="text-slate-900 block font-medium">
                      EfficientNet + U-Net + Grad-CAM
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-200 text-slate-600 leading-relaxed text-[11px] flex items-start gap-2">
                <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span>
                  The image will be processed by the integrated deep learning inference pipeline (EfficientNetB0, U-Net, and Grad-CAM).
                </span>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={handleSubmitAnalysis}
                  disabled={isAnalyzing}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-medium text-xs rounded transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
                      <span>Processing Neural Pipeline...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-teal-400" />
                      <span>Upload and Analyze MRI Scan</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Processing Indicator HUD */}
      {isAnalyzing && (
        <div className="bg-slate-900 text-slate-200 rounded-lg p-5 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-teal-400 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              NEURAL INFERENCE IN PROGRESS
            </span>
            <span className="text-slate-400">PROCESSING LAYERS...</span>
          </div>
          <p className="text-xs text-slate-300 font-mono">{analysisStep}</p>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-teal-500 h-full w-2/3 animate-pulse rounded-full" />
          </div>
        </div>
      )}

      {/* Error Message Display */}
      {errorMessage && (
        <div className="p-5 rounded-lg border border-rose-200 bg-rose-50/60 space-y-3 text-xs">
          <div className="flex items-start gap-2.5 text-rose-900">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-semibold text-rose-950">
                Analysis Request Notice
              </div>
              <p className="text-rose-800 leading-relaxed font-mono text-[11px]">
                {errorMessage}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
