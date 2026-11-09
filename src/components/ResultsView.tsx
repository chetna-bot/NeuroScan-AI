/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ActiveTab, AnalysisResult, BrainTumorClass } from '../types/analysis';
import {
  Layers,
  Eye,
  Cpu,
  ArrowLeft,
  Download,
  Share2,
  Sliders,
  CheckCircle2,
  SplitSquareVertical,
  ShieldAlert,
  FileText,
  Loader2,
  Stethoscope,
  Compass,
  FileSearch,
  BookOpen,
} from 'lucide-react';
import { generateMriPdfReport } from '../services/pdfReport';
import { getMriDetailedAnalysis } from '../services/mriDiagnosisExplainer';

interface ResultsViewProps {
  result: AnalysisResult | null;
  onTabChange: (tab: ActiveTab) => void;
  onNewScan: () => void;
  currentUser?: import('firebase/auth').User | import('../services/firebase').AppUser | null;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  result,
  onTabChange,
  onNewScan,
  currentUser,
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [detailTab, setDetailTab] = useState<'pathology' | 'anatomy' | 'radiology' | 'workup'>('pathology');

  // Segmentation visualizer view mode: 'side-by-side' | 'slider' | 'overlay'
  const [segMode, setSegMode] = useState<'side-by-side' | 'slider' | 'overlay'>('side-by-side');
  const [segSliderPos, setSegSliderPos] = useState<number>(50);
  const [segOverlayOpacity, setSegOverlayOpacity] = useState<number>(65);

  // Grad-CAM visualizer view mode: 'side-by-side' | 'overlay'
  const [camMode, setCamMode] = useState<'side-by-side' | 'overlay'>('side-by-side');
  const [camOverlayOpacity, setCamOverlayOpacity] = useState<number>(60);

