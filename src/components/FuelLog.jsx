import { useState, useRef, useCallback } from 'react';
import {
  Fuel, DollarSign, Gauge, Plus, X, Calendar, Download,
  Camera, Image, ScanLine, Loader2, CheckCircle2, AlertCircle,
  FileText, ChevronDown, ChevronRight, Sparkles, Store, Receipt,
} from 'lucide-react';
import { createWorker } from 'tesseract.js';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { formatDate, formatCurrency, formatNumber, generateId, getLocalDateString } from '../utils/helpers';

const OCTANE_OPTIONS = ['regular', 'mid-grade', 'premium', 'diesel', 'e85'];

/**
 * Compress a base64 image to a reasonable size before storing.
 * Resizes to max 600px on the longest side and compresses to JPEG quality 0.5.
 */
function compressImage(dataUrl, maxWidth = 600, quality = 0.5) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      if (width > maxWidth || height > maxWidth) {
        if (width > height) {
          height = Math.round((height / width) * maxWidth);
          width = maxWidth;
        } else {
          width = Math.round((width / height) * maxWidth);
          height = maxWidth;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      const compressed = canvas.toDataURL('image/jpeg', quality);
      resolve(compressed);
    };
    img.onerror = () => reject(new Error('Failed to load image for compression'));
    img.src = dataUrl;
  });
}

/**
 * Parse OCR text to extract fuel-receipt-specific fields.
 * Looks for gas station names, $/gal, gallon amounts, octane grades, total price, dates.
 */
function parseFuelReceiptText(text) {
  const result = {
    date: null,
    merchant: null,
    octane: null,
    pricePerGallon: null,
    gallons: null,
    totalCost: null,
    confidence: 0,
    matchedKeywords: [],
  };

  const fullText = text.toLowerCase();
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  // 1. Extract date
  const datePatterns = [
    /\b(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})\b/,
    /\b(\d{4})[/-](\d{1,2})[/-](\d{1,2})\b/,
  ];
  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      try {
        let month, day, year;
        if (match[1]?.length === 4) {
          year = parseInt(match[1]);
          month = parseInt(match[2]);
          day = parseInt(match[3]);
        } else {
          month = parseInt(match[1]);
          day = parseInt(match[2]);
          year = parseInt(match[3]);
          if (year < 100) year += 2000;
        }
        if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && year >= 2020 && year <= 2030) {
          result.date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          result.confidence += 20;
          break;
        }
      } catch (e) { /* skip */ }
    }
  }

  // 2. Extract merchant — look for known gas station names
  const merchantPatterns = [
    'shell', 'exxon', 'mobil', 'chevron', 'bp', 'costco', 'sams club', "sam's club",
    'speedway', 'circle k', 'wawa', 'quiktrip', 'racetrac', 'pilot', 'loves', "love's",
    'arco', 'valero', 'sunoco', 'texaco', 'phillips 66', 'conoco', 'kroger',
    'murphy', 'getgo', 'caseys', 'buc-ees', 'buc ee', 'maverik', '76', '7-eleven',
    'cenex', 'citgo', 'marathon', 'hess', 'meijer', 'safeway', 'fred meyer',
  ];
  for (const m of merchantPatterns) {
    if (fullText.includes(m)) {
      result.merchant = m.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      result.confidence += 20;
      result.matchedKeywords.push(m);
      break;
    }
  }

  // If no known merchant, try first substantive line
  if (!result.merchant) {
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.length > 3 && trimmed.length < 50 &&
          !/^\d/.test(trimmed) &&
          !trimmed.includes('$') &&
          !/total|tax|subtotal|amount|change|balance|phone|address|thank|receipt|invoice|date|station|fuel|gas/i.test(trimmed) &&
          trimmed !== trimmed.toUpperCase()) {
        result.merchant = trimmed.replace(/[#*]/g, '').trim();
        result.confidence += 10;
        break;
      }
    }
  }

  // 3. Extract octane grade
  const octanePatterns = [
    /\b(87|89|91|92|93|94|e85|e15|e10)\b/i,
    /regular|mid.?grade|premium|super|unleaded|diesel/i,
  ];
  for (const pattern of octanePatterns) {
    const match = text.match(pattern);
    if (match) {
      const val = match[0].toLowerCase();
      if (val === '87') result.octane = 'regular';
      else if (val === '89') result.octane = 'mid-grade';
      else if (val === '91' || val === '92' || val === '93' || val === '94') result.octane = 'premium';
      else if (val === 'diesel') result.octane = 'diesel';
      else if (val === 'e85' || val === 'e15' || val === 'e10') result.octane = 'e85';
      else if (val === 'regular' || val === 'unleaded') result.octane = 'regular';
      else if (val === 'mid-grade' || val === 'mid grade') result.octane = 'mid-grade';
      else if (val === 'premium' || val === 'super') result.octane = 'premium';
      if (result.octane) {
        result.confidence += 15;
        break;
      }
    }
  }

  // 4. Extract price per gallon — look for "$X.XX/gal" or "$X.XX per gallon" patterns
  const ppgPatterns = [
    /\$?([0-9]+\.[0-9]{2,3})\s*(?:\/|per)\s*gal/i,
    /price\s*(?:\/|per)\s*gal[:\s]*\$?([0-9]+\.[0-9]{2,3})/i,
    /gal[:\s]*\$?([0-9]+\.[0-9]{2,3})/i,
    /\$([0-9]+\.[0-9]{2,3})\s*\/?\s*g/i,
  ];
  for (const pattern of ppgPatterns) {
    const match = text.match(pattern);
    if (match) {
      const val = parseFloat(match[1]);
      if (val > 0.5 && val < 20) {
        result.pricePerGallon = val;
        result.confidence += 20;
        break;
      }
    }
  }

  // 5. Extract gallons
  const gallonPatterns = [
    /([0-9]+\.[0-9]{1,3})\s*gal/i,
    /gal[:\s]*([0-9]+\.[0-9]{1,3})/i,
    /gallons[:\s]*([0-9]+\.[0-9]{1,3})/i,
    /\b([0-9]{1,3}\.[0-9]{1,3})\s*$/m,
  ];
  for (const pattern of gallonPatterns) {
    const match = text.match(pattern);
    if (match) {
      const val = parseFloat(match[1]);
      if (val > 0.1 && val < 200) {
        result.gallons = val;
        result.confidence += 15;
        break;
      }
    }
  }

  // 6. Extract total cost
  const costPatterns = [
    /total[:\s]*\$?([0-9,]+\.?\d{0,2})/i,
    /amount[:\s]*\$?([0-9,]+\.?\d{0,2})/i,
    /balance[:\s]*\$?([0-9,]+\.?\d{0,2})/i,
    /\$([0-9,]+\.\d{2})\s*$/m,
    /TOTAL[^$]*\$?([0-9,]+\.\d{2})/,
    /\$(\d+\.\d{2})/,
  ];
  for (const pattern of costPatterns) {
    const match = text.match(pattern);
    if (match) {
      const value = parseFloat(match[1].replace(/,/g, ''));
      if (value > 0 && value < 10000) {
        result.totalCost = value;
        result.confidence += 10;
        break;
      }
    }
  }

  result.confidence = Math.min(100, result.confidence);
  return result;
}

