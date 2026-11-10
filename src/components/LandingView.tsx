/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ActiveTab } from '../types/analysis';
import {
  ArrowRight,
  Cpu,
  Layers,
  Eye,
  ShieldCheck,
  CheckCircle2,
  Share2,
  FileCheck,
  Scan,
  Activity,
  Sparkles,
  Maximize2,
  Sliders,
} from 'lucide-react';
import mriBrainAxialScan from '../assets/images/mri_brain_axial_scan_1794122030039.jpg';
import mriInterfacePreview from '../assets/images/mri_interface_preview_1794122030875.jpg';

interface LandingViewProps {
  onTabChange: (tab: ActiveTab) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onTabChange }) => {
  const [previewMode, setPreviewMode] = useState<'scan' | 'unet' | 'gradcam'>('scan');
  const [imgSrc, setImgSrc] = useState<string>(mriBrainAxialScan || '/images/mri_brain_axial_scan.jpg');
  const [imgError, setImgError] = useState(false);
  const [interfaceImgSrc, setInterfaceImgSrc] = useState<string>(
    mriInterfacePreview || '/images/mri_interface_preview.jpg'
  );
  return (
    <div className="space-y-16 py-8">
      {/* 1. Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 uppercase tracking-wider">
              <span>Deep Learning Neuroimaging</span>
              <span aria-hidden="true">·</span>
              <span>Research & Educational Prototype</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 text-balance leading-tight">
              Advanced Brain MRI Analysis
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl text-pretty">
              An educational and research platform providing automated magnetic resonance imaging classification,
              U-Net anatomical lesion segmentation, and Grad-CAM visual interpretability for neuroimaging inquiry.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onTabChange('analyze')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white text-sm font-medium rounded transition-colors shadow-sm"
              >
                <span>Start New Analysis</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('architecture-overview');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium rounded border border-slate-300 transition-colors"
              >
                <span>Explore Platform</span>
              </button>
            </div>

            {/* Key Clinical Capabilities Specs */}
            <div className="pt-6 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs">
              <div>
                <span className="block font-mono text-slate-400 uppercase text-[11px] mb-1">
                  Classifier
                </span>
                <span className="font-semibold text-slate-900">EfficientNetB0</span>
                <span className="block text-slate-500 text-[11px]">4 Target Classes</span>
              </div>
              <div>
                <span className="block font-mono text-slate-400 uppercase text-[11px] mb-1">
                  Segmentation
                </span>
                <span className="font-semibold text-slate-900">U-Net Architecture</span>
                <span className="block text-slate-500 text-[11px]">Pixel-wise Lesion Mask</span>
              </div>
              <div>
                <span className="block font-mono text-slate-400 uppercase text-[11px] mb-1">
                  Explainability
                </span>
                <span className="font-semibold text-slate-900">Grad-CAM Saliency</span>
                <span className="block text-slate-500 text-[11px]">Gradient Heatmap</span>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Medical MRI Visual Preview */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900 rounded-xl p-3 sm:p-3.5 shadow-2xl border border-slate-800 space-y-3">
              {/* Scan Header Bar */}
              <div className="flex items-center justify-between px-2 py-1 text-[11px] font-mono text-slate-400 border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                  <span className="text-teal-400 font-semibold tracking-wide">
                    AXIAL T1-WEIGHTED MRI PREVIEW
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span className="text-slate-300 font-medium">SLICE 25/40</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-500 text-[10px]">3.0mm</span>
                </div>
              </div>

              {/* Viewport Frame: Guaranteed Permanent Display (Zero Black Screen) */}
              <div className="relative aspect-square overflow-hidden rounded-lg bg-slate-950 border border-slate-800/80 shadow-inner select-none">
                {/* 1. LAYER 1: Permanent High-Fidelity Anatomical Neuroimaging SVG Vector (Always Visible) */}
                <div className="absolute inset-0 flex items-center justify-center bg-radial from-slate-900 to-[#020617]">
                  <svg
                    viewBox="0 0 500 500"
                    className="w-full h-full p-4 drop-shadow-[0_0_20px_rgba(15,23,42,0.8)]"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <radialGradient id="craniumGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#334155" stopOpacity="0.9" />
                        <stop offset="70%" stopColor="#1e293b" stopOpacity="0.95" />
                        <stop offset="95%" stopColor="#0f172a" stopOpacity="1" />
                        <stop offset="100%" stopColor="#020617" stopOpacity="1" />
                      </radialGradient>
                      <radialGradient id="brainTissueGrad" cx="50%" cy="50%" r="48%">
                        <stop offset="0%" stopColor="#64748b" stopOpacity="0.85" />
                        <stop offset="50%" stopColor="#475569" stopOpacity="0.9" />
                        <stop offset="85%" stopColor="#334155" stopOpacity="0.95" />
                        <stop offset="100%" stopColor="#1e293b" stopOpacity="1" />
                      </radialGradient>
                      <radialGradient id="lesionGrad" cx="45%" cy="45%" r="50%">
                        <stop offset="0%" stopColor="#f8fafc" stopOpacity="0.95" />
                        <stop offset="35%" stopColor="#cbd5e1" stopOpacity="0.9" />
                        <stop offset="70%" stopColor="#94a3b8" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#475569" stopOpacity="0" />
                      </radialGradient>
                      <radialGradient id="gradcamGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.85" />
                        <stop offset="40%" stopColor="#eab308" stopOpacity="0.65" />
                        <stop offset="75%" stopColor="#06b6d4" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                      </radialGradient>
                    </defs>

                    {/* Scalp & Outer Calvarial Contour */}
                    <ellipse cx="250" cy="250" rx="198" ry="224" stroke="#475569" strokeWidth="6" strokeOpacity="0.5" />
                    <ellipse cx="250" cy="250" rx="192" ry="218" fill="url(#craniumGrad)" />
                    <ellipse cx="250" cy="250" rx="180" ry="204" stroke="#64748b" strokeWidth="2.5" strokeOpacity="0.4" />

                    {/* Subarachnoid Space & Cerebral Parenchyma */}
                    <ellipse cx="250" cy="250" rx="172" ry="196" fill="url(#brainTissueGrad)" />

                    {/* Cortical Gyri & Sulcal Convolutions */}
                    <path
                      d="M 120 180 Q 140 160 160 190 T 200 170 T 240 180"
                      stroke="#1e293b"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeOpacity="0.6"
                    />
                    <path
                      d="M 380 180 Q 360 160 340 190 T 300 170 T 260 180"
                      stroke="#1e293b"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeOpacity="0.6"
                    />
                    <path
                      d="M 110 260 Q 140 250 150 280 T 190 270"
                      stroke="#1e293b"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeOpacity="0.6"
                    />
                    <path
                      d="M 390 260 Q 360 250 350 280 T 310 270"
                      stroke="#1e293b"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeOpacity="0.6"
                    />
                    <path
                      d="M 140 340 Q 170 330 200 350 T 240 330"
                      stroke="#1e293b"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeOpacity="0.6"
                    />
                    <path
                      d="M 360 340 Q 330 330 300 350 T 260 330"
                      stroke="#1e293b"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeOpacity="0.6"
                    />

                    {/* Longitudinal Interhemispheric Fissure & Falx Cerebri */}
                    <line x1="250" y1="60" x2="250" y2="440" stroke="#0f172a" strokeWidth="3" strokeOpacity="0.8" />
                    <line x1="250" y1="120" x2="250" y2="380" stroke="#cbd5e1" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="3 3" />

                    {/* Symmetrical Lateral Ventricles (Frontal & Occipital Horns, CSF Signal) */}
                    {/* Left Ventricle (Radiological Right) */}
                    <path
                      d="M 238 185 C 220 180 205 210 215 240 C 225 270 238 300 238 320 C 242 300 245 260 242 220 Z"
                      fill="#020617"
                      stroke="#1e293b"
                      strokeWidth="2"
                    />
                    {/* Right Ventricle (Radiological Left) */}
                    <path
                      d="M 262 185 C 280 180 295 210 285 240 C 275 270 262 300 262 320 C 258 300 255 260 258 220 Z"
                      fill="#020617"
                      stroke="#1e293b"
                      strokeWidth="2"
                    />

                    {/* Septum Pellucidum & Third Ventricle Cavity */}
                    <ellipse cx="250" cy="250" rx="3" ry="24" fill="#020617" />

                    {/* Basal Ganglia & Thalamic Nuclear Complexes */}
                    <ellipse cx="205" cy="255" rx="18" ry="28" fill="#334155" fillOpacity="0.5" />
                    <ellipse cx="295" cy="255" rx="18" ry="28" fill="#334155" fillOpacity="0.5" />

                    {/* Focal Lesion Nidus (Fronto-Parietal Region) */}
                    <ellipse cx="175" cy="210" rx="42" ry="38" fill="url(#lesionGrad)" />
                    <ellipse cx="175" cy="210" rx="28" ry="24" fill="#f1f5f9" fillOpacity="0.8" />
                    <circle cx="175" cy="210" r="14" fill="#ffffff" fillOpacity="0.95" />

                    {/* Centering Target Crosshairs */}
                    <line x1="155" y1="210" x2="195" y2="210" stroke="#0d9488" strokeWidth="1" strokeOpacity="0.7" />
                    <line x1="175" y1="190" x2="175" y2="230" stroke="#0d9488" strokeWidth="1" strokeOpacity="0.7" />
                    <circle cx="175" cy="210" r="22" stroke="#0d9488" strokeWidth="1" strokeOpacity="0.5" strokeDasharray="2 2" />
                  </svg>
                </div>

                {/* 2. LAYER 2: Actual Real MRI Scan Image (Loads on Top With Automatic Fallbacks) */}
                {!imgError && (
                  <img
                    src={imgSrc}
                    alt="Axial brain MRI diagnostic slice preview"
                    referrerPolicy="no-referrer"
                    onError={() => {
                      if (imgSrc !== '/images/mri_brain_axial_scan.jpg') {
                        setImgSrc('/images/mri_brain_axial_scan.jpg');
                      } else {
                        setImgError(true);
                      }
                    }}
                    className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-90 transition-opacity duration-300"
                  />
                )}

                {/* 3. LAYER 3: U-Net Lesion Boundary Segmentation Mode Overlay */}
                {previewMode === 'unet' && (
                  <div className="absolute inset-0 pointer-events-none transition-all duration-300 animate-in fade-in">
                    <svg viewBox="0 0 500 500" className="w-full h-full" fill="none">
                      {/* Semi-transparent cyan mask */}
                      <ellipse
                        cx="175"
                        cy="210"
                        rx="46"
                        ry="42"
                        fill="#0d9488"
                        fillOpacity="0.32"
                        stroke="#14b8a6"
                        strokeWidth="2.5"
                        strokeDasharray="4 2"
                      />
                      <ellipse
                        cx="175"
                        cy="210"
                        rx="30"
                        ry="26"
                        fill="#2dd4bf"
                        fillOpacity="0.4"
                        stroke="#5eead4"
                        strokeWidth="1.5"
                      />
                      <line x1="175" y1="168" x2="175" y2="152" stroke="#14b8a6" strokeWidth="1.5" />
                      <text x="175" y="146" fill="#2dd4bf" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                        U-Net Mask: 6.84 cm² (Dice: 0.912)
                      </text>
                    </svg>
                  </div>
                )}

                {/* 4. LAYER 4: Grad-CAM Saliency Heatmap Mode Overlay */}
                {previewMode === 'gradcam' && (
                  <div className="absolute inset-0 pointer-events-none transition-all duration-300 animate-in fade-in">
                    <svg viewBox="0 0 500 500" className="w-full h-full" fill="none">
                      <circle cx="175" cy="210" r="75" fill="url(#gradcamGrad)" />
                      <line x1="240" y1="210" x2="270" y2="210" stroke="#f87171" strokeWidth="1.5" />
                      <text x="278" y="214" fill="#fca5a5" fontSize="11" fontFamily="monospace" fontWeight="bold">
                        Grad-CAM Saliency: 98.4%
                      </text>
                    </svg>
                  </div>
                )}

                {/* 5. HUD Telemetry & Spatial Positioning Badges */}
                {/* Anatomical Orientation Coordinates */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-slate-400 bg-slate-900/70 px-1.5 py-0.5 rounded border border-slate-700/40">
                  A (Anterior)
                </div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-slate-400 bg-slate-900/70 px-1.5 py-0.5 rounded border border-slate-700/40">
                  P (Posterior)
                </div>
                <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-slate-400 bg-slate-900/70 px-1.5 py-0.5 rounded border border-slate-700/40">
                  R
                </div>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-slate-400 bg-slate-900/70 px-1.5 py-0.5 rounded border border-slate-700/40">
                  L
                </div>

                {/* Acquisition Metadata Overlay (Top-Left) */}
                <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md px-2.5 py-1.5 rounded text-[10px] font-mono text-slate-200 border border-slate-700/60 space-y-0.5 shadow-md">
                  <div>FOV: 220mm × 220mm</div>
                  <div>TE: 10ms · TR: 500ms</div>
                </div>

                {/* Active Mode Badge (Top-Right) */}
                <div className="absolute top-3 right-3 bg-slate-900/85 backdrop-blur-md px-2.5 py-1.5 rounded text-[10px] font-mono border shadow-md font-semibold text-teal-300 border-teal-800/60">
                  {previewMode === 'scan' && 'T1W Native Scan'}
                  {previewMode === 'unet' && 'U-Net Lesion Mask'}
                  {previewMode === 'gradcam' && 'Grad-CAM Attention'}
                </div>

                {/* Target Telemetry (Bottom-Left) */}
                <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-mono text-slate-300 border border-slate-700/60">
                  Target: Right Frontal Lobe
                </div>

                {/* Calibration Status (Bottom-Right) */}
                <div className="absolute bottom-3 right-3 bg-slate-900/85 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-mono text-emerald-400 border border-emerald-800/60 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Neural Ready
                </div>
              </div>

              {/* Interactive Layer Switcher Strip */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950/90 rounded-lg border border-slate-800 text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => setPreviewMode('scan')}
                  className={`py-1.5 px-2 rounded font-medium transition-all text-center ${
                    previewMode === 'scan'
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  T1W Scan
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode('unet')}
                  className={`py-1.5 px-2 rounded font-medium transition-all text-center flex items-center justify-center gap-1 ${
                    previewMode === 'unet'
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Layers className="w-3 h-3 text-teal-400" />
                  + U-Net Mask
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode('gradcam')}
                  className={`py-1.5 px-2 rounded font-medium transition-all text-center flex items-center justify-center gap-1 ${
                    previewMode === 'gradcam'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40 shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Eye className="w-3 h-3 text-red-400" />
                  + Grad-CAM
                </button>
              </div>

              {/* Action Bar */}
              <div className="px-2 pt-1 flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono text-[11px] text-slate-400">
                  Pre-configured sample slice
                </span>
                <button
                  onClick={() => onTabChange('analyze')}
                  className="inline-flex items-center gap-1.5 text-teal-400 hover:text-teal-300 font-semibold transition-colors font-mono text-xs"
                >
                  <span>Analyze This Scan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interface Showcase Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg border border-slate-200 p-6 md:p-8 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="text-xs font-mono uppercase text-slate-500">
                Analytical Workstation
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Tri-Modal Visual Intelligence
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                NeuroScan AI bridges high-accuracy convolutional inference with spatial localization. Radiologists
                and researchers can inspect raw MRI scans alongside computed boundary masks and gradient backpropagation
                activation maps in a single unified view.
              </p>

              <div className="space-y-3 pt-2 text-xs text-slate-700">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Multi-class confidence distribution:</strong> Real-time probability estimation across Glioma,
                    Meningioma, Pituitary, and normal tissue.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Semantic lesion segmentation:</strong> Delineating suspected margins via deep encoder-decoder
                    skip connections.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Gradient-weighted activation maps:</strong> Verifying which anatomical spatial features drove the
                    classification decision.
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-lg border border-slate-200 overflow-hidden shadow-sm bg-slate-950 min-h-[260px] flex items-center justify-center relative">
                <img
                  src={interfaceImgSrc}
                  alt="NeuroScan AI clinical analytical workstation display"
                  referrerPolicy="no-referrer"
                  onError={() => {
                    if (interfaceImgSrc !== '/images/mri_interface_preview.jpg') {
                      setInterfaceImgSrc('/images/mri_interface_preview.jpg');
                    }
                  }}
                  className="w-full h-auto object-cover max-h-[380px]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Deep Learning Architecture Highlights */}
      <section id="architecture-overview" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="text-xs font-mono uppercase text-slate-500 mb-1">
            System Architecture
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Three Core Deep Learning Pillars
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Each scan processed through the platform undergoes a rigorous computational pipeline designed to maximize
            interpretability and educational insight.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: EfficientNetB0 */}
          <div className="bg-white rounded border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center text-slate-900">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                EfficientNetB0 Classification
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Compound Scaling Transfer Learning
              </p>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Employs mobile inverted bottleneck convolutions (MBConv) optimized across resolution, depth, and channel width.
              Outputs calibrated softmax probabilities for Glioma, Meningioma, Pituitary, and No Tumor.
            </p>
            <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 font-mono">
              Input: 224×224×3 · Softmax Output
            </div>
          </div>

          {/* Card 2: U-Net */}
          <div className="bg-white rounded border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center text-teal-700">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                U-Net Lesion Segmentation
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Encoder-Decoder with Skip Connections
              </p>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Combines contracting feature extraction with expanding upsampling paths. Direct lateral skip connections copy
              fine spatial grain from early layers to predict exact lesion boundaries and pixel masks.
            </p>
            <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 font-mono">
              Resolution: Full Matrix · Binary Dice Loss
            </div>
          </div>

          {/* Card 3: Grad-CAM */}
          <div className="bg-white rounded border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center text-amber-700">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Grad-CAM Saliency Maps
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Visual Gradient Interpretability
              </p>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Backpropagates class-specific gradient flows to the final convolutional feature maps, creating a visual heatmap
              highlighting the exact anatomical sub-regions that triggered the network's diagnosis.
            </p>
            <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 font-mono">
              Saliency Backprop · Jet Colormap
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => onTabChange('analyze')}
            className="text-xs font-medium text-slate-800 hover:text-slate-900 underline underline-offset-4"
          >
            Start MRI Diagnostic Analysis →
          </button>
        </div>
      </section>

      {/* 4. Target Classes Breakdown */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 rounded border border-slate-200 p-6 md:p-8">
          <div className="max-w-2xl mb-6">
            <div className="text-xs font-mono uppercase text-slate-500 mb-1">
              Differential Pathology
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Four Supported Diagnostic Categories
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              The model evaluates axial, sagittal, and coronal MRI slices against the four primary neurological classification targets:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="bg-white p-4 rounded border border-slate-200 space-y-1.5">
              <div className="font-semibold text-slate-900">Glioma</div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Intra-axial neoplasms originating in neuroglial progenitor cells (astrocytomas, oligodendrogliomas, glioblastoma multiforme).
              </p>
            </div>
            <div className="bg-white p-4 rounded border border-slate-200 space-y-1.5">
              <div className="font-semibold text-slate-900">Meningioma</div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Predominantly benign, slow-growing extra-axial lesions arising from arachnoid cap cells adherent to the dura mater.
              </p>
            </div>
            <div className="bg-white p-4 rounded border border-slate-200 space-y-1.5">
              <div className="font-semibold text-slate-900">Pituitary</div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Endocrine neoplasms occurring within the sella turcica, commonly microadenomas or macroadenomas altering visual chiasm.
              </p>
            </div>
            <div className="bg-white p-4 rounded border border-slate-200 space-y-1.5">
              <div className="font-semibold text-slate-900">No Tumor</div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Normal neurocranial baseline without detectable neoplastic mass effect, midline shift, or focal enhancement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Educational Research Notice */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded border border-amber-200 bg-amber-50/50 p-6 flex flex-col md:flex-row items-start gap-4">
          <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <h3 className="font-semibold text-amber-950">
              Educational & Scientific Research Prototype Disclaimer
            </h3>
            <p className="text-amber-900/80 leading-relaxed">
              NeuroScan AI is developed strictly for computational neuroscience education, algorithmic benchmarking,
              and academic research. This software is not certified as a medical device (CE-IVD or FDA 510(k)) and is
              not authorized for clinical diagnostic, surgical, or therapeutic use. Clinical evaluations require certified
              radiologists and calibrated clinical PACS viewing systems.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
