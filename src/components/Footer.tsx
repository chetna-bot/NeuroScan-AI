/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ActiveTab } from '../types/analysis';
import { ShieldAlert, Cpu } from 'lucide-react';

interface FooterProps {
  onTabChange: (tab: ActiveTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onTabChange }) => {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 text-xs mt-auto">
      {/* Educational Prototype Disclaimer Bar */}
      <div className="bg-slate-50 border-b border-slate-200 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-start sm:items-center gap-3">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-slate-600 leading-relaxed text-xs">
            <strong className="text-slate-900 font-medium">Educational & Research Prototype:</strong>{' '}
            NeuroScan AI is strictly an educational research platform designed to demonstrate deep learning
            in neuroimaging (EfficientNetB0, U-Net, Grad-CAM). It is not a medical device, is not cleared by regulatory
            authorities (FDA/CE-IVD), and must not be utilized for medical diagnosis, clinical decisions, or patient treatment.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900 text-sm tracking-tight">
                NeuroScan AI
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-500 font-mono text-xs">Brain MRI Analysis Platform</span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed max-w-md">
              Demonstrating automated magnetic resonance imaging classification, semantic lesion boundary
              segmentation, and gradient-weighted saliency localization for academic and scientific inquiry.
            </p>
            <div className="flex items-center gap-3 text-slate-500 text-xs pt-1">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-teal-600" />
                <span>TensorFlow & Keras Core</span>
              </span>
              <span>·</span>
              <span>FastAPI Backend Proxy</span>
            </div>
          </div>

          <div>
            <div className="text-slate-900 font-medium mb-3 text-xs uppercase tracking-wider">
              Platform Views
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onTabChange('landing')}
                  className="hover:text-slate-900 transition-colors"
                >
                  Overview & Introduction
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange('dashboard')}
                  className="hover:text-slate-900 transition-colors"
                >
                  Analysis Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange('analyze')}
                  className="hover:text-slate-900 transition-colors"
                >
                  MRI Scan Analyzer
                </button>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-slate-900 font-medium mb-3 text-xs uppercase tracking-wider">
              Diagnostic Target Classes
            </div>
            <ul className="space-y-2 text-xs text-slate-500 font-mono">
              <li>Glioma (Intra-axial glial mass)</li>
              <li>Meningioma (Dural-based extra-axial)</li>
              <li>Pituitary (Sellar/suprasellar)</li>
              <li>No Tumor (Normal brain anatomy)</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} NeuroScan AI. Research & Educational Demonstration Platform.</p>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Interpretable AI</span>
            <span>·</span>
            <span>Scientific Computing</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
