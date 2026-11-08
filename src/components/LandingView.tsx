/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
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
} from 'lucide-react';

interface LandingViewProps {
  onTabChange: (tab: ActiveTab) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onTabChange }) => {
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
            <div className="bg-slate-900 rounded-lg p-2.5 shadow-xl border border-slate-800">
              <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800 text-[11px] font-mono text-slate-400">
                <span className="text-teal-400">AXIAL T1-WEIGHTED MRI PREVIEW</span>
                <span>SLICE 25/40</span>
              </div>

              <div className="relative aspect-square overflow-hidden rounded bg-black mt-2">
                <img
                  src="/src/assets/images/mri_brain_axial_scan_1794122030039.jpg"
                  alt="Axial brain MRI diagnostic slice preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />

                {/* Clinical telemetry overlay */}
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm px-2.5 py-1.5 rounded text-[10px] font-mono text-slate-200 border border-slate-700/60 space-y-0.5">
                  <div>FOV: 220mm × 220mm</div>
                  <div>TE: 10ms · TR: 500ms</div>
                </div>

                <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-sm px-2.5 py-1.5 rounded text-[10px] font-mono text-teal-300 border border-teal-800/60">
                  U-Net & Grad-CAM Calibrated
                </div>
              </div>

              <div className="p-3 text-xs text-slate-400 flex items-center justify-between">
                <span>Diagnostic sequence: T1W Contrast</span>
                <button
                  onClick={() => onTabChange('analyze')}
                  className="text-teal-400 hover:text-teal-300 font-medium transition-colors"
                >
                  Analyze Sample Scan →
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
              <div className="rounded border border-slate-200 overflow-hidden shadow-sm bg-slate-950">
                <img
                  src="/src/assets/images/mri_interface_preview_1794122030875.jpg"
                  alt="NeuroScan AI clinical analytical workstation display"
                  referrerPolicy="no-referrer"
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
