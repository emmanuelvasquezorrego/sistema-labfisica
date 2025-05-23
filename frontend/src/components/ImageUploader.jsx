// Componente para subir imagen de equipo
// Importa useState para manejar estado local
// Importa función para guardar imagen en almacenamiento
import { useState } from 'react';
import { saveEquipmentImage } from '../utils/imageStorage';

export default function ImageUploader({ equipoId, currentImage }) {
  // Estado para la vista previa de la imagen (inicializado con imagen actual si existe)
  const [preview, setPreview] = useState(currentImage || '');

  // Función que maneja la carga de un nuevo archivo
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Crear una vista previa temporal usando FileReader
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    // Guardar el archivo en el almacenamiento persistente (async)
    await saveEquipmentImage(equipoId, file);
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-vino file:text-white
          hover:file:bg-vino-dark"
      />
      {preview && (
        <div className="mt-2">
          <img 
            src={preview} 
            alt="Vista previa" 
            className="h-32 object-cover rounded border"
          />
        </div>
      )}
    </div>
  );
}