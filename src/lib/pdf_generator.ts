import jsPDF from "jspdf"
import html2canvas from "html2canvas"

export async function generateProcessPDF(
  element: HTMLDivElement,
  fileName: string
) {
  const pdf = new jsPDF("p", "mm", "a4")

  const pdfWidth = pdf.internal.pageSize.getWidth()
  const pdfHeight = pdf.internal.pageSize.getHeight()

  const canvas = await html2canvas(element, {
    scale: 3, // mayor nitidez
    useCORS: true,
    scrollX: 0,
    scrollY: -window.scrollY,
    windowWidth: element.scrollWidth,
  })

  const imgData = canvas.toDataURL("image/png")

  // márgenes recomendados
  const margin = 10
  const availableWidth = pdfWidth - margin * 2

  const imgWidth = availableWidth
  const imgHeight = (canvas.height * imgWidth) / canvas.width

  let positionY = margin
  let remainingHeight = imgHeight

  // Primera página
  pdf.addImage(imgData, "PNG", margin, positionY, imgWidth, imgHeight)
  remainingHeight -= pdfHeight - margin * 2

  // Páginas siguientes
  while (remainingHeight > 0) {
    pdf.addPage()
    const offset = imgHeight - remainingHeight
    pdf.addImage(
      imgData,
      "PNG",
      margin,
      margin - offset,
      imgWidth,
      imgHeight
    )
    remainingHeight -= pdfHeight - margin * 2
  }

  pdf.save(`${fileName}.pdf`)
}

// src/lib/pdf-generator.ts
/*import jsPDF from "jspdf";
import type { Process } from "./types";

// Colores definidos como tuplas (3 valores exactos)
const primaryColor: [number, number, number] = [33, 150, 243]; // Azul principal
const secondaryColor: [number, number, number] = [3, 169, 244]; // Azul claro

export async function generateProcessPDF(process: Process) {
  const doc = new jsPDF();

  // ====== TÍTULO ======
  doc.setFontSize(24);
  doc.setTextColor(...primaryColor);
  doc.text("Proceso Colaborativo", 20, 30);

  // ====== NOMBRE DEL PROCESO ======
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text("Nombre del Proceso:", 20, 50);
  doc.setFontSize(14);
  doc.setTextColor(60, 60, 60);
  doc.text(process.name_process, 20, 60);

  // ====== ID ======
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text("ID:", 20, 80);
  doc.setFontSize(14);
  doc.setTextColor(60, 60, 60);
  doc.text(process.id_process.toString(), 20, 90);

  // ====== DESCRIPCION EN RECUADRO ======
  const goalText = process.description_process ?? "Descripcion";
  const splitGoal = doc.splitTextToSize(goalText, 160);

  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text("Descripcion:", 20, 110);

  // Dibuja un recuadro azul claro detrás del objetivo
  const boxX = 20;
  const boxY = 115;
  const boxWidth = 170;
  const boxHeight = splitGoal.length * 7 + 10;

  doc.setFillColor(227, 242, 253); // Azul muy claro (#E3F2FD)
  doc.setDrawColor(...secondaryColor); // Azul de borde
  doc.rect(boxX, boxY, boxWidth, boxHeight, "FD"); // Fill + Draw

  // Texto del objetivo dentro del recuadro
  doc.setFontSize(14);
  doc.setTextColor(33, 33, 33);
  doc.text(splitGoal, boxX + 5, boxY + 10);

  // ====== FOOTER ======
  doc.setFontSize(10);
  doc.setTextColor(...secondaryColor);
  doc.text(
    `Generado el ${new Date().toLocaleDateString("es-ES")}`,
    20,
    doc.internal.pageSize.height - 20
  );

  // Guardar el PDF
  doc.save(
    `proceso-${process.id_process}-${process.name_process.replace(/\s+/g, "-").toLowerCase()}.pdf`
  );
}*/