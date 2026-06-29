import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { formatDate, formatCurrency, formatNumber } from './helpers';

export function generateResaleReport(vehicles, logs, reminders) {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Colors
  const PRIMARY = '#1e40af';
  const DARK = '#0f172a';
  const GRAY = '#64748b';
  const WHITE = '#ffffff';

  // Helper: draw a colored bar
  const headerBar = (y, color, height = 4) => {
    doc.setFillColor(color);
    doc.rect(0, y, pageWidth, height, 'F');
  };

  // ============ PAGE 1: Cover / Header ============
  doc.setFillColor(DARK);
  doc.rect(0, 0, pageWidth, 60, 'F');
  headerBar(60, PRIMARY);

  doc.setTextColor(WHITE);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('MyAutoLog', pageWidth / 2, 30, { align: 'center' });

  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Vehicle Service History Report', pageWidth / 2, 44, { align: 'center' });

  doc.setFontSize(9);
  doc.setTextColor('#94a3b8');
  doc.text(`Generated ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`, pageWidth / 2, 54, { align: 'center' });

  // ============ Vehicle Summary ============
  let yPos = 80;

  doc.setTextColor(DARK);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Vehicle Summary', 14, yPos);
  yPos += 10;

  vehicles.forEach((v, i) => {
    if (yPos > pageHeight - 40) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFillColor('#f8fafc');
    doc.rect(14, yPos, pageWidth - 28, 24, 'F');
    doc.setDrawColor('#e2e8f0');
    doc.rect(14, yPos, pageWidth - 28, 24, 'S');

    doc.setTextColor(DARK);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(v.name || `${v.year} ${v.make} ${v.model}`, 20, yPos + 8);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(GRAY);
    doc.text(`${v.year} ${v.make} ${v.model} | ${formatNumber(v.mileage)} miles | ${v.license_plate || 'No plate'}`, 20, yPos + 18);

    yPos += 32;
  });

  // ============ Service History ============
  yPos += 8;
  if (yPos > pageHeight - 30) { doc.addPage(); yPos = 20; }

  doc.setTextColor(DARK);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Service History', 14, yPos);
  yPos += 8;

  if (logs.length === 0) {
    doc.setFontSize(10);
    doc.setTextColor(GRAY);
    doc.text('No service records logged.', 14, yPos);
    yPos += 10;
  } else {
    const tableData = logs
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map(l => {
        const v = vehicles.find(v => v.id === l.vehicleId);
        return [
          formatDate(l.date),
          v?.name || 'Unknown',
          l.serviceType,
          formatNumber(l.mileage),
          l.cost > 0 ? formatCurrency(l.cost) : '—',
        ];
      });

    doc.autoTable({
      startY: yPos,
      head: [['Date', 'Vehicle', 'Service', 'Mileage', 'Cost']],
      body: tableData,
      headStyles: {
        fillColor: [30, 64, 175],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9,
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [51, 65, 85],
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      styles: {
        cellPadding: 3,
      },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 25 },
        2: { cellWidth: 40 },
        3: { cellWidth: 20, halign: 'right' },
        4: { cellWidth: 20, halign: 'right' },
      },
    });

    yPos = doc.lastAutoTable.finalY + 10;

    // Total costs
    const totalCost = logs.reduce((s, l) => s + (l.cost || 0), 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(DARK);
    doc.text(`Total Maintenance Cost: ${formatCurrency(totalCost)}`, 14, yPos);
    yPos += 12;
  }

  // ============ Upcoming Reminders ============
  if (yPos > pageHeight - 40) { doc.addPage(); yPos = 20; }

  const activeReminders = reminders.filter(r => r.enabled !== false);
  if (activeReminders.length > 0) {
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(DARK);
    doc.text('Upcoming Maintenance', 14, yPos);
    yPos += 8;

    const remData = activeReminders.map(r => {
      const v = vehicles.find(v => v.id === r.vehicleId);
      return [
        v?.name || 'Unknown',
        r.title,
        `${formatNumber(r.dueMileage || 0)} mi`,
        r.description?.slice(0, 40) || '—',
      ];
    });

    doc.autoTable({
      startY: yPos,
      head: [['Vehicle', 'Reminder', 'Due Mileage', 'Notes']],
      body: remData,
      headStyles: {
        fillColor: [30, 64, 175],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9,
      },
      bodyStyles: { fontSize: 8, textColor: [51, 65, 85] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      styles: { cellPadding: 3 },
    });
    yPos = doc.lastAutoTable.finalY + 10;
  }

  // ============ Footer ============
  if (yPos > pageHeight - 20) { doc.addPage(); yPos = 20; }

  doc.setDrawColor('#e2e8f0');
  doc.line(14, pageHeight - 18, pageWidth - 14, pageHeight - 18);
  doc.setFontSize(7);
  doc.setTextColor(GRAY);
  doc.text('Generated by MyAutoLog — Smart Vehicle Maintenance Tracker', pageWidth / 2, pageHeight - 8, { align: 'center' });

  // Save
  const filename = `service-history-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
  return filename;
}