  if (!result) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">No Active Analysis Selected</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Please upload and analyze a brain MRI scan to view clinical classification, segmentation, and Grad-CAM results.
        </p>
        <button
          onClick={() => onTabChange('analyze')}
          className="px-4 py-2 bg-slate-900 text-white rounded text-xs font-medium hover:bg-slate-800 transition-colors"
        >
          Go to MRI Analysis
        </button>
      </div>
    );
  }

  const {
    id,
    timestamp,
    filename,
    originalImage,
    predicted_class,
    confidence,
    probabilities,
    segmentation_mask,
    gradcam_image,
  } = result;

  const targetClasses: BrainTumorClass[] = ['Glioma', 'Meningioma', 'No Tumor', 'Pituitary'];
  const mriDetails = getMriDetailedAnalysis(result);

  // Export report as JSON or trigger print
  const handleDownloadReport = () => {
    const reportData = {
      platform: 'NeuroScan AI',
      analysis_id: id,
      timestamp,
      source_file: filename,
      predicted_class,
      confidence,
      probabilities,
      disclaimer: 'Educational & Research Prototype. Not a clinical medical device.',
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NeuroScan_${id}_Report.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      await generateMriPdfReport(
        result,
        currentUser?.email,
        currentUser?.displayName
      );
    } catch (err) {
      console.error('Failed to generate PDF report:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Top Action & Reference Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <button
            onClick={() => onTabChange('dashboard')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Dashboard</span>
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              MRI Neural Analysis Report
            </h1>
            <span className="font-mono text-xs text-slate-500 px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
              {id}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 font-mono">
            <span>File: {filename}</span>
            <span aria-hidden="true">·</span>
            <span>
              Recorded:{' '}
              {new Date(timestamp).toLocaleString([], {
                dateStyle: 'medium',
                timeStyle: 'medium',
              })}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-medium rounded transition-colors shadow-sm disabled:opacity-50"
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <FileText className="w-3.5 h-3.5" />
                <span>Download PDF Report</span>
              </>
            )}
          </button>
          <button
            onClick={handleDownloadReport}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium rounded border border-slate-300 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={onNewScan}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded transition-colors shadow-sm"
          >
            <span>Analyze New Scan</span>
          </button>
        </div>
      </div>

      {/* 2. CARD A: Classification Results */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center text-slate-900">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                A. Classification Results
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                Model: EfficientNetB0 · Categorical Softmax Posterior
              </p>
            </div>
          </div>

          <div className="text-xs font-mono text-slate-400">
            CONFIDENCE CALIBRATION
          </div>
        </div>

        {/* Prediction summary banner */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-5 p-5 bg-slate-50 rounded border border-slate-200 space-y-2">
            <span className="text-[11px] font-mono uppercase text-slate-500 tracking-wider">
              Predicted Diagnostic Category
            </span>
            <div className="text-3xl font-bold tracking-tight text-slate-900">
              {predicted_class}
            </div>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs text-slate-600">Model Confidence:</span>
              <span className="text-base font-mono font-bold text-teal-700 tabular-nums">
                {(confidence * 100).toFixed(1)}%
              </span>
            </div>
            <p className="text-[11px] text-slate-500 pt-1 leading-relaxed">
              Calculated via maximum a posteriori (MAP) estimation across output activation units.
            </p>
          </div>

          {/* Class Probability Distribution Bars */}
          <div className="md:col-span-7 space-y-3.5">
            <div className="flex items-center justify-between text-xs font-medium text-slate-700 border-b border-slate-100 pb-1">
              <span>Target Class</span>
              <span className="font-mono text-[11px]">Probability Distribution</span>
            </div>

            <div className="space-y-3">
              {targetClasses.map((cls) => {
                const prob = probabilities[cls] !== undefined ? probabilities[cls] : 0;
                const isWinner = cls.toLowerCase() === predicted_class.toLowerCase();
                const pct = (prob * 100).toFixed(2);

                return (
                  <div key={cls} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span
                        className={`font-medium ${
                          isWinner ? 'text-slate-900 font-semibold' : 'text-slate-600'
                        }`}
                      >
                        {cls}
                        {isWinner && (
                          <span className="ml-2 text-[10px] font-mono text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                            Primary Match
                          </span>
                        )}
                      </span>
                      <span className="font-mono tabular-nums text-slate-900 font-medium">
                        {pct}%
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/60">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isWinner ? 'bg-teal-600' : 'bg-slate-400'
                        }`}
                        style={{ width: `${Math.max(Number(pct), 1)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 3. CARD B: Segmentation Results */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center text-teal-700">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                B. Segmentation Results
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                Architecture: U-Net · Pixel-Level Lesion Mask Delineation
              </p>
            </div>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded border border-slate-200 text-xs">
            <button
              onClick={() => setSegMode('side-by-side')}
              className={`px-3 py-1 font-medium rounded transition-colors whitespace-nowrap ${
                segMode === 'side-by-side'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Side-by-Side
            </button>
            <button
              onClick={() => setSegMode('slider')}
              className={`px-3 py-1 font-medium rounded transition-colors whitespace-nowrap ${
                segMode === 'slider'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Comparison Slider
            </button>
            <button
              onClick={() => setSegMode('overlay')}
              className={`px-3 py-1 font-medium rounded transition-colors whitespace-nowrap ${
                segMode === 'overlay'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Alpha Overlay
            </button>
          </div>
        </div>

        {/* Visualizer Display Area */}
        {segMode === 'side-by-side' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Original MRI Image */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                <span>ORIGINAL MRI SCAN</span>
                <span>RAW SLICE</span>
              </div>
              <div className="bg-black rounded border border-slate-800 aspect-square overflow-hidden flex items-center justify-center p-1">
                <img
                  src={originalImage}
                  alt="Original brain MRI scan"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>

            {/* U-Net Mask */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                <span>U-NET SEGMENTATION MASK</span>
                <span className="text-teal-600">BINARY LESION ROI</span>
              </div>
              <div className="bg-black rounded border border-slate-800 aspect-square overflow-hidden flex items-center justify-center p-1 relative">
                {segmentation_mask ? (
                  <img
                    src={segmentation_mask}
                    alt="U-Net computed segmentation mask"
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className="text-slate-400 text-xs font-mono text-center p-4">
                    Segmentation mask data not returned by backend
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {segMode === 'slider' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span className="font-mono">DRAG SLIDER TO COMPARE RAW SCAN VS. U-NET MASK</span>
              <span className="font-mono tabular-nums">{segSliderPos}%</span>
            </div>

            <div className="relative aspect-square max-w-md mx-auto rounded overflow-hidden bg-black border border-slate-800 select-none">
              {/* Bottom Layer: U-Net Mask */}
              <img
                src={segmentation_mask || originalImage}
                alt="Segmentation mask background"
                className="absolute inset-0 w-full h-full object-contain"
              />

              {/* Top Layer: Original MRI with clip-path */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - segSliderPos}% 0 0)` }}
              >
                <img
                  src={originalImage}
                  alt="Original MRI scan overlay"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Vertical Divider Hairline */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-teal-400 shadow-md pointer-events-none"
                style={{ left: `${segSliderPos}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-white border border-teal-600 rounded-full flex items-center justify-center text-teal-800 shadow">
                  <SplitSquareVertical className="w-3.5 h-3.5" />
                </div>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={segSliderPos}
                onChange={(e) => setSegSliderPos(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
              />
            </div>

            <div className="flex justify-between text-[11px] font-mono text-slate-500 max-w-md mx-auto">
              <span>← Raw MRI Slice</span>
              <span>U-Net Mask →</span>
            </div>
          </div>
        )}

        {segMode === 'overlay' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-600 max-w-md mx-auto">
              <span>Mask Opacity:</span>
              <div className="flex items-center gap-3 w-48">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={segOverlayOpacity}
                  onChange={(e) => setSegOverlayOpacity(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
                <span className="font-mono text-xs tabular-nums w-8">{segOverlayOpacity}%</span>
              </div>
            </div>

            <div className="relative aspect-square max-w-md mx-auto rounded overflow-hidden bg-black border border-slate-800">
              <img
                src={originalImage}
                alt="Base MRI scan"
                className="absolute inset-0 w-full h-full object-contain"
              />
              {segmentation_mask && (
                <img
                  src={segmentation_mask}
                  alt="U-Net Mask Overlay"
                  className="absolute inset-0 w-full h-full object-contain mix-blend-screen"
                  style={{ opacity: segOverlayOpacity / 100 }}
                />
              )}
            </div>
          </div>
        )}

        <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs text-slate-600">
          <strong>U-Net Anatomical Interpretation:</strong> The segmentation output computes boundary
          probabilities at each spatial coordinate $(x, y)$. Elevated values indicate concentrated lesion mass
          and peri-tumoral edema regions identified during the decoder upsampling pass.
        </div>
      </div>

      {/* 4. CARD C: Grad-CAM Visualization */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center text-amber-700">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                C. Grad-CAM Saliency Visualization
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                Gradient-Weighted Class Activation Mapping · Decision Explainability
              </p>
            </div>
          </div>

          {/* Cam Mode Switch */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded border border-slate-200 text-xs">
            <button
              onClick={() => setCamMode('side-by-side')}
              className={`px-3 py-1 font-medium rounded transition-colors whitespace-nowrap ${
                camMode === 'side-by-side'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Side-by-Side
            </button>
            <button
              onClick={() => setCamMode('overlay')}
              className={`px-3 py-1 font-medium rounded transition-colors whitespace-nowrap ${
                camMode === 'overlay'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Blended Heatmap Overlay
            </button>
          </div>
        </div>

        {camMode === 'side-by-side' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Original MRI Image */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                <span>ORIGINAL MRI SCAN</span>
                <span>NEUROANATOMY</span>
              </div>
              <div className="bg-black rounded border border-slate-800 aspect-square overflow-hidden flex items-center justify-center p-1">
                <img
                  src={originalImage}
                  alt="Original MRI scan"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>

            {/* Grad-CAM Heatmap */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                <span>GRAD-CAM ACTIVATION MAP</span>
                <span className="text-amber-600">ATTENTION GRADIENTS</span>
              </div>
              <div className="bg-black rounded border border-slate-800 aspect-square overflow-hidden flex items-center justify-center p-1">
                {gradcam_image ? (
                  <img
                    src={gradcam_image}
                    alt="Grad-CAM saliency activation heatmap"
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className="text-slate-400 text-xs font-mono text-center p-6 flex flex-col items-center justify-center h-full space-y-1.5">
                    <span className="text-teal-400 font-medium">Negative Baseline Tissue</span>
                    <span className="text-[11px] text-slate-500 max-w-xs">
                      Grad-CAM saliency gradients are not focused as no localized mass was classified (Class: {predicted_class}).
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Blended Overlay Mode */
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-600 max-w-md mx-auto">
              <span>Heatmap Blend Opacity:</span>
              <div className="flex items-center gap-3 w-48">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={camOverlayOpacity}
                  onChange={(e) => setCamOverlayOpacity(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />
                <span className="font-mono text-xs tabular-nums w-8">{camOverlayOpacity}%</span>
              </div>
            </div>

            <div className="relative aspect-square max-w-md mx-auto rounded overflow-hidden bg-black border border-slate-800">
              <img
                src={originalImage}
                alt="Base MRI scan"
                className="absolute inset-0 w-full h-full object-contain"
              />
              {gradcam_image && (
                <img
                  src={gradcam_image}
                  alt="Grad-CAM Overlay"
                  className="absolute inset-0 w-full h-full object-contain mix-blend-screen"
                  style={{ opacity: camOverlayOpacity / 100 }}
                />
              )}
            </div>
          </div>
        )}

        {/* Grad-CAM Color Legend & Explanation */}
        <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-2 text-xs text-slate-600">
          <div className="flex items-center justify-between">
            <span className="font-medium text-slate-800">Gradient Saliency Scale:</span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-500">Baseline (0.0)</span>
              <div className="w-28 h-2.5 rounded bg-gradient-to-r from-blue-600 via-teal-400 via-amber-400 to-red-600 border border-slate-300" />
              <span className="text-[11px] font-mono text-red-600 font-semibold">Maximal (1.0)</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Grad-CAM calculates the gradient of the predicted score with respect to feature activation maps
            (∂yᶜ / ∂Aᵏ). For predicted class <em>{predicted_class}</em>, regions illuminated in
            warm red denote the primary histological and structural features that motivated the network's classification.
          </p>
        </div>
      </div>

      {/* 5. CARD D: In-Depth Diagnostic Analysis & MRI Anatomical Details */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-slate-900 flex items-center justify-center text-teal-400">
              <FileSearch className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                D. In-Depth Diagnostic Analysis & MRI Anatomical Findings
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                Class Pathology Profiling · Tissue Structures · Radiomics Breakdown
              </p>
            </div>
          </div>

          {/* Sub-section Switcher */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded border border-slate-200 text-xs">
            <button
              onClick={() => setDetailTab('pathology')}
              className={`px-3 py-1 font-medium rounded transition-colors whitespace-nowrap ${
                detailTab === 'pathology'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Class Pathology
            </button>
            <button
              onClick={() => setDetailTab('anatomy')}
              className={`px-3 py-1 font-medium rounded transition-colors whitespace-nowrap ${
                detailTab === 'anatomy'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Anatomical Landmarks
            </button>
            <button
              onClick={() => setDetailTab('radiology')}
              className={`px-3 py-1 font-medium rounded transition-colors whitespace-nowrap ${
                detailTab === 'radiology'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sequence & Signals
            </button>
            <button
              onClick={() => setDetailTab('workup')}
              className={`px-3 py-1 font-medium rounded transition-colors whitespace-nowrap ${
                detailTab === 'workup'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Clinical Workup
            </button>
          </div>
        </div>

        {/* Tab 1: Pathology Profile */}
        {detailTab === 'pathology' && (
          <div className="space-y-6 text-xs text-slate-600 leading-relaxed">
            <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="font-semibold text-slate-900 text-sm">
                  {mriDetails.pathology.title}
                </span>
                <span className="font-mono text-[11px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 w-fit">
                  {mriDetails.pathology.categoryType}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 font-mono text-[11px]">
                <div>
                  <span className="text-slate-400 block">Grading Spectrum:</span>
                  <span className="text-slate-800 font-medium">{mriDetails.pathology.whoGrading}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Cellular Origin:</span>
                  <span className="text-slate-800 font-medium">{mriDetails.pathology.originTissue}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-slate-900 text-xs uppercase tracking-wider font-mono">
                Pathophysiology & Disease Mechanism
              </h3>
              <p className="text-slate-700 bg-white p-4 rounded border border-slate-200">
                {mriDetails.pathology.pathophysiology}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-2">
                <h4 className="font-semibold text-slate-900 text-xs">
                  Typical Anatomical Compartments
                </h4>
                <ul className="space-y-1.5 list-disc pl-4 text-slate-600 text-[11px]">
                  {mriDetails.pathology.typicalLocations.map((loc, idx) => (
                    <li key={idx}>{loc}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-2">
                <h4 className="font-semibold text-slate-900 text-xs">
                  Clinical Presentation & Symptoms
                </h4>
                <ul className="space-y-1.5 list-disc pl-4 text-slate-600 text-[11px]">
                  {mriDetails.pathology.clinicalPresentation.map((sym, idx) => (
                    <li key={idx}>{sym}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Anatomical Landmarks & Tissue Breakdown */}
        {detailTab === 'anatomy' && (
          <div className="space-y-6 text-xs text-slate-600 leading-relaxed">
            <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900 text-xs uppercase tracking-wider font-mono">
                  Identified Scan Acquisition Geometry
                </span>
                <span className="font-mono text-teal-700 text-[11px]">
                  {mriDetails.imageOrientation}
                </span>
              </div>
              <p className="text-slate-600 text-[11px]">
                The uploaded slice represents an axial transverse neuroimaging cut through the cerebral hemispheres,
                permitting bilateral symmetric inspection of cortical mantles, subcortical tracts, and ventricular cavities.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-slate-900 text-xs uppercase tracking-wider font-mono">
                Observable Anatomical Landmarks in This Slice
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {mriDetails.anatomicalLandmarks.map((landmark, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white rounded border border-slate-200 flex items-start gap-2.5"
                  >
                    <Compass className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span className="text-slate-800 text-[11px] font-medium">{landmark}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-slate-900 text-xs uppercase tracking-wider font-mono">
                Structural & Compartment Assessment Matrix
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 rounded border border-slate-200 space-y-1">
                  <span className="font-semibold text-slate-900 text-[11px] block">
                    Parenchymal Integrity
                  </span>
                  <p className="text-[11px] text-slate-600">
                    {mriDetails.tissueMetrics.parenchymalIntegrity}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded border border-slate-200 space-y-1">
                  <span className="font-semibold text-slate-900 text-[11px] block">
                    Ventricular Symmetry & CSF
                  </span>
                  <p className="text-[11px] text-slate-600">
                    {mriDetails.tissueMetrics.ventricularSymmetry}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded border border-slate-200 space-y-1">
                  <span className="font-semibold text-slate-900 text-[11px] block">
                    Midline Vector & Mass Shift
                  </span>
                  <p className="text-[11px] text-slate-600">
                    {mriDetails.tissueMetrics.midlineAssessment}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded border border-slate-200 space-y-1">
                  <span className="font-semibold text-slate-900 text-[11px] block">
                    U-Net Boundary & Edema Margin
                  </span>
                  <p className="text-[11px] text-slate-600">
                    {mriDetails.tissueMetrics.edemaAssessment}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Sequence & Signals */}
        {detailTab === 'radiology' && (
          <div className="space-y-6 text-xs text-slate-600 leading-relaxed">
            <div className="space-y-2">
              <h3 className="font-semibold text-slate-900 text-xs uppercase tracking-wider font-mono">
                Multi-Sequence Signal Intensity Profile
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border border-slate-200 rounded">
                  <thead className="bg-slate-50 font-mono text-[11px] text-slate-500 uppercase border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-2.5">Sequence Modality</th>
                      <th className="px-4 py-2.5">Expected Characteristic Signal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[11px]">
                    <tr>
                      <td className="px-4 py-2.5 font-medium text-slate-900 font-mono">
                        T1-Weighted (T1W)
                      </td>
                      <td className="px-4 py-2.5 text-slate-700">
                        {mriDetails.pathology.radiologicalHallmarks.t1Signal}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-medium text-slate-900 font-mono">
                        T2 / FLAIR
                      </td>
                      <td className="px-4 py-2.5 text-slate-700">
                        {mriDetails.pathology.radiologicalHallmarks.t2FlairSignal}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-medium text-slate-900 font-mono">
                        T1 Post-Contrast (+Gad)
                      </td>
                      <td className="px-4 py-2.5 text-slate-700">
                        {mriDetails.pathology.radiologicalHallmarks.contrastEnhancement}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-medium text-slate-900 font-mono">
                        Lesion Margin Profile
                      </td>
                      <td className="px-4 py-2.5 text-slate-700">
                        {mriDetails.pathology.radiologicalHallmarks.margins}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-medium text-slate-900 font-mono">
                        Mass Effect Dynamics
                      </td>
                      <td className="px-4 py-2.5 text-slate-700">
                        {mriDetails.pathology.radiologicalHallmarks.massEffect}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-2">
              <h4 className="font-semibold text-slate-900 text-xs font-mono uppercase">
                Quantitative Radiomics Summary
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] font-mono">
                <div>
                  <span className="text-slate-400 block">Primary Match:</span>
                  <span className="text-slate-900 font-bold">{mriDetails.quantitativeRadiomics.topClass} ({mriDetails.quantitativeRadiomics.confidencePct})</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Secondary Diff:</span>
                  <span className="text-slate-700">{mriDetails.quantitativeRadiomics.secondaryClass} ({mriDetails.quantitativeRadiomics.secondaryPct})</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Margin Type:</span>
                  <span className="text-slate-700">{mriDetails.quantitativeRadiomics.marginSharpness}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Triage Status:</span>
                  <span className="text-teal-700 font-medium">{mriDetails.quantitativeRadiomics.riskStratification}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Differential & Clinical Workup */}
        {detailTab === 'workup' && (
          <div className="space-y-6 text-xs text-slate-600 leading-relaxed">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-2.5">
                <div className="flex items-center gap-1.5 font-semibold text-slate-900 text-xs">
                  <Stethoscope className="w-4 h-4 text-teal-700" />
                  <h4>Radiological Differential Considerations</h4>
                </div>
                <p className="text-[11px] text-slate-500">
                  Pathologies sharing overlapping morphological or intensity characteristics that radiologists consider during differential diagnosis:
                </p>
                <ul className="space-y-1.5 list-disc pl-4 text-slate-700 text-[11px]">
                  {mriDetails.pathology.differentialDiagnosis.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-2.5">
                <div className="flex items-center gap-1.5 font-semibold text-slate-900 text-xs">
                  <BookOpen className="w-4 h-4 text-teal-700" />
                  <h4>Confirmatory & Advanced Diagnostic Workup</h4>
                </div>
                <p className="text-[11px] text-slate-500">
                  Standard advanced radiological and clinical protocols to corroborate convolutional classification:
                </p>
                <ul className="space-y-1.5 list-disc pl-4 text-slate-700 text-[11px]">
                  {mriDetails.pathology.confirmatoryRecommendations.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-3 bg-amber-50/70 rounded border border-amber-200 text-amber-900 text-[11px] flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>Research Prototype Guidance:</strong> Automated neural classification should always be correlated
                with clinical symptomatology, laboratory markers, and multidisciplinary tumor board review.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
