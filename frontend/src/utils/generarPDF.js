// Función para generar un PDF con los detalles del préstamo
import jsPDF from "jspdf"; // Importa la librería jsPDF

export default function generarPDF({ usuario, equipo, fechaInicio, fechaFin }) {
  const doc = new jsPDF();

  // Nombre del usuario o valor por defecto
  const nombre = usuario?.nombre || "Estudiante";

  // Texto con nombre y tipo de equipo o valores por defecto
  const equipoTexto = `${equipo?.nombre || "Equipo"} (${equipo?.tipo || ""})`;

  // Título del recibo
  doc.setFontSize(16);
  doc.text("Recibo de Préstamo", 20, 20);

  // Información del préstamo
  doc.setFontSize(12);
  doc.text(`Estudiante: ${nombre}`, 20, 35);
  doc.text(`Equipo: ${equipoTexto}`, 20, 45);
  doc.text(`Fecha Inicio: ${fechaInicio}`, 20, 55);
  doc.text(`Fecha Fin: ${fechaFin}`, 20, 65);

  // Mensaje final
  doc.text("Gracias por utilizar el laboratorio.", 20, 85);

  // Guarda el archivo PDF con nombre fijo
  doc.save("prestamo_laboratorio.pdf");
}