export default function FuelLog({ logs, vehicles, onAdd, onUpdate, onDelete, selectedVehicleId }) {
  const [showForm, setShowForm] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [expandedImage, setExpandedImage] = useState(null);

  // PDF report state
  const [fromDate, setFromDate] = useState(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 1);
    return getLocalDateString(d);
  });
  const [toDate, setToDate] = useState(() => getLocalDateString());

  const filteredLogs = selectedVehicleId ? logs.filter(l => l.vehicleId === selectedVehicleId) : logs;
  const getVehicleName = (id) => vehicles.find(v => v.id === id)?.name || 'Unknown';

  const totalSpent = filteredLogs.reduce((s, l) => s + (l.cost || 0), 0);
  const totalGallons = filteredLogs.reduce((s, l) => s + (parseFloat(l.gallons) || 0), 0);

  const generateReport = () => {
    const reportLogs = filteredLogs.filter(l => l.date >= fromDate && l.date <= toDate);
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor('#0f172a');
    doc.rect(0, 0, pageWidth, 35, 'F');
    doc.setTextColor('#ffffff');
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Fuel Usage Report', pageWidth / 2, 18, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor('#94a3b8');
    doc.text(`Generated ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`, pageWidth / 2, 28, { align: 'center' });

    // Vehicle info
    let yPos = 45;
    if (selectedVehicleId) {
      const v = vehicles.find(v => v.id === selectedVehicleId);
      if (v) {
        doc.setFontSize(12);
        doc.setTextColor('#0f172a');
        doc.text(`Vehicle: ${v.name || `${v.year} ${v.make} ${v.model}`}`, 14, yPos);
        yPos += 12;
      }
    }

    // Date range
    doc.setFontSize(10);
    doc.setTextColor('#64748b');
    doc.text(`Period: ${formatDate(fromDate)} — ${formatDate(toDate)}`, 14, yPos);
    yPos += 8;

    if (reportLogs.length === 0) {
      doc.setFontSize(11);
      doc.setTextColor('#64748b');
      doc.text('No fuel receipts logged in this date range.', 14, yPos);
    } else {
      const tableData = reportLogs
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map(l => [
          formatDate(l.date),
          l.merchant || '—',
          l.octane || '—',
          (parseFloat(l.gallons) || 0).toFixed(2),
          l.price_per_gallon ? `$${parseFloat(l.price_per_gallon).toFixed(2)}` : '—',
          l.cost ? formatCurrency(l.cost) : '—',
        ]);

      doc.autoTable({
        startY: yPos,
        head: [['Date', 'Merchant', 'Octane', 'Gallons', 'Price/Gal', 'Total']],
        body: tableData,
        headStyles: {
          fillColor: [30, 64, 175],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 9,
        },
        bodyStyles: { fontSize: 8, textColor: [51, 65, 85] },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        styles: { cellPadding: 3 },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 35 },
          2: { cellWidth: 22 },
          3: { cellWidth: 22, halign: 'right' },
          4: { cellWidth: 24, halign: 'right' },
          5: { cellWidth: 22, halign: 'right' },
        },
      });
      yPos = doc.lastAutoTable.finalY + 10;

      // Summary
      const rptGallons = reportLogs.reduce((s, l) => s + (parseFloat(l.gallons) || 0), 0);
      const rptCost = reportLogs.reduce((s, l) => s + (l.cost || 0), 0);
      const avgPpg = rptGallons > 0 ? rptCost / rptGallons : 0;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor('#0f172a');
      doc.text('Summary', 14, yPos);
      yPos += 6;

      const summaryData = [
        ['Total Gallons', rptGallons.toFixed(2)],
        ['Total Spent', formatCurrency(rptCost)],
        ['Average Price/Gallon', `$${avgPpg.toFixed(2)}`],
      ];
      doc.autoTable({
        startY: yPos,
        head: [['Metric', 'Value']],
        body: summaryData,
        headStyles: {
          fillColor: [100, 116, 139],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 9,
        },
        bodyStyles: { fontSize: 9, textColor: [51, 65, 85] },
        styles: { cellPadding: 2 },
        columnStyles: {
          0: { cellWidth: 55 },
          1: { cellWidth: 55, halign: 'right' },
        },
        theme: 'grid',
      });
    }

    // Footer
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setDrawColor('#e2e8f0');
    doc.line(14, pageHeight - 18, pageWidth - 14, pageHeight - 18);
    doc.setFontSize(7);
    doc.setTextColor('#64748b');
    doc.text('Generated by MTXtrkr — Smart Vehicle Maintenance Tracker', pageWidth / 2, pageHeight - 8, { align: 'center' });

    doc.save(`fuel-report-${fromDate}-to-${toDate}.pdf`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Fuel Logs</h2>
          <p className="text-sm text-slate-400 mt-0.5">{filteredLogs.length} receipts logged</p>
        </div>
        <button
          onClick={() => { if (vehicles.length === 0) return; setShowForm(true); }}
          disabled={vehicles.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white text-sm font-medium transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Receipt
        </button>
      </div>

      {vehicles.length === 0 && (
        <div className="text-center py-12 bg-slate-900/30 rounded-2xl border border-slate-800">
          <Receipt className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-400 mb-1">Add a vehicle first</p>
        </div>
      )}

      {vehicles.length > 0 && (
        <>
          {/* Stats summary */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span><span className="text-emerald-400 font-medium">{formatCurrency(totalSpent)}</span> total</span>
              <span><span className="text-cyan-400 font-medium">{formatNumber(totalGallons)}</span> gal</span>
            </div>
          </div>

          {/* Receipt List */}
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12 bg-slate-900/30 rounded-2xl border border-slate-800">
              <Receipt className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-sm text-slate-400 mb-1">No receipts logged yet</p>
              <button onClick={() => setShowForm(true)}
                className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium">
                <Plus className="w-3.5 h-3.5" /> Log your first receipt
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredLogs.sort((a, b) => new Date(b.date) - new Date(a.date)).map(log => (
                <div key={log.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {log.receiptImage && (
                          <img
                            src={log.receiptImage}
                            alt="Receipt thumbnail"
                            className="w-12 h-12 rounded-lg object-cover border border-slate-700 cursor-pointer hover:border-blue-500/50 transition-all shrink-0"
                            onClick={() => setExpandedImage(log.receiptImage)}
                          />
                        )}
                        <div className="min-w-0">
                          {log.merchant && (
                            <span className="text-sm font-bold text-white block truncate">{log.merchant}</span>
                          )}
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-white">{getVehicleName(log.vehicleId)}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">{log.octane}</span>
                            {!log.is_full_tank && <span className="text-[10px] text-amber-400">Partial</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(log.date)}</span>
                        <span className="flex items-center gap-1"><Gauge className="w-3 h-3" />{formatNumber(log.mileage)} mi</span>
                        <span className="flex items-center gap-1 text-cyan-400"><Fuel className="w-3 h-3" />{parseFloat(log.gallons).toFixed(2)} gal</span>
                        {log.price_per_gallon > 0 && (
                          <span className="flex items-center gap-1 text-amber-400">${parseFloat(log.price_per_gallon).toFixed(2)}/gal</span>
                        )}
                        <span className="flex items-center gap-1 text-emerald-400"><DollarSign className="w-3 h-3" />{formatCurrency(log.cost)}</span>
                      </div>
                      {log.notes && <p className="text-[10px] text-slate-600 mt-1">{log.notes}</p>}
                    </div>
                    <button onClick={() => { if (window.confirm('Delete this fuel receipt? This cannot be undone.')) onDelete(log.id); }}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-600 hover:text-red-400 transition-all shrink-0">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Print Fuel Usage Report */}
          <div className="mt-8 p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Download className="w-4 h-4 text-blue-400" />
              Print Fuel Usage Report
            </h3>
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">From</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={e => setFromDate(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">To</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={e => setToDate(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm"
                />
              </div>
              <button
                onClick={generateReport}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-all"
              >
                <Download className="w-4 h-4" />
                Generate Report
              </button>
            </div>
          </div>
        </>
      )}

      {showForm && (
        <FuelFormModal
          vehicles={vehicles}
          selectedVehicleId={selectedVehicleId}
          onSave={(data) => { onAdd(data); setShowForm(false); }}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* Expanded receipt image modal */}
      {expandedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setExpandedImage(null)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative max-w-lg w-full max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setExpandedImage(null)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={expandedImage} alt="Receipt" className="w-full h-auto object-contain bg-slate-950" />
          </div>
        </div>
      )}
    </div>
  );
}

function FuelFormModal({ vehicles, selectedVehicleId, onSave, onClose }) {
  const [form, setForm] = useState({
    vehicleId: selectedVehicleId || vehicles[0]?.id || '',
    date: getLocalDateString(),
    mileage: '',
    gallons: '',
    cost: '',
    is_full_tank: true,
    octane: 'regular',
    notes: '',
    merchant: '',
    price_per_gallon: '',
    receiptImage: null,
  });

  // OCR state
  const [ocrStep, setOcrStep] = useState(null); // null | 'capture' | 'processing' | 'review'
  const [ocrImage, setOcrImage] = useState(null);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrStatus, setOcrStatus] = useState('idle');
  const [ocrStatusMessage, setOcrStatusMessage] = useState('');
  const [ocrParsed, setOcrParsed] = useState(null);
  const [ocrRawText, setOcrRawText] = useState('');
  const [showRawText, setShowRawText] = useState(false);
  const fileInputRef = useRef(null);

  // Auto-calculate price_per_gallon from cost / gallons
  const updateForm = (updates) => {
    setForm(f => {
      const next = { ...f, ...updates };
      // Auto-calc price per gallon if both cost and gallons exist and user hasn't manually set ppg
      if (next.cost && next.gallons && parseFloat(next.gallons) > 0) {
        const calcPpg = (parseFloat(next.cost) / parseFloat(next.gallons)).toFixed(2);
        if (!f.price_per_gallon || f.price_per_gallon === '' || f.price_per_gallon === calcPpg) {
          next.price_per_gallon = calcPpg;
        }
      }
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.vehicleId || !form.mileage || !form.gallons) return;
    onSave({
      ...form,
      mileage: parseInt(form.mileage) || 0,
      gallons: parseFloat(form.gallons) || 0,
      cost: parseFloat(form.cost) || 0,
      price_per_gallon: form.price_per_gallon ? parseFloat(form.price_per_gallon) : 0,
    });
  };

  // OCR handlers
  const handleImageSelect = useCallback(async (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const imgData = ev.target.result;
      setOcrImage(imgData);
      setOcrStep('processing');
      setOcrStatus('loading');
      setOcrStatusMessage('Compressing image...');
      setOcrProgress(10);

      try {
        const compressedImage = await compressImage(imgData, 600, 0.5);
        setOcrImage(compressedImage);
        setOcrProgress(30);

        setOcrStatusMessage('Running OCR on receipt...');
        const worker = await createWorker('eng', 1, {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              setOcrProgress(Math.round(m.progress * 100));
            }
          },
        });

        setOcrStatusMessage('Reading text from receipt...');
        const { data } = await worker.recognize(compressedImage);
        const text = data.text;
        setOcrRawText(text);
        await worker.terminate();

        setOcrStatusMessage('Analyzing receipt data...');
        const parsedData = parseFuelReceiptText(text);

        // Auto-fill form with OCR extracted data
        updateForm({
          date: parsedData.date || form.date,
          merchant: parsedData.merchant || '',
          octane: parsedData.octane || form.octane,
          price_per_gallon: parsedData.pricePerGallon ? parsedData.pricePerGallon.toString() : '',
          gallons: parsedData.gallons ? parsedData.gallons.toString() : '',
          cost: parsedData.totalCost ? parsedData.totalCost.toString() : '',
          receiptImage: compressedImage,
        });
        setOcrParsed(parsedData);
        setOcrStep('review');
        setOcrStatus('success');
        setOcrStatusMessage('Receipt scanned successfully!');
        setOcrProgress(100);
      } catch (err) {
        console.error('OCR Error:', err);
        setOcrStatus('error');
        setOcrStatusMessage(`OCR failed: ${err.message || 'Unknown error'}`);
      }
    };
    reader.readAsDataURL(file);
  }, [form.date, form.octane]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleImageSelect(file);
  };

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('capture', 'environment');
      fileInputRef.current.click();
    }
  };

  const handleGalleryUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.removeAttribute('capture');
      fileInputRef.current.click();
    }
  };

  const handleOcrClose = () => {
    setOcrStep(null);
    setOcrImage(null);
    setOcrParsed(null);
    setOcrRawText('');
    setOcrProgress(0);
    setOcrStatus('idle');
    setOcrStatusMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-slate-900 border border-slate-800 rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Add Receipt</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400"><X className="w-5 h-5" /></button>
        </div>

        {/* OCR Capture / Processing */}
        {ocrStep && (
          <div className="mb-4">
            {ocrStep === 'capture' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-400">Take a photo of your fuel receipt or upload one from your gallery.</p>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={handleCameraCapture}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-b from-blue-600/10 to-cyan-600/5 border border-blue-500/20 hover:border-blue-500/50 transition-all">
                    <Camera className="w-6 h-6 text-blue-400" />
                    <span className="text-xs font-medium text-white">Take Photo</span>
                  </button>
                  <button onClick={handleGalleryUpload}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-800/60 border border-slate-700 hover:border-blue-500/30 transition-all">
                    <Image className="w-6 h-6 text-slate-300" />
                    <span className="text-xs font-medium text-white">Upload</span>
                  </button>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                <button onClick={handleOcrClose}
                  className="w-full py-2 text-xs text-slate-500 hover:text-slate-300 transition-all">
                  Skip — enter manually
                </button>
              </div>
            )}

            {ocrStep === 'processing' && (
              <div className="text-center py-4 space-y-3">
                {ocrImage && (
                  <div className="relative mx-auto w-36 h-36 rounded-xl overflow-hidden border border-slate-700">
                    <img src={ocrImage} alt="Receipt" className="w-full h-full object-contain bg-slate-950" />
                  </div>
                )}
                <div className="flex items-center justify-center gap-2 text-sm text-blue-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {ocrStatusMessage}
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300"
                    style={{ width: `${ocrProgress}%` }} />
                </div>
                <p className="text-[10px] text-slate-600">{ocrProgress}%</p>
              </div>
            )}

            {ocrStep === 'review' && (
              <div className="space-y-3">
                {ocrImage && (
                  <div className="relative rounded-xl overflow-hidden border border-slate-700">
                    <img src={ocrImage} alt="Receipt" className="w-full max-h-36 object-contain bg-slate-950" />
                  </div>
                )}
                {ocrParsed && (
                  <div className={`flex items-center gap-2 p-2 rounded-xl border text-xs ${
                    ocrParsed.confidence >= 50
                      ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
                      : 'bg-amber-500/5 border-amber-500/20 text-amber-400'
                  }`}>
                    {ocrParsed.confidence >= 50 ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                    {ocrParsed.confidence >= 50
                      ? 'Data extracted — please review below!'
                      : 'Low confidence — please check carefully.'}
                  </div>
                )}
                {/* OCR analysis quick reference */}
                {ocrParsed && (
                  <div className="p-2 rounded-xl bg-slate-950/40 border border-slate-800">
                    <p className="text-[10px] text-slate-500 font-medium mb-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-blue-400" />
                      OCR Analysis ({ocrParsed.confidence}% confidence)
                    </p>
                    <div className="grid grid-cols-2 gap-1 text-[10px]">
                      {ocrParsed.merchant && <><span className="text-slate-500">Merchant:</span><span className="text-white truncate">{ocrParsed.merchant}</span></>}
                      {ocrParsed.octane && <><span className="text-slate-500">Octane:</span><span className="text-white">{ocrParsed.octane}</span></>}
                      {ocrParsed.pricePerGallon && <><span className="text-slate-500">Price/Gal:</span><span className="text-white">${ocrParsed.pricePerGallon.toFixed(2)}</span></>}
                      {ocrParsed.gallons && <><span className="text-slate-500">Gallons:</span><span className="text-white">{ocrParsed.gallons.toFixed(2)}</span></>}
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  <button onClick={handleOcrClose}
                    className="flex-1 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-400 hover:bg-slate-800">Close</button>
                  <button onClick={() => setOcrStep('capture')}
                    className="flex-1 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:bg-slate-700">
                    <ScanLine className="w-3 h-3 inline mr-1" /> Re-scan
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Start OCR scan button — only show when not already scanning */}
          {!ocrStep && (
            <button type="button" onClick={() => setOcrStep('capture')}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-600/10 to-cyan-600/5 border border-blue-500/20 hover:border-blue-500/40 text-blue-400 text-sm font-medium transition-all">
              <ScanLine className="w-4 h-4" /> Scan Receipt with OCR
            </button>
          )}

          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Vehicle *</label>
            <select value={form.vehicleId} onChange={e => updateForm({ vehicleId: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm" required>
              <option value="">Select vehicle</option>
              {vehicles.map(v => (<option key={v.id} value={v.id}>{v.name} — {v.make} {v.model}</option>))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Date</label>
              <input type="date" value={form.date} onChange={e => updateForm({ date: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium flex items-center gap-1">
                <Store className="w-3 h-3 text-slate-500" /> Merchant
              </label>
              <input type="text" value={form.merchant} onChange={e => updateForm({ merchant: e.target.value })}
                placeholder="e.g. Shell, Costco"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Mileage *</label>
              <input type="number" value={form.mileage} onChange={e => updateForm({ mileage: e.target.value })}
                placeholder="e.g. 45200"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm" required />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Gallons *</label>
              <input type="number" step="0.01" value={form.gallons} onChange={e => updateForm({ gallons: e.target.value })}
                placeholder="e.g. 12.5"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Cost ($)</label>
              <input type="number" step="0.01" value={form.cost} onChange={e => updateForm({ cost: e.target.value })}
                placeholder="0.00"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Price/Gallon ($)</label>
              <input type="number" step="0.001" value={form.price_per_gallon} onChange={e => updateForm({ price_per_gallon: e.target.value })}
                placeholder="Auto-calculated"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Fuel Type</label>
              <select value={form.octane} onChange={e => updateForm({ octane: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm">
                {OCTANE_OPTIONS.map(o => (<option key={o} value={o}>{o}</option>))}
              </select>
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_full_tank} onChange={e => updateForm({ is_full_tank: e.target.checked })}
                  className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-blue-600" />
                <span className="text-xs text-slate-400">Full tank</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Notes</label>
            <input type="text" value={form.notes} onChange={e => updateForm({ notes: e.target.value })}
              placeholder="Any notes about this fill-up..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-700 text-sm font-medium text-slate-300 hover:bg-slate-800">Cancel</button>
            <button type="submit"
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium">Save Receipt</button>
          </div>
        </form>
      </div>
    </div>
  );
}
