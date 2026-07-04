import { useState, useRef, useCallback } from 'react';
import {
  Camera, Upload, ScanLine, Loader2, CheckCircle2, AlertCircle, X,
  CameraOff, Image, DollarSign, Calendar, Wrench, Building2, FileText,
  ChevronDown, ChevronRight, Sparkles
} from 'lucide-react';
import { createWorker } from 'tesseract.js';
import { SERVICE_TYPES } from '../utils/constants';
import { getLocalDateString } from '../utils/helpers';

/**
 * Parse OCR text to extract maintenance-relevant fields.
 * Uses pattern matching (dates, costs, service keywords, shop names).
 */
function parseReceiptText(text, vehicleMileage) {
  const result = {
    date: null,
    cost: null,
    serviceType: null,
    shopName: null,
    confidence: 0,
    matchedKeywords: [],
  };

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const fullText = text.toLowerCase();

  // 1. Extract date — look for common date patterns
  const datePatterns = [
    /\b(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})\b/,       // MM/DD/YYYY or MM-DD-YYYY
    /\b(\d{4})[/-](\d{1,2})[/-](\d{1,2})\b/,           // YYYY-MM-DD
    /(\d{1,2})\/(\d{1,2})\/(\d{2,4})/,                  // Loose MM/DD/YYYY
  ];

  for (const pattern of datePatterns) {
    const match = fullText.match(pattern);
    if (match) {
      try {
        let month, day, year;
        if (match[0].includes('-') && match[1]?.length === 4) {
          // YYYY-MM-DD
          year = parseInt(match[1]);
          month = parseInt(match[2]);
          day = parseInt(match[3]);
        } else {
          // MM/DD/YYYY or DD/MM/YYYY — assume MM/DD/YYYY for US receipts
          month = parseInt(match[1]);
          day = parseInt(match[2]);
          year = parseInt(match[3]);
          if (year < 100) year += 2000;
        }
        if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && year >= 2020 && year <= 2030) {
          result.date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          result.confidence += 25;
          break;
        }
      } catch (e) { /* skip invalid dates */ }
    }
  }

  // 2. Extract cost — look for dollar amounts
  const costPatterns = [
    /total[:\s]*\$?([0-9,]+\.?\d{0,2})/i,
    /amount[:\s]*\$?([0-9,]+\.?\d{0,2})/i,
    /balance[:\s]*\$?([0-9,]+\.?\d{0,2})/i,
    /\$([0-9,]+\.\d{2})\s*$/m,
    /TOTAL[^$]*\$?([0-9,]+\.\d{2})/,
    /\$(\d+\.\d{2})/,
  ];

  for (const pattern of costPatterns) {
    const match = fullText.match(pattern);
    if (match) {
      const value = parseFloat(match[1].replace(/,/g, ''));
      if (value > 0 && value < 100000) {
        result.cost = value;
        result.confidence += 25;
        break;
      }
    }
  }

  // 3. Extract service type — match against known service types
  const serviceKeywords = {
    'Oil & Filter Change': ['oil change', 'oil & filter', 'oil and filter', 'lube', 'synthetic oil', 'oil filter', '5w-30', '5w30', '0w-20', '0w20', '10w-30'],
    'Tire Rotation': ['tire rotation', 'rotate tires', 'tyre rotation', 'tire rotate'],
    'New Tires': ['new tire', 'new tyre', 'tire replacement', 'tire purchase', 'set of tires', 'tires mounted', 'p185', 'p205', 'p215', '225/', '235/', '245/'],
    'Brake Service': ['brake', 'brake pad', 'brake rotor', 'brake job', 'brake fluid', 'brake service', 'rotor resurface', 'caliper'],
    'Engine Service': ['engine', 'tune up', 'tune-up', 'spark plug', 'timing belt', 'serpentine', 'valve adjustment'],
    'Transmission Service': ['transmission', 'trans fluid', 'trans flush', 'transmission filter', 'transmission service', 'atf'],
    'Battery Replacement': ['battery', 'new battery', 'battery replacement', 'battery test', '12v battery'],
    'Filter Replacement': ['air filter', 'engine filter', 'fuel filter', 'oil filter', 'filter replacement'],
    'Cabin Air Filter': ['cabin air filter', 'cabin filter', 'ac filter', 'a/c filter', 'pollution filter'],
    'Wiper Blades': ['wiper', 'windscreen wiper', 'windshield wiper', 'wiper blade', 'wiper insert'],
    'Fluid Check/Top-Up': ['fluid', 'coolant', 'antifreeze', 'washer fluid', 'power steering', 'brake fluid flush', 'differential fluid', 'transfer case'],
    'Inspection': ['inspection', 'safety check', 'multi-point', 'diagnostic', 'check engine', 'scan', 'state inspection', 'emission'],
    'Repair': ['repair', 'replacement', 'fix', 'labor', 'diagnostic fee', 'service charge', 'shop fee'],
  };

  let bestMatch = null;
  let bestScore = 0;

  for (const [serviceType, keywords] of Object.entries(serviceKeywords)) {
    let score = 0;
    const matched = [];
    for (const kw of keywords) {
      if (fullText.includes(kw)) {
        const bonus = kw.length > 8 ? 3 : kw.length > 4 ? 2 : 1;
        score += bonus;
        matched.push(kw);
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = serviceType;
      result.matchedKeywords = matched;
    }
  }

  if (bestMatch && bestScore >= 2) {
    result.serviceType = bestMatch;
    result.confidence += 25;
  }

  // 4. Extract shop name — first substantive line that isn't a date/price
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length > 3 && trimmed.length < 60 &&
        !/^\d/.test(trimmed) &&
        !trimmed.includes('$') &&
        !/total|tax|subtotal|amount|change|balance|phone|address|thank|receipt|invoice|date|shop|service/i.test(trimmed) &&
        trimmed !== trimmed.toUpperCase() &&
        trimmed !== trimmed.toLowerCase()) {
      result.shopName = trimmed.replace(/[#*]/g, '').trim();
      result.confidence += 25;
      break;
    }
  }

  result.confidence = Math.min(100, result.confidence);
  return result;
}

