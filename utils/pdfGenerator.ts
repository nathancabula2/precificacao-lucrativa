
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Budget, StudioSettings } from '../types';

export const generateBudgetPDF = (budget: Budget, studio: StudioSettings) => {
  const doc = new jsPDF();
  // Define colors as tuples to satisfy jspdf-autotable's Color type requirement
  const primaryColor: [number, number, number] = [209, 16, 90]; // #D1105A
  const secondaryColor: [number, number, number] = [255, 107, 157]; // #FF6B9D

  // --- Header ---
  if (studio.logo) {
    try {
      doc.addImage(studio.logo, 'PNG', 15, 15, 30, 30);
    } catch (e) {
      console.error('Error adding logo to PDF', e);
    }
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(studio.name || 'Meu Ateliê', studio.logo ? 50 : 15, 25);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`WhatsApp: ${studio.whatsapp || 'Não informado'}`, studio.logo ? 50 : 15, 32);
  doc.text(`Data: ${new Date(budget.createdAt).toLocaleDateString('pt-BR')}`, studio.logo ? 50 : 15, 37);

  // Divider
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(0.5);
  doc.line(15, 50, 195, 50);

  // --- Client Info ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('ORÇAMENTO PARA:', 15, 60);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.text(budget.clientName, 15, 68);
  if (budget.clientPhone) {
    doc.setFontSize(10);
    doc.text(`Telefone: ${budget.clientPhone}`, 15, 73);
  }

  // --- Table ---
  // Explicitly casting fontStyle to 'bold' to match FontStyle union type
  const tableData = budget.items.map(item => [
    { content: item.nameSnapshot, styles: { fontStyle: 'bold' as const } },
    item.lineSnapshot,
    item.descriptionSnapshot,
    item.quantity.toString(),
    `R$ ${item.unitPriceSnapshot.toFixed(2)}`,
    `R$ ${item.totalItem.toFixed(2)}`
  ]);

  autoTable(doc, {
    startY: 85,
    head: [['Produto', 'Linha', 'Descrição', 'Qtd', 'Unitário', 'Total']],
    body: tableData,
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontSize: 10,
      halign: 'center'
    },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 20 },
      2: { cellWidth: 'auto' },
      3: { cellWidth: 15, halign: 'center' },
      4: { cellWidth: 25, halign: 'right' },
      5: { cellWidth: 25, halign: 'right' }
    },
    styles: {
      fontSize: 9,
      cellPadding: 5
    }
  });

  const finalY = (doc as any).lastAutoTable.finalY || 150;

  // --- Totals ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('TOTAL GERAL:', 140, finalY + 15);
  doc.setFontSize(16);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(`R$ ${budget.totalGeneral.toFixed(2)}`, 140, finalY + 23);

  // --- Payment & Notes ---
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('FORMA DE PAGAMENTO (PIX):', 15, finalY + 40);
  doc.setFont('helvetica', 'normal');
  doc.text(`${studio.pixType}: ${studio.pixKey || 'A combinar'}`, 15, finalY + 45);

  if (studio.notes) {
    doc.setFont('helvetica', 'bold');
    doc.text('OBSERVAÇÕES:', 15, finalY + 55);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const splitNotes = doc.splitTextToSize(studio.notes, 100);
    doc.text(splitNotes, 15, finalY + 60);
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Este documento é um orçamento e não um comprovante de pagamento.', 105, 285, { align: 'center' });

  doc.save(`Orcamento_${budget.clientName.replace(/\s+/g, '_')}.pdf`);
};
