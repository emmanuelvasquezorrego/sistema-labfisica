import jsPDF from "jspdf";

export default function generarPDF({ usuario, equipo, fechaInicio, fechaFin }) {
  const doc = new jsPDF();
  const nombre = usuario?.nombre || "Estudiante";
  const equipoTexto = `${equipo?.nombre || "Equipo"} (${equipo?.tipo || ""})`;

  doc.setFontSize(16);
  doc.text("Recibo de Préstamo", 20, 20);

  doc.setFontSize(12);
  doc.text(`Estudiante: ${nombre}`, 20, 35);
  doc.text(`Equipo: ${equipoTexto}`, 20, 45);
  doc.text(`Fecha Inicio: ${fechaInicio}`, 20, 55);
  doc.text(`Fecha Fin: ${fechaFin}`, 20, 65);

  doc.text("Gracias por utilizar el laboratorio.", 20, 85);

  doc.save("prestamo_laboratorio.pdf");
}