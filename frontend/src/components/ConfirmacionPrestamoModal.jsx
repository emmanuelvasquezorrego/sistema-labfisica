export default function ConfirmacionPrestamoModal({ isOpen, onClose, onDescargar }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow w-full max-w-md text-center">
        <h2 className="text-xl font-bold text-green-700 mb-4">¡Préstamo realizado!</h2>
        <p className="mb-4">Tu solicitud fue registrada correctamente.</p>
        <div className="flex justify-center mb-4">
          <button
            onClick={onDescargar}
            className="text-vino underline text-lg"
          >
            Descargar recibo
          </button>
        </div>
        <button
          onClick={onClose}
          className="text-vino underline mb-4 mx-auto block text-lg"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}