import jsPDF from 'jspdf';

export const generatePDFReport = (result) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header Banner
  doc.setFillColor(15, 23, 42); // Dark Navy #0f172a
  doc.rect(0, 0, pageWidth, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('TruthLens AI Analysis Report', 14, 22);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleString()} | ID: #${result.id || 'DEMO-882'}`, 14, 32);

  // Status Badge
  const isFake = result.prediction === 'Fake';
  if (isFake) {
    doc.setFillColor(220, 38, 38); // Red
  } else {
    doc.setFillColor(22, 163, 74); // Green
  }
  doc.rect(14, 48, pageWidth - 28, 26, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(`Classification: ${result.prediction.toUpperCase()} NEWS`, 20, 62);
  doc.setFontSize(12);
  doc.text(`Confidence: ${result.confidence}% | Risk Level: ${result.risk_level}`, 20, 70);

  // Key Metadata Table
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Analysis Summary', 14, 86);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Category: ${result.category || 'General'}`, 14, 94);
  doc.text(`Processing Time: ${result.processing_time_ms || 110} ms`, 14, 100);
  doc.text(`AI Model: TF-IDF Vectorizer + Logistic Regression Classifier`, 14, 106);

  // Headline & Article Text
  doc.setFont('helvetica', 'bold');
  doc.text('Analyzed Headline / Text:', 14, 118);
  doc.setFont('helvetica', 'normal');
  const headlineText = result.headline || (result.article ? result.article.substring(0, 150) : 'N/A');
  const splitHeadline = doc.splitTextToSize(headlineText, pageWidth - 28);
  doc.text(splitHeadline, 14, 126);

  let currentY = 126 + (splitHeadline.length * 6) + 8;

  // AI Explanation
  doc.setFont('helvetica', 'bold');
  doc.text('AI Explanation & Reasoning:', 14, currentY);
  currentY += 8;

  doc.setFont('helvetica', 'normal');
  const expText = result.explanation || 'Detailed semantic analysis performed.';
  const splitExp = doc.splitTextToSize(expText, pageWidth - 28);
  doc.text(splitExp, 14, currentY);
  currentY += (splitExp.length * 6) + 12;

  // Key Influential Words
  if (result.keywords && result.keywords.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.text('Top Influential Word Indicators:', 14, currentY);
    currentY += 8;

    doc.setFont('helvetica', 'normal');
    const kwText = result.keywords.map(k => `${k.word} (${k.type})`).join(', ');
    const splitKw = doc.splitTextToSize(kwText, pageWidth - 28);
    doc.text(splitKw, 14, currentY);
    currentY += (splitKw.length * 6) + 14;
  }

  // Footer Disclaimer
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('TruthLens AI is an analytical verification tool. Always cross-check headlines with official news sources.', 14, 285);

  // Save File
  doc.save(`TruthLens_Report_${result.prediction}_${Date.now()}.pdf`);
};