export default function ReceiptScanner({ vehicles, onSave, onClose, isPremium }) {
  const [step, setStep] = useState('capture'); // capture | processing | review
  const [image, setImage] = useState(null);
  const [rawText, setRawText] = useState('');
  const [showRawText, setShowRawText] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [statusMessage, setStatusMessage] = useState('');
  const [parsed, setParsed] = useState(null);
  const fileInputRef = useRef(null);

  // Editable form fields after OCR
  const [form, setForm] = useState({
    vehicleId: vehicles[0]?.id || '',
    date: getLocalDateString(),
    mileage: '',
    serviceType: '',
    description: '',
    cost: '',
  });

  const handleImageSelect = useCallback(async (file) => {
    if (!file) return;

    // Read as base64
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const imgData = ev.target.result;
      setImage(imgData);
      setStep('processing');
      setStatus('loading');
      setStatusMessage('Running OCR on receipt...');
      setProgress(0);

      try {
        // Initialize Tesseract worker
        const worker = await createWorker('eng', 1, {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              setProgress(Math.round(m.progress * 100));
            }
          },
        });

        setStatusMessage('Reading text from receipt...');
        const { data } = await worker.recognize(imgData);
        const text = data.text;
        setRawText(text);
        await worker.terminate();

        // Parse the OCR text
        setStatusMessage('Analyzing receipt data...');
        const parsedData = parseReceiptText(text);

        // Auto-fill form
        const activeVehicle = vehicles.find(v => v.id === form.vehicleId) || vehicles[0];
        setForm(f => ({
          ...f,
          date: parsedData.date || f.date,
          cost: parsedData.cost ? parsedData.cost.toString() : f.cost,
          serviceType: parsedData.serviceType || f.serviceType,
          description: parsedData.shopName
            ? `Service at ${parsedData.shopName}${parsedData.matchedKeywords.length > 0 ? ` (${parsedData.matchedKeywords.slice(0, 3).join(', ')})` : ''}`
            : parsedData.matchedKeywords.length > 0
              ? parsedData.matchedKeywords.slice(0, 3).join(', ')
              : '',
          mileage: activeVehicle?.mileage?.toString() || f.mileage,
          vehicleId: activeVehicle?.id || f.vehicleId,
        }));
        setParsed(parsedData);
        setStep('review');
        setStatus('success');
        setStatusMessage('Receipt scanned successfully!');
        setProgress(100);
      } catch (err) {
        console.error('OCR Error:', err);
        setStatus('error');
        setStatusMessage(`OCR failed: ${err.message || 'Unknown error'}`);
      }
    };
    reader.readAsDataURL(file);
  }, [vehicles, form.vehicleId]);

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

  const handleSave = () => {
    if (!form.vehicleId) return;
    const selectedVehicle = vehicles.find(v => v.id === form.vehicleId);
    onSave({
      vehicleId: form.vehicleId,
      date: form.date,
      mileage: parseInt(form.mileage) || 0,
      serviceType: form.serviceType || 'Other',
      serviceTypes: form.serviceType ? [form.serviceType] : ['Other'],
      cost: parseFloat(form.cost) || 0,
      description: form.description || `Receipt scan${parsed?.shopName ? ` from ${parsed.shopName}` : ''}`,
      source: 'receipt-scan',
      documents: image ? [{
        id: crypto.randomUUID(),
        name: `receipt-${form.date}.jpg`,
        type: 'image/jpeg',
        size: image.length,
        dataUrl: image,
      }] : [],
      rawOcrText: rawText,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg bg-slate-900 border border-slate-800 rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
              <ScanLine className="w-4 h-4 text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Scan Receipt</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Capture / Upload */}
        {step === 'capture' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-400 leading-relaxed">
              Take a photo of your maintenance receipt or upload one from your gallery. MTXtrkr will read the text and auto-fill a service log entry.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleCameraCapture}
                className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-gradient-to-b from-blue-600/10 to-cyan-600/5 border border-blue-500/20 hover:border-blue-500/50 transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Camera className="w-7 h-7 text-blue-400" />
                </div>
                <span className="text-sm font-medium text-white">Take Photo</span>
                <span className="text-[10px] text-slate-500 text-center">Snap a picture of the receipt</span>
              </button>
              <button
                onClick={handleGalleryUpload}
                className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-slate-800/60 border border-slate-700 hover:border-blue-500/30 transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-slate-700/50 flex items-center justify-center">
                  <Image className="w-7 h-7 text-slate-300" />
                </div>
                <span className="text-sm font-medium text-white">Upload</span>
                <span className="text-[10px] text-slate-500 text-center">Choose from gallery</span>
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        )}

        {/* Step 2: Processing */}
        {step === 'processing' && (
          <div className="text-center py-8 space-y-4">
            {image && (
              <div className="relative mx-auto w-48 h-48 rounded-xl overflow-hidden border border-slate-700">
                <img src={image} alt="Receipt" className="w-full h-full object-contain bg-slate-950" />
              </div>
            )}
            <div className="flex items-center justify-center gap-2 text-sm text-blue-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              {statusMessage}
            </div>
            <div className="w-full max-w-xs mx-auto h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-600">{progress}% — text recognition in progress</p>
          </div>
        )}

        {/* Step 3: Review & Edit */}
        {step === 'review' && (
          <div className="space-y-4">
            {/* Image preview */}
            {image && (
              <div className="relative rounded-xl overflow-hidden border border-slate-700 mb-4">
                <img src={image} alt="Receipt" className="w-full max-h-48 object-contain bg-slate-950" />
              </div>
            )}

            {/* Parsing confidence */}
            {parsed && (
              <div className={`flex items-center gap-2 p-3 rounded-xl border text-xs ${
                parsed.confidence >= 60
                  ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
                  : 'bg-amber-500/5 border-amber-500/20 text-amber-400'
              }`}>
                {parsed.confidence >= 60 ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                {parsed.confidence >= 60
                  ? 'High confidence — data looks good! Please review before saving.'
                  : 'Low confidence — please check the extracted data carefully.'}
              </div>
            )}

            {/* Editable form fields */}
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Vehicle *</label>
              <select
                value={form.vehicleId}
                onChange={e => setForm(f => ({ ...f, vehicleId: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.name} — {v.make} {v.model}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-blue-400" /> Date
                </label>
                <input type="date" value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-emerald-400" /> Cost
                </label>
                <input type="number" step="0.01" value={form.cost}
                  onChange={e => setForm(f => ({ ...f, cost: e.target.value }))}
                  placeholder="0.00"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium flex items-center gap-1">
                <Wrench className="w-3 h-3 text-amber-400" /> Service Type
              </label>
              <select value={form.serviceType}
                onChange={e => setForm(f => ({ ...f, serviceType: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="">Auto-detected: {parsed?.serviceType || 'Unknown'}</option>
                {SERVICE_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium flex items-center gap-1">
                <Building2 className="w-3 h-3 text-slate-400" /> Description / Shop
              </label>
              <input type="text" value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Shop name or notes..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Mileage</label>
              <input type="number" value={form.mileage}
                onChange={e => setForm(f => ({ ...f, mileage: e.target.value }))}
                placeholder="Current mileage"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
            </div>

            {/* Raw OCR text (collapsible) */}
            {rawText && (
              <div className="border border-slate-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => setShowRawText(!showRawText)}
                  className="w-full flex items-center justify-between px-4 py-3 text-xs text-slate-400 hover:text-white transition-all"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5" />
                    Raw OCR Text
                    <span className="text-[9px] text-slate-600">({rawText.length} chars)</span>
                  </span>
                  {showRawText ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>
                {showRawText && (
                  <pre className="px-4 pb-3 text-[10px] text-slate-500 font-mono whitespace-pre-wrap max-h-32 overflow-y-auto leading-relaxed">
                    {rawText}
                  </pre>
                )}
              </div>
            )}

            {/* Parsed data quick reference */}
            {parsed && (
              <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
                <p className="text-[10px] text-slate-500 font-medium mb-2 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-blue-400" />
                  OCR Analysis
                </p>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="text-slate-500">Confidence:</div>
                  <div className={parsed.confidence >= 60 ? 'text-emerald-400' : 'text-amber-400'}>{parsed.confidence}%</div>
                  {parsed.shopName && <><div className="text-slate-500">Shop:</div><div className="text-white truncate">{parsed.shopName}</div></>}
                  {parsed.matchedKeywords.length > 0 && (
                    <div className="col-span-2 flex flex-wrap gap-1 mt-1">
                      {parsed.matchedKeywords.map((kw, i) => (
                        <span key={i} className="text-[8px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-300">{kw}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 text-sm font-medium text-slate-300 hover:bg-slate-800 transition-all">
                Cancel
              </button>
              <button onClick={handleSave}
                disabled={!form.vehicleId}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-medium shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                Save Log Entry
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}