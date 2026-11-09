/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { jsPDF } from 'jspdf';
import { AnalysisResult } from '../types/analysis';
import { getMriDetailedAnalysis } from './mriDiagnosisExplainer';

export async function generateMriPdfReport(
  analysis: AnalysisResult,
  userEmail?: string | null,
  userName?: string | null
): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // Colors
  const navyColor = [15, 23, 42]; // #0F172A
  const slate600 = [71, 85, 105]; // #475569
  const slate400 = [148, 163, 184]; // #94A3B8
  const tealColor = [13, 148, 136]; // #0D9488
  const lightBg = [248, 250, 252]; // #F8FAFC
  const borderGrey = [226, 232, 240]; // #E2E8F0

  let currentY = margin;

  // 1. Header Banner
  doc.setFillColor(navyColor[0], navyColor[1], navyColor[2]);
  doc.rect(margin, currentY, contentWidth, 20, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('NEUROSCAN AI – BRAIN MRI ANALYSIS REPORT', margin + 6, currentY + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(204, 251, 241); // teal-100
  doc.text('COMPUTATIONAL NEUROIMAGING RESEARCH & EDUCATIONAL WORKSTATION', margin + 6, currentY + 15);

  currentY += 24;

  // 2. Scan Telemetry & Patient/User Metadata Grid
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
  doc.rect(margin, currentY, contentWidth, 22, 'FD');

  doc.setFontSize(7.5);
  doc.setTextColor(slate400[0], slate400[1], slate400[2]);
  doc.setFont('helvetica', 'bold');

  // Row 1 labels
  doc.text('ANALYSIS REF ID', margin + 4, currentY + 6);
  doc.text('ACQUISITION TIMESTAMP', margin + 48, currentY + 6);
  doc.text('SOURCE FILE', margin + 105, currentY + 6);

  // Row 1 values
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(navyColor[0], navyColor[1], navyColor[2]);
  doc.text(analysis.id, margin + 4, currentY + 11);
  doc.text(
    new Date(analysis.timestamp).toLocaleString([], {
      dateStyle: 'medium',
      timeStyle: 'short',
    }),
    margin + 48,
    currentY + 11
  );
  const truncatedFilename =
    analysis.filename.length > 28 ? analysis.filename.substring(0, 26) + '...' : analysis.filename;
  doc.text(truncatedFilename, margin + 105, currentY + 11);

  // Row 2 labels
  doc.setFontSize(7.5);
  doc.setTextColor(slate400[0], slate400[1], slate400[2]);
  doc.setFont('helvetica', 'bold');
  doc.text('EVALUATOR ACCOUNT', margin + 4, currentY + 17);
  doc.text('MODALITY / SEQUENCE', margin + 105, currentY + 17);

  // Row 2 values
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(navyColor[0], navyColor[1], navyColor[2]);
  const userLabel = userEmail || userName || 'Authenticated Researcher';
  doc.text(userLabel, margin + 4, currentY + 21);
  doc.text('Axial Brain MRI (T1W / FLAIR Contrast)', margin + 105, currentY + 21);

  currentY += 26;

  // 3. Section A: Classification Findings
  doc.setFillColor(tealColor[0], tealColor[1], tealColor[2]);
  doc.rect(margin, currentY, 3, 10, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(navyColor[0], navyColor[1], navyColor[2]);
  doc.text('A. Classification & Differential Distribution (EfficientNetB0)', margin + 6, currentY + 7);

  currentY += 13;

  // Primary Diagnosis Box
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
  doc.rect(margin, currentY, 65, 34, 'FD');

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(slate400[0], slate400[1], slate400[2]);
  doc.text('PRIMARY PREDICTED CATEGORY', margin + 4, currentY + 7);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(navyColor[0], navyColor[1], navyColor[2]);
  doc.text(String(analysis.predicted_class), margin + 4, currentY + 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(slate600[0], slate600[1], slate600[2]);
  doc.text('Calculated Confidence:', margin + 4, currentY + 23);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(tealColor[0], tealColor[1], tealColor[2]);
  doc.text(`${(analysis.confidence * 100).toFixed(1)}%`, margin + 4, currentY + 30);

  // Probability Bars Matrix
  const probX = margin + 72;
  const probWidth = contentWidth - 72;
  doc.rect(probX, currentY, probWidth, 34, 'FD');

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(slate400[0], slate400[1], slate400[2]);
  doc.text('CLASS POSTERIOR DISTRIBUTION', probX + 4, currentY + 7);

  const classes = ['Glioma', 'Meningioma', 'No Tumor', 'Pituitary'];
  let probY = currentY + 13;

  classes.forEach((cls) => {
    const rawVal = analysis.probabilities[cls] !== undefined ? analysis.probabilities[cls] : 0;
    const pct = (rawVal * 100).toFixed(2);
    const isWinner = cls.toLowerCase() === String(analysis.predicted_class).toLowerCase();

    doc.setFont('helvetica', isWinner ? 'bold' : 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(isWinner ? navyColor[0] : slate600[0], isWinner ? navyColor[1] : slate600[1], isWinner ? navyColor[2] : slate600[2]);
    doc.text(cls, probX + 4, probY);

    doc.text(`${pct}%`, probX + 38, probY);

    // Render bar
    const barX = probX + 54;
    const maxBarW = probWidth - 60;
    const barW = Math.max((Number(pct) / 100) * maxBarW, 1.5);

    doc.setFillColor(borderGrey[0], borderGrey[1], borderGrey[2]);
    doc.rect(barX, probY - 3, maxBarW, 3.5, 'F');

    doc.setFillColor(isWinner ? tealColor[0] : 148, isWinner ? tealColor[1] : 163, isWinner ? tealColor[2] : 184);
    doc.rect(barX, probY - 3, barW, 3.5, 'F');

    probY += 5.5;
  });

  currentY += 40;

  // 4. Section B & C: Multi-Modal Tri-Panel Visualizations
  doc.setFillColor(navyColor[0], navyColor[1], navyColor[2]);
  doc.rect(margin, currentY, 3, 10, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(navyColor[0], navyColor[1], navyColor[2]);
  doc.text('B & C. Neural Visualizations (Original MRI, U-Net Mask, Grad-CAM Saliency)', margin + 6, currentY + 7);

  currentY += 14;

  // Tri-panel image boxes
  const imgWidth = (contentWidth - 8) / 3;
  const imgHeight = imgWidth; // 1:1 aspect ratio

  // Helper to load image as base64/dataURL safely into jsPDF
  const drawImageSafe = async (dataUri: string, x: number, y: number, w: number, h: number) => {
    try {
      if (dataUri && (dataUri.startsWith('data:image') || dataUri.startsWith('/'))) {
        doc.addImage(dataUri, 'JPEG', x, y, w, h);
      } else {
        doc.setFillColor(0, 0, 0);
        doc.rect(x, y, w, h, 'F');
        doc.setFontSize(7);
        doc.setTextColor(255, 255, 255);
        doc.text('Image Not Available', x + 5, y + h / 2);
      }
    } catch {
      doc.setFillColor(0, 0, 0);
      doc.rect(x, y, w, h, 'F');
    }
  };

  // Image 1: Original MRI
  doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
  doc.rect(margin, currentY, imgWidth, imgHeight, 'D');
  await drawImageSafe(analysis.originalImage, margin + 0.5, currentY + 0.5, imgWidth - 1, imgHeight - 1);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(navyColor[0], navyColor[1], navyColor[2]);
  doc.text('1. ORIGINAL MRI SCAN', margin, currentY + imgHeight + 4);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(slate600[0], slate600[1], slate600[2]);
  doc.text('Raw input axial brain slice', margin, currentY + imgHeight + 8);

  // Image 2: U-Net Segmentation Mask
  const x2 = margin + imgWidth + 4;
  doc.rect(x2, currentY, imgWidth, imgHeight, 'D');
  await drawImageSafe(analysis.segmentation_mask, x2 + 0.5, currentY + 0.5, imgWidth - 1, imgHeight - 1);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(tealColor[0], tealColor[1], tealColor[2]);
  doc.text('2. U-NET SEGMENTATION MASK', x2, currentY + imgHeight + 4);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(slate600[0], slate600[1], slate600[2]);
  doc.text('Computed lesion margin boundary', x2, currentY + imgHeight + 8);

  // Image 3: Grad-CAM Heatmap
  const x3 = margin + (imgWidth + 4) * 2;
  doc.rect(x3, currentY, imgWidth, imgHeight, 'D');
  await drawImageSafe(analysis.gradcam_image, x3 + 0.5, currentY + 0.5, imgWidth - 1, imgHeight - 1);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(194, 65, 12); // amber-700
  doc.text('3. GRAD-CAM SALIENCY MAP', x3, currentY + imgHeight + 4);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(slate600[0], slate600[1], slate600[2]);
  doc.text('Attention gradient backpropagation', x3, currentY + imgHeight + 8);

  currentY += imgHeight + 14;

  // 5. Clinical & Technical Notes Box
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
  doc.rect(margin, currentY, contentWidth, 24, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(navyColor[0], navyColor[1], navyColor[2]);
  doc.text('TECHNICAL & ANATOMICAL INTERPRETATION NOTES', margin + 4, currentY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(slate600[0], slate600[1], slate600[2]);
  doc.text(
    '• EfficientNetB0 classification computed categorical posteriors using compound scaling across mobile inverted bottlenecks (MBConv).',
    margin + 4,
    currentY + 10
  );
  doc.text(
    '• U-Net segmentation utilized symmetric encoder-decoder skip connections to preserve edge resolution of identified space-occupying tissue.',
    margin + 4,
    currentY + 14
  );
  doc.text(
    '• Grad-CAM backpropagated gradients to the penultimate convolutional feature maps; warm zones (red/orange) pinpoint key decision drivers.',
    margin + 4,
    currentY + 18
  );

  currentY += 28;

  // 6. Regulatory & Prototype Disclaimer Banner
  doc.setFillColor(254, 243, 199); // amber-100
  doc.setDrawColor(251, 191, 36); // amber-400
  doc.rect(margin, currentY, contentWidth, 20, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(120, 53, 15); // amber-900
  doc.text('MANDATORY REGULATORY & RESEARCH PROTOTYPE DISCLAIMER:', margin + 4, currentY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(146, 64, 14); // amber-800
  doc.text(
    'NeuroScan AI is strictly an educational prototype designed to demonstrate deep learning neuroimaging pipelines. It is NOT a medical device,',
    margin + 4,
    currentY + 10
  );
  doc.text(
    'does not hold FDA 510(k) or CE-IVD regulatory clearance, and MUST NOT be used for direct clinical diagnosis, triage, or surgical planning.',
    margin + 4,
    currentY + 14
  );
  doc.text(
    'All diagnostic conclusions must be verified by a board-certified medical radiologist utilizing certified PACS diagnostic displays.',
    margin + 4,
    currentY + 18
  );

  // 7. Footer Page 1
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(slate400[0], slate400[1], slate400[2]);
  doc.text(
    `NeuroScan AI Platform · Document Generated ${new Date().toISOString()} · Page 1 of 2`,
    margin,
    pageHeight - 6
  );

  // ==============================================================================
  // PAGE 2: IN-DEPTH CLASS PATHOLOGY & MRI ANATOMICAL BREAKDOWN
  // ==============================================================================
  doc.addPage();
  currentY = margin;

  // Header Banner Page 2
  doc.setFillColor(navyColor[0], navyColor[1], navyColor[2]);
  doc.rect(margin, currentY, contentWidth, 16, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('IN-DEPTH PATHOLOGY & MRI ANATOMICAL ANALYSIS', margin + 6, currentY + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(204, 251, 241);
  doc.text(
    `SCAN REF: ${analysis.id} · CLASSIFIED CATEGORY: ${analysis.predicted_class.toUpperCase()}`,
    margin + 6,
    currentY + 13
  );

  currentY += 20;

  const details = getMriDetailedAnalysis(analysis);
  const p = details.pathology;

  // Section 1: Pathology Profile Box
  doc.setFillColor(tealColor[0], tealColor[1], tealColor[2]);
  doc.rect(margin, currentY, 3, 8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(navyColor[0], navyColor[1], navyColor[2]);
  doc.text('1. Classified Diagnostic Class & Biological Profile', margin + 6, currentY + 6);

  currentY += 10;

  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
  doc.rect(margin, currentY, contentWidth, 36, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(navyColor[0], navyColor[1], navyColor[2]);
  doc.text(p.title, margin + 4, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(slate600[0], slate600[1], slate600[2]);
  doc.text(`• WHO Grading Spectrum: ${p.whoGrading}`, margin + 4, currentY + 11);
  doc.text(`• Cellular Origin: ${p.originTissue}`, margin + 4, currentY + 15);

  const splitPatho = doc.splitTextToSize(`• Mechanism: ${p.pathophysiology}`, contentWidth - 8);
  doc.text(splitPatho, margin + 4, currentY + 20);

  currentY += 40;

  // Section 2: Detailed MRI Anatomical Landmarks & Tissue Breakdown
  doc.setFillColor(navyColor[0], navyColor[1], navyColor[2]);
  doc.rect(margin, currentY, 3, 8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(navyColor[0], navyColor[1], navyColor[2]);
  doc.text('2. MRI Structural Landmarks & Tissue Assessment', margin + 6, currentY + 6);

  currentY += 10;

  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.rect(margin, currentY, contentWidth, 42, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(navyColor[0], navyColor[1], navyColor[2]);
  doc.text(`ACQUISITION GEOMETRY: ${details.imageOrientation}`, margin + 4, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(slate600[0], slate600[1], slate600[2]);
  doc.text(`• Parenchyma: ${details.tissueMetrics.parenchymalIntegrity}`, margin + 4, currentY + 12);
  doc.text(`• Ventricles: ${details.tissueMetrics.ventricularSymmetry}`, margin + 4, currentY + 18);
  doc.text(`• Midline Alignment: ${details.tissueMetrics.midlineAssessment}`, margin + 4, currentY + 24);
  doc.text(`• Boundary / Edema: ${details.tissueMetrics.edemaAssessment}`, margin + 4, currentY + 30);
  doc.text(`• Decision Saliency: ${details.tissueMetrics.saliencyFocus}`, margin + 4, currentY + 36);

  currentY += 46;

  // Section 3: Multi-Sequence MRI Signal Characteristics Table
  doc.setFillColor(tealColor[0], tealColor[1], tealColor[2]);
  doc.rect(margin, currentY, 3, 8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(navyColor[0], navyColor[1], navyColor[2]);
  doc.text('3. Multi-Sequence MRI Signal Intensities', margin + 6, currentY + 6);

  currentY += 10;

  const rows = [
    ['T1-Weighted (T1W)', p.radiologicalHallmarks.t1Signal],
    ['T2 / FLAIR', p.radiologicalHallmarks.t2FlairSignal],
    ['T1 + Contrast (Gad)', p.radiologicalHallmarks.contrastEnhancement],
    ['Margin Dynamics', p.radiologicalHallmarks.margins],
    ['Mass Effect Vector', p.radiologicalHallmarks.massEffect],
  ];

  doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
  let tableY = currentY;

  rows.forEach(([seq, desc]) => {
    doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
    doc.rect(margin, tableY, 40, 7.5, 'FD');
    doc.rect(margin + 40, tableY, contentWidth - 40, 7.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(navyColor[0], navyColor[1], navyColor[2]);
    doc.text(seq, margin + 2.5, tableY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(slate600[0], slate600[1], slate600[2]);
    const splitDesc = doc.splitTextToSize(desc, contentWidth - 45);
    doc.text(splitDesc, margin + 42.5, tableY + 5);

    tableY += 7.5;
  });

  currentY = tableY + 6;

  // Section 4: Differential & Clinical Workup Recommendations
  doc.setFillColor(navyColor[0], navyColor[1], navyColor[2]);
  doc.rect(margin, currentY, 3, 8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(navyColor[0], navyColor[1], navyColor[2]);
  doc.text('4. Differential Diagnoses & Recommended Advanced Workup', margin + 6, currentY + 6);

  currentY += 10;

  const colW = (contentWidth - 4) / 2;
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.rect(margin, currentY, colW, 26, 'FD');
  doc.rect(margin + colW + 4, currentY, colW, 26, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(navyColor[0], navyColor[1], navyColor[2]);
  doc.text('RADIOLOGICAL DIFFERENTIALS:', margin + 3, currentY + 5);
  doc.text('RECOMMENDED CONFIRMATORY WORKUP:', margin + colW + 7, currentY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(slate600[0], slate600[1], slate600[2]);

  let diffY = currentY + 10;
  p.differentialDiagnosis.slice(0, 3).forEach((item) => {
    doc.text(`• ${item}`, margin + 3, diffY);
    diffY += 4.5;
  });

  let recY = currentY + 10;
  p.confirmatoryRecommendations.slice(0, 3).forEach((item) => {
    const splitRec = doc.splitTextToSize(`• ${item}`, colW - 6);
    doc.text(splitRec[0], margin + colW + 7, recY);
    recY += 4.5;
  });

  // Footer Page 2
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(slate400[0], slate400[1], slate400[2]);
  doc.text(
    `NeuroScan AI Platform · In-Depth Clinical Neuroimaging Report · Page 2 of 2`,
    margin,
    pageHeight - 6
  );

  // Save the complete 2-page PDF file
  doc.save(`NeuroScan_Report_${analysis.id}.pdf`);
}
