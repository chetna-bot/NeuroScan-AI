/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ActiveTab, AnalysisResult, BrainTumorClass, getTumorMetrics } from '../types/analysis';
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
  Brain,
  Dna,
  Microscope,
  Activity,
  Sparkles,
  Info,
  Maximize2,
  Ruler,
  Scale,
  Box,
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
  const [detailTab, setDetailTab] = useState<'overview' | 'pathology' | 'anatomy' | 'radiology' | 'workup'>('overview');

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
  const tumorMetrics = getTumorMetrics(result);
  const isTumor = String(predicted_class).toLowerCase() !== 'no tumor';

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
      tumor_area_cm2: tumorMetrics.area_cm2,
      tumor_area_mm2: tumorMetrics.area_mm2,
      tumor_volume_cm3: tumorMetrics.estimated_volume_cm3,
      tumor_metrics: tumorMetrics,
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
          <div className="md:col-span-5 p-5 bg-slate-50 rounded border border-slate-200 space-y-3">
            <div>
              <span className="text-[11px] font-mono uppercase text-slate-500 tracking-wider">
                Predicted Diagnostic Category
              </span>
              <div className="text-3xl font-bold tracking-tight text-slate-900 mt-0.5">
                {predicted_class}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-0.5">
              <span className="text-xs text-slate-600">Model Confidence:</span>
              <span className="text-base font-mono font-bold text-teal-700 tabular-nums">
                {(confidence * 100).toFixed(1)}%
              </span>
            </div>

            {/* Calibrated Tumor Surface Area Badge */}
            <div className="pt-2.5 border-t border-slate-200/90 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5 text-teal-600" />
                  Tumor Surface Area:
                </span>
                <span className="font-mono font-bold px-2 py-0.5 rounded border text-xs shadow-2xs bg-white">
                  {isTumor ? (
                    <span className="text-rose-700">
                      {tumorMetrics.area_cm2.toFixed(2)} cm²{' '}
                      <span className="text-slate-400 font-normal">({tumorMetrics.area_mm2.toLocaleString()} mm²)</span>
                    </span>
                  ) : (
                    <span className="text-emerald-700">0.00 cm² (Non-Neoplastic)</span>
                  )}
                </span>
              </div>

              {isTumor && (
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-0.5">
                  <span>Est. Vol: <strong className="text-slate-800">{tumorMetrics.estimated_volume_cm3} cm³</strong></span>
                  <span>Occupancy: <strong className="text-slate-800">{tumorMetrics.brain_occupancy_pct}%</strong></span>
                </div>
              )}
            </div>

            <p className="text-[10px] text-slate-500 pt-0.5 leading-relaxed font-mono">
              Calibrated against standard 220 mm clinical MRI Field of View (0.859 mm/px spatial matrix).
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

        {/* Quantitative Lesion Volumetry & Calibrated Area Analysis Panel */}
        <div className="bg-slate-900 text-white rounded-lg p-5 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
              <h3 className="text-xs font-bold text-white tracking-wider uppercase font-mono">
                Quantitative Lesion Volumetry & Calibrated Area Analysis
              </h3>
            </div>
            <span className="text-[11px] font-mono text-teal-400 bg-teal-950/80 px-2.5 py-0.5 rounded border border-teal-800/80 self-start sm:self-auto">
              Calibration FOV: 220 mm × 220 mm · 0.859 mm/px
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Metric 1: 2D Surface Area */}
            <div className="bg-slate-800/90 rounded-md p-3.5 border border-slate-700/80 space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>TUMOR SURFACE AREA</span>
                <span className="text-teal-400 font-semibold">2D Slice</span>
              </div>
              <div className="text-2xl font-bold font-mono text-white tabular-nums tracking-tight">
                {tumorMetrics.area_cm2.toFixed(2)}{' '}
                <span className="text-xs font-sans font-normal text-slate-400">cm²</span>
              </div>
              <div className="text-[11px] font-mono text-teal-300">
                {tumorMetrics.area_mm2.toLocaleString()} mm²
              </div>
              <p className="text-[10px] text-slate-400 leading-tight pt-1">
                {isTumor ? 'Calibrated segmented ROI pixels' : 'Zero lesion pixel burden'}
              </p>
            </div>

            {/* Metric 2: Estimated Ellipsoidal Volume */}
            <div className="bg-slate-800/90 rounded-md p-3.5 border border-slate-700/80 space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>ESTIMATED VOLUME</span>
                <span className="text-indigo-400 font-semibold">3D Ellipsoid</span>
              </div>
              <div className="text-2xl font-bold font-mono text-white tabular-nums tracking-tight">
                {tumorMetrics.estimated_volume_cm3.toFixed(2)}{' '}
                <span className="text-xs font-sans font-normal text-slate-400">cm³ (mL)</span>
              </div>
              <div className="text-[11px] font-mono text-indigo-300">
                V = (π/6) × D₁ × D₂ × D₃
              </div>
              <p className="text-[10px] text-slate-400 leading-tight pt-1">
                Neuro-oncology volumetric model
              </p>
            </div>

            {/* Metric 3: RANO Caliper Dimensions */}
            <div className="bg-slate-800/90 rounded-md p-3.5 border border-slate-700/80 space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>CALIPER DIMENSIONS</span>
                <span className="text-amber-400 font-semibold">RANO / RECIST</span>
              </div>
              <div className="text-xl font-bold font-mono text-white tabular-nums tracking-tight">
                {tumorMetrics.major_axis_mm}{' '}
                <span className="text-xs text-slate-400">×</span>{' '}
                {tumorMetrics.minor_axis_mm}{' '}
                <span className="text-xs font-sans font-normal text-slate-400">mm</span>
              </div>
              <div className="text-[11px] font-mono text-amber-300">
                Major × Minor Caliper
              </div>
              <p className="text-[10px] text-slate-400 leading-tight pt-1">
                Perpendicular maximal axes
              </p>
            </div>

            {/* Metric 4: Brain Occupancy */}
            <div className="bg-slate-800/90 rounded-md p-3.5 border border-slate-700/80 space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>BRAIN OCCUPANCY</span>
                <span className="text-rose-400 font-semibold">Parenchyma %</span>
              </div>
              <div className="text-2xl font-bold font-mono text-white tabular-nums tracking-tight">
                {tumorMetrics.brain_occupancy_pct.toFixed(2)}{' '}
                <span className="text-xs font-sans font-normal text-slate-400">%</span>
              </div>
              <div className="text-[11px] font-mono text-rose-300">
                {tumorMetrics.pixel_count.toLocaleString()} / {tumorMetrics.total_brain_pixels.toLocaleString()} px
              </div>
              <p className="text-[10px] text-slate-400 leading-tight pt-1">
                Axial cross-section ratio
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <span className="text-slate-300 font-medium">Margin Status:</span>
              <span className="text-teal-300">{tumorMetrics.margin_status}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Pixel Resolution:</span>
              <span className="text-slate-300">0.7385 mm²/px</span>
            </div>
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs text-slate-600">
          <strong>U-Net Anatomical Interpretation:</strong> The segmentation output computes boundary
          probabilities at each spatial coordinate $(x, y)$. Elevated values delineate the focal lesion mass ({tumorMetrics.area_cm2.toFixed(2)} cm²)
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
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-slate-900 flex items-center justify-center text-teal-400 shrink-0 shadow-xs">
              <FileSearch className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  D. In-Depth Diagnostic Analysis & MRI Anatomical Findings
                </h2>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200 font-semibold">
                  WHO CNS5 Aligned
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Clinical Pathology Profiling · Tissue Structural Markers · Multi-Parametric MRI Matrix
              </p>
            </div>
          </div>

          {/* Sub-section Switcher */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-md border border-slate-200 text-xs">
            <button
              onClick={() => setDetailTab('overview')}
              className={`px-3 py-1.5 font-medium rounded transition-all whitespace-nowrap flex items-center gap-1.5 ${
                detailTab === 'overview'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              Executive Overview
            </button>
            <button
              onClick={() => setDetailTab('pathology')}
              className={`px-3 py-1.5 font-medium rounded transition-all whitespace-nowrap flex items-center gap-1.5 ${
                detailTab === 'pathology'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Dna className="w-3.5 h-3.5 text-indigo-600" />
              Class Pathology & Genetics
            </button>
            <button
              onClick={() => setDetailTab('anatomy')}
              className={`px-3 py-1.5 font-medium rounded transition-all whitespace-nowrap flex items-center gap-1.5 ${
                detailTab === 'anatomy'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-cyan-600" />
              Anatomical Landmarks & Risk
            </button>
            <button
              onClick={() => setDetailTab('radiology')}
              className={`px-3 py-1.5 font-medium rounded transition-all whitespace-nowrap flex items-center gap-1.5 ${
                detailTab === 'radiology'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-violet-600" />
              MRI Sequence Matrix
            </button>
            <button
              onClick={() => setDetailTab('workup')}
              className={`px-3 py-1.5 font-medium rounded transition-all whitespace-nowrap flex items-center gap-1.5 ${
                detailTab === 'workup'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
              Clinical Roadmap & Workup
            </button>
          </div>
        </div>

        {/* TAB 1: EXECUTIVE OVERVIEW */}
        {detailTab === 'overview' && (
          <div className="space-y-6 text-xs text-slate-600 leading-relaxed">
            {/* Primary Plain-Language Clinical Summary Card */}
            <div className="p-5 bg-gradient-to-br from-teal-50/70 via-slate-50 to-white rounded-lg border border-teal-200/80 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-teal-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-teal-600 text-white flex items-center justify-center shrink-0">
                    <Info className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                      Plain-Language Diagnostic Interpretation
                    </h3>
                    <span className="text-[11px] text-teal-800 font-medium">
                      Core findings summarized for clinicians, researchers, and patients
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-mono px-2.5 py-1 rounded-full font-semibold border ${
                      mriDetails.quantitativeRadiomics.urgencyLevel.includes('Emergency')
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : mriDetails.quantitativeRadiomics.urgencyLevel.includes('Urgent')
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    ● {mriDetails.quantitativeRadiomics.urgencyLevel}
                  </span>
                </div>
              </div>
              <p className="text-slate-700 text-xs sm:text-[13px] leading-relaxed pt-1">
                {mriDetails.plainExplanation}
              </p>
            </div>

            {/* Rapid Diagnostic Snapshot Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono text-[11px]">
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <span className="text-slate-400 block uppercase tracking-wider text-[10px]">
                  Classification Match
                </span>
                <span className="text-slate-900 font-bold text-sm block">
                  {mriDetails.quantitativeRadiomics.topClass}
                </span>
                <span className="text-teal-700 font-semibold">
                  {mriDetails.quantitativeRadiomics.confidencePct} Probability
                </span>
              </div>

              <div className="p-3.5 bg-teal-50/60 rounded-lg border border-teal-200 space-y-1">
                <span className="text-teal-700 block uppercase tracking-wider text-[10px] font-semibold">
                  Calibrated Tumor Area
                </span>
                <span className="text-slate-900 font-bold text-sm block">
                  {isTumor ? `${tumorMetrics.area_cm2.toFixed(2)} cm²` : '0.00 cm²'}
                </span>
                <span className="text-teal-800 text-[10px] block truncate">
                  {isTumor ? `${tumorMetrics.estimated_volume_cm3} cm³ vol · ${tumorMetrics.brain_occupancy_pct}%` : 'Intact Parenchyma'}
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <span className="text-slate-400 block uppercase tracking-wider text-[10px]">
                  Tissue Compartment
                </span>
                <span className="text-slate-900 font-semibold text-xs block truncate">
                  {mriDetails.pathology.categoryType}
                </span>
                <span className="text-slate-500 text-[10px] block truncate">
                  {mriDetails.quantitativeRadiomics.marginSharpness}
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <span className="text-slate-400 block uppercase tracking-wider text-[10px]">
                  Midline Shift Vector
                </span>
                <span className="text-slate-900 font-semibold text-xs block">
                  {mriDetails.tissueMetrics.midlineAssessment.includes('zero')
                    ? '0.0 mm (Strict Midline)'
                    : 'Sub-Centimeter Deviation'}
                </span>
                <span className="text-slate-500 text-[10px] block truncate">
                  {mriDetails.tissueMetrics.herniationRisk}
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <span className="text-slate-400 block uppercase tracking-wider text-[10px]">
                  Secondary Differential
                </span>
                <span className="text-slate-800 font-medium text-xs block">
                  {mriDetails.quantitativeRadiomics.secondaryClass}
                </span>
                <span className="text-slate-500 text-[10px]">
                  {mriDetails.quantitativeRadiomics.secondaryPct} Alternative Confidence
                </span>
              </div>
            </div>

            {/* Quick Biomarker & Anatomical Pearls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-slate-900 text-xs">
                  <Dna className="w-4 h-4 text-indigo-600" />
                  <span>Key Molecular Biomarkers Evaluated</span>
                </div>
                <ul className="space-y-1.5 list-disc pl-4 text-slate-600 text-[11px]">
                  {mriDetails.pathology.molecularBiomarkers.slice(0, 3).map((bio, idx) => (
                    <li key={idx}>{bio}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-white rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-slate-900 text-xs">
                  <Brain className="w-4 h-4 text-cyan-600" />
                  <span>Eloquent Brain Areas at Risk</span>
                </div>
                <ul className="space-y-1.5 list-disc pl-4 text-slate-600 text-[11px]">
                  {mriDetails.pathology.anatomicalRiskZones.slice(0, 3).map((zone, idx) => (
                    <li key={idx}>{zone}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CLASS PATHOLOGY & GENETICS */}
        {detailTab === 'pathology' && (
          <div className="space-y-6 text-xs text-slate-600 leading-relaxed">
            {/* Header Banner */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="font-bold text-slate-900 text-sm">
                  {mriDetails.pathology.title}
                </span>
                <span className="font-mono text-[11px] text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200 w-fit">
                  {mriDetails.pathology.categoryType}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2.5 border-t border-slate-200/60 font-mono text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">WHO CNS5 Grading Criteria:</span>
                  <span className="text-slate-800 font-medium">{mriDetails.pathology.whoGradingDetailed}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Cellular Origin:</span>
                  <span className="text-slate-800 font-medium">{mriDetails.pathology.originTissue}</span>
                </div>
              </div>
            </div>

            {/* Pathophysiology & Disease Mechanism */}
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Microscope className="w-3.5 h-3.5 text-teal-600" />
                Pathophysiology & Histomolecular Progression
              </h3>
              <p className="text-slate-700 bg-white p-4 rounded-lg border border-slate-200 leading-relaxed">
                {mriDetails.pathology.pathophysiology}
              </p>
            </div>

            {/* Molecular Genetics Panel */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2.5">
              <h4 className="font-bold text-slate-900 text-xs font-mono uppercase flex items-center gap-1.5">
                <Dna className="w-3.5 h-3.5 text-indigo-600" />
                Integrated Molecular & Genetic Biomarker Panel (WHO CNS5)
              </h4>
              <p className="text-[11px] text-slate-500">
                Modern neuro-oncology requires molecular characterization beyond histology alone:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                {mriDetails.pathology.molecularBiomarkers.map((bio, idx) => (
                  <div key={idx} className="p-2.5 bg-white rounded border border-slate-200 flex items-start gap-2">
                    <span className="text-indigo-600 font-bold shrink-0">#</span>
                    <span className="text-slate-800">{bio}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Anatomical Compartments & Clinical Symptoms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <h4 className="font-semibold text-slate-900 text-xs">
                  Typical Anatomical Predilections
                </h4>
                <ul className="space-y-1.5 list-disc pl-4 text-slate-600 text-[11px]">
                  {mriDetails.pathology.typicalLocations.map((loc, idx) => (
                    <li key={idx}>{loc}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <h4 className="font-semibold text-slate-900 text-xs">
                  Clinical Presentation & Neurological Deficits
                </h4>
                <ul className="space-y-1.5 list-disc pl-4 text-slate-600 text-[11px]">
                  {mriDetails.pathology.clinicalPresentation.map((sym, idx) => (
                    <li key={idx}>{sym}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Acute Pharmacotherapy & Support */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <h4 className="font-semibold text-slate-900 text-xs">
                Standard Pharmacological & Supportive Regimens
              </h4>
              <ul className="space-y-1.5 list-disc pl-4 text-slate-700 text-[11px]">
                {mriDetails.pathology.pharmacotherapyAndSupport.map((drug, idx) => (
                  <li key={idx}>{drug}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* TAB 3: ANATOMICAL LANDMARKS & TISSUE BREAKDOWN */}
        {detailTab === 'anatomy' && (
          <div className="space-y-6 text-xs text-slate-600 leading-relaxed">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono">
                  Slice Acquisition Orientation
                </span>
                <span className="font-mono text-teal-700 text-[11px] font-semibold">
                  {mriDetails.imageOrientation}
                </span>
              </div>
              <p className="text-slate-600 text-[11px]">
                The uploaded neuroimaging study represents an axial transverse neuroimaging cut through the cerebral hemispheres,
                permitting bilateral symmetric inspection of cortical mantles, subcortical tracts, basal cisterns, and ventricular cavities.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-teal-600" />
                Observable Anatomical Structures in This Section
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {mriDetails.anatomicalLandmarks.map((landmark, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white rounded-lg border border-slate-200 flex items-start gap-2.5 shadow-2xs"
                  >
                    <div className="w-5 h-5 rounded bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[10px] font-mono font-bold">{idx + 1}</span>
                    </div>
                    <span className="text-slate-800 text-[11px] font-medium">{landmark}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono">
                Structural & Compartment Assessment Matrix
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <span className="font-semibold text-slate-900 text-[11px] block">
                    Parenchymal Integrity
                  </span>
                  <p className="text-[11px] text-slate-600">
                    {mriDetails.tissueMetrics.parenchymalIntegrity}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <span className="font-semibold text-slate-900 text-[11px] block">
                    Ventricular Symmetry & CSF Pulsatility
                  </span>
                  <p className="text-[11px] text-slate-600">
                    {mriDetails.tissueMetrics.ventricularSymmetry}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <span className="font-semibold text-slate-900 text-[11px] block">
                    Midline Vector & Mass Displacement
                  </span>
                  <p className="text-[11px] text-slate-600">
                    {mriDetails.tissueMetrics.midlineAssessment}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <span className="font-semibold text-slate-900 text-[11px] block">
                    U-Net Segmentation & Perilesional Boundary
                  </span>
                  <p className="text-[11px] text-slate-600">
                    {mriDetails.tissueMetrics.edemaAssessment}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1 sm:col-span-2">
                  <span className="font-semibold text-slate-900 text-[11px] block">
                    Herniation & Intracranial Pressure (ICP) Assessment
                  </span>
                  <p className="text-[11px] text-slate-600">
                    {mriDetails.tissueMetrics.herniationRisk}
                  </p>
                </div>
              </div>
            </div>

            {/* Eloquent Cortex Proximity Card */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <h4 className="font-semibold text-slate-900 text-xs">
                Eloquent Cortex & Critical Functional Pathways
              </h4>
              <ul className="space-y-1.5 list-disc pl-4 text-slate-600 text-[11px]">
                {mriDetails.pathology.anatomicalRiskZones.map((zone, idx) => (
                  <li key={idx}>{zone}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* TAB 4: MRI SEQUENCES & SIGNAL MATRIX */}
        {detailTab === 'radiology' && (
          <div className="space-y-6 text-xs text-slate-600 leading-relaxed">
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono">
                  Multi-Parametric MRI Sequence Profile
                </h3>
                <span className="text-[11px] font-mono text-slate-500">
                  Standard Neuroimaging Protocols (T1, T2, FLAIR, DWI, MRS, PWI)
                </span>
              </div>
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 font-mono text-[11px] text-slate-500 uppercase border-b border-slate-200">
                    <tr>
                      <th className="px-3.5 py-2.5">Modality & Acronym</th>
                      <th className="px-3.5 py-2.5">Signal Behavior</th>
                      <th className="px-3.5 py-2.5">Characteristic Appearance</th>
                      <th className="px-3.5 py-2.5 hidden md:table-cell">Clinical Significance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[11px]">
                    {mriDetails.sequenceMatrix.map((seq, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="px-3.5 py-2.5 font-medium text-slate-900 font-mono">
                          <div>{seq.modality}</div>
                          <span className="text-[10px] text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">
                            {seq.acronym}
                          </span>
                        </td>
                        <td className="px-3.5 py-2.5">
                          <span
                            className={`font-mono text-[10px] px-2 py-0.5 rounded font-semibold ${
                              seq.signalBehavior === 'Hyperintense'
                                ? 'bg-amber-100 text-amber-800'
                                : seq.signalBehavior === 'Marked Enhancement'
                                ? 'bg-purple-100 text-purple-800'
                                : seq.signalBehavior === 'Heterogeneous'
                                ? 'bg-indigo-100 text-indigo-800'
                                : seq.signalBehavior === 'Hypointense'
                                ? 'bg-slate-200 text-slate-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {seq.signalBehavior}
                          </span>
                        </td>
                        <td className="px-3.5 py-2.5 text-slate-700 max-w-xs">
                          {seq.visualDescription}
                        </td>
                        <td className="px-3.5 py-2.5 text-slate-500 hidden md:table-cell max-w-xs">
                          {seq.clinicalSignificance}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quantitative Radiomics Summary */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2.5">
              <h4 className="font-bold text-slate-900 text-xs font-mono uppercase">
                Quantitative Radiomics Summary & Decision Boundary
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px]">Primary Class:</span>
                  <span className="text-slate-900 font-bold">
                    {mriDetails.quantitativeRadiomics.topClass} ({mriDetails.quantitativeRadiomics.confidencePct})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Alternative Match:</span>
                  <span className="text-slate-700">
                    {mriDetails.quantitativeRadiomics.secondaryClass} ({mriDetails.quantitativeRadiomics.secondaryPct})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Border Character:</span>
                  <span className="text-slate-700">{mriDetails.quantitativeRadiomics.marginSharpness}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Clinical Triage:</span>
                  <span className="text-teal-700 font-semibold">{mriDetails.quantitativeRadiomics.riskStratification}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: DIFFERENTIAL & CLINICAL ROADMAP */}
        {detailTab === 'workup' && (
          <div className="space-y-6 text-xs text-slate-600 leading-relaxed">
            {/* Differential Diagnosis Breakdown */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                <Stethoscope className="w-4 h-4 text-teal-700" />
                <h4>Radiological Differential Diagnosis & Critical Distinguishers</h4>
              </div>
              <p className="text-[11px] text-slate-500">
                Pathologies sharing overlapping morphological or intensity characteristics that neuroradiologists evaluate:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {mriDetails.pathology.differentialDiagnosis.map((item, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">{item.condition}</span>
                      <span className="text-[10px] font-mono text-slate-400">Mimic #{idx + 1}</span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      <strong>Clinical Clue:</strong> {item.distinguishingFeatures}
                    </p>
                    <p className="text-[11px] text-teal-800 bg-teal-50/70 p-2 rounded border border-teal-100">
                      <strong>MRI Discriminator:</strong> {item.imagingDiscriminator}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Surgical & Radiotherapy Strategy */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-xs font-mono uppercase flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-teal-700" />
                Neurosurgical & Radiation Oncology Management
              </h4>
              <p className="text-slate-700 text-xs leading-relaxed">
                {mriDetails.pathology.surgicalRadiotherapyApproach}
              </p>
            </div>

            {/* Confirmatory Workup Recommendations */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2.5">
              <h4 className="font-bold text-slate-900 text-xs font-mono uppercase">
                Confirmatory Diagnostic Roadmap
              </h4>
              <ul className="space-y-1.5 list-disc pl-4 text-slate-700 text-[11px]">
                {mriDetails.pathology.confirmatoryRecommendations.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Regulatory Disclaimer */}
            <div className="p-3 bg-amber-50/70 rounded-lg border border-amber-200 text-amber-900 text-[11px] flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>Research Prototype Guidance:</strong> Automated neural classification should always be correlated
                with clinical symptomatology, laboratory markers, and multidisciplinary neuro-oncology tumor board review.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
