/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ActiveTab, AnalysisResult, getTumorMetrics } from '../types/analysis';
import {
  Upload,
  Activity,
  Layers,
  Cpu,
  Eye,
  FileText,
  Clock,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Database,
  Trash2,
  Lock,
} from 'lucide-react';

interface DashboardViewProps {
  analyses: AnalysisResult[];
  onTabChange: (tab: ActiveTab) => void;
  onSelectResult: (result: AnalysisResult) => void;
  onClearHistory: () => void;
  currentUser: import('firebase/auth').User | import('../services/firebase').AppUser | null;
  onOpenAuthModal: (reason?: string) => void;
  onDeleteAnalysis?: (id: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  analyses,
  onTabChange,
  onSelectResult,
  onClearHistory,
  currentUser,
  onOpenAuthModal,
  onDeleteAnalysis,
}) => {
  const totalCount = analyses.length;
  const lastAnalysis = analyses[0] || null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Clinician status banner if not signed in */}
      {!currentUser && (
        <div className="p-3.5 rounded border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-2.5 text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <div>
              <span className="font-semibold text-slate-900">
                Clinician Session Active
              </span>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Diagnostic reports are automatically saved to your browser. Sign in to sync patient records with Cloud Firestore.
              </p>
            </div>
          </div>
          <button
            onClick={() => onOpenAuthModal('Sign in to sync your diagnostic analyses across devices.')}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded text-xs transition-colors shrink-0 whitespace-nowrap shadow-xs"
          >
            Cloud Account Sign In
          </button>
        </div>
      )}

      {/* 1. Header & Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 uppercase tracking-wider">
            <span>Workstation Console</span>
            <span aria-hidden="true">·</span>
            <span>
              {currentUser ? `User: ${currentUser.email || currentUser.displayName}` : 'Guest Session'}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
            NeuroScan AI Analysis Dashboard
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-xl">
            Real-time session telemetry, automated inference history, and deep learning pipeline diagnostics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onTabChange('analyze')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded transition-colors shadow-sm"
          >
            <Upload className="w-4 h-4" />
            <span>Upload New MRI Scan</span>
          </button>
        </div>
      </div>

      {/* 2. Platform Telemetry & Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Completed Analyses */}
        <div className="bg-white rounded border border-slate-200 p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-mono uppercase text-[11px]">Total Analyses</span>
            <Activity className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {totalCount}
          </div>
          <p className="text-[11px] text-slate-500">
            {totalCount > 0
              ? `${totalCount} scan${totalCount === 1 ? '' : 's'} verified in active session`
              : 'Awaiting first MRI submission'}
          </p>
        </div>

        {/* Metric 2: Neural Inference Engine */}
        <div className="bg-white rounded border border-slate-200 p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-mono uppercase text-[11px]">Neural Inference Engine</span>
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
          </div>
          <div className="flex items-center gap-2 pt-0.5">
            <span className="text-sm font-semibold text-teal-700">
              Active & Ready
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              (24/7 Permanent)
            </span>
          </div>
          <span className="text-[11px] text-slate-500 block pt-1 font-mono truncate">
            EfficientNetB0 + U-Net + Grad-CAM
          </span>
        </div>

        {/* Metric 3: Active Target Classes */}
        <div className="bg-white rounded border border-slate-200 p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-mono uppercase text-[11px]">Classification Target</span>
            <Cpu className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-sm font-semibold text-slate-900 pt-0.5">
            4-Class Multitask
          </div>
          <p className="text-[11px] text-slate-500 font-mono">
            Glioma · Meningioma · Pituitary · No Tumor
          </p>
        </div>

        {/* Metric 4: Latest Analysis Timestamp */}
        <div className="bg-white rounded border border-slate-200 p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-mono uppercase text-[11px]">Latest Activity</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-sm font-semibold text-slate-900 pt-0.5">
            {lastAnalysis ? (
              <span className="font-mono text-xs">
                {new Date(lastAnalysis.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </span>
            ) : (
              'None Recorded'
            )}
          </div>
          <p className="text-[11px] text-slate-500">
            {lastAnalysis ? lastAnalysis.filename : 'Session history is clear'}
          </p>
        </div>
      </div>

      {/* 3. Deep Learning Model Info Bar */}
      <div className="bg-white rounded border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Active Computational Pipeline
            </h2>
            <p className="text-xs text-slate-500">
              Verified neural network layers configured on backend proxy endpoint.
            </p>
          </div>
          <button
            onClick={() => onTabChange('analyze')}
            className="text-xs text-teal-700 hover:text-teal-800 font-medium inline-flex items-center gap-1"
          >
            <span>Scan New MRI</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3 rounded bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-semibold text-slate-900 flex items-center justify-between">
              <span>EfficientNetB0</span>
              <span className="text-[10px] font-mono text-slate-500">Classifier</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Trained on brain MRI scans. Extracts compound depth/width features and yields 4-class categorical probabilities.
            </p>
          </div>

          <div className="p-3 rounded bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-semibold text-slate-900 flex items-center justify-between">
              <span>U-Net</span>
              <span className="text-[10px] font-mono text-slate-500">Segmentation</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Contracting encoder with symmetric expansion and lateral skip connections for pixel-level lesion boundary localization.
            </p>
          </div>

          <div className="p-3 rounded bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-semibold text-slate-900 flex items-center justify-between">
              <span>Grad-CAM</span>
              <span className="text-[10px] font-mono text-slate-500">Explainability</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Gradient-weighted class activation mapping producing spatial visual heatmaps of the penultimate convolutional layer.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Recent Activity Table */}
      <div className="bg-white rounded border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Recent MRI Analyses
            </h2>
            <p className="text-xs text-slate-500">
              Verified backend results from your current browser session.
            </p>
          </div>

          {totalCount > 0 && (
            <button
              onClick={onClearHistory}
              className="text-xs text-slate-500 hover:text-rose-600 transition-colors"
            >
              Clear Session
            </button>
          )}
        </div>

        {totalCount === 0 ? (
          /* Empty State as explicitly demanded: "Do not display fabricated statistics. Use empty states until actual data is available." */
          <div className="py-16 px-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Database className="w-6 h-6" />
            </div>
            <div className="max-w-sm mx-auto space-y-1">
              <h3 className="text-sm font-semibold text-slate-900">
                No analyses performed yet
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Upload a DICOM-derived JPG, JPEG, or PNG brain MRI slice to execute the EfficientNetB0, U-Net, and Grad-CAM inference pipeline.
              </p>
            </div>
            <div>
              <button
                onClick={() => onTabChange('analyze')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload First Scan</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-mono text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">Scan Ref</th>
                  <th className="px-6 py-3">Timestamp</th>
                  <th className="px-6 py-3">Source File</th>
                  <th className="px-6 py-3">Classification</th>
                  <th className="px-6 py-3">Tumor Area</th>
                  <th className="px-6 py-3 text-right">Confidence</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {analyses.map((item) => {
                  const tm = getTumorMetrics(item);
                  const isLesion = String(item.predicted_class).toLowerCase() !== 'no tumor';
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-3.5 font-mono text-slate-900 font-medium">
                        {item.id}
                      </td>
                      <td className="px-6 py-3.5 text-slate-500 font-mono">
                        {new Date(item.timestamp).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-6 py-3.5 text-slate-900 max-w-[200px] truncate">
                        {item.filename}
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="font-medium text-slate-900">
                          {item.predicted_class}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 font-mono text-xs">
                        {isLesion ? (
                          <span className="text-rose-700 font-semibold">
                            {tm.area_cm2.toFixed(2)} cm²{' '}
                            <span className="text-slate-400 font-normal text-[10px]">({tm.area_mm2.toLocaleString()} mm²)</span>
                          </span>
                        ) : (
                          <span className="text-emerald-700 font-normal">
                            0.00 cm² (Intact)
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3.5 text-right font-mono font-medium text-slate-900 tabular-nums">
                        {(item.confidence * 100).toFixed(1)}%
                      </td>
                      <td className="px-6 py-3.5 text-right flex items-center justify-end gap-3">
                        <button
                          onClick={() => {
                            onSelectResult(item);
                            onTabChange('results');
                          }}
                          className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-800 font-medium"
                        >
                          <span>View Results</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      {onDeleteAnalysis && (
                        <button
                          onClick={() => onDeleteAnalysis(item.id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
