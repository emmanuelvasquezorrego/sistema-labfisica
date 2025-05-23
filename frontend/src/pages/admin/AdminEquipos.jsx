import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function AdminEquipos() {
  const { usuario } = useAuth(); // Usuario autenticado del contexto

  // Estado para la lista de equipos existentes
  const [equipos, setEquipos] = useState([]);
  
  // Estado para manejar el archivo de imagen (por si se añade funcionalidad)
  const [imagenFile, setImagenFile] = useState(null);

  // Estado para el formulario de creación de nuevo equipo
  const [nuevoEquipo, setNuevoEquipo] = useState({
    nombre: "",
    tipo: "",
    codigo_inventario: "",
    estado: "Disponible",
  });

  // Función para obtener la lista de equipos desde el backend
  const obtenerEquipos = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/equipos", {
        headers: {
          Authorization: `Bearer ${usuario.token}`,
        },
      });
      setEquipos(res.data);
    } catch (err) {
      console.error("Error al obtener equipos:", err);
    }
  };

  // Función para manejar cambios en campos de equipos (edición inline)
  const handleCambio = (id, campo, valor) => {
    setEquipos((prev) =>
      prev.map((eq) => (eq.id_equipo === id ? { ...eq, [campo]: valor } : eq))
    );
  };

  // Guardar los cambios hechos a un equipo en el backend
  const guardarCambios = async (equipo) => {
    try {
      await axios.put(`http://localhost:3000/api/equipos/${equipo.id_equipo}`, equipo, {
        headers: {
          Authorization: `Bearer ${usuario.token}`,
        },
      });
      alert("Equipo actualizado");
    } catch (err) {
      console.error("Error al guardar equipo:", err);
      alert("Error al actualizar equipo");
    }
  };

  // Crear un nuevo equipo con la información del formulario
  const crearEquipo = async () => {
    try {
      // Validación básica de campos obligatorios
      if (!nuevoEquipo.nombre || !nuevoEquipo.tipo) {
        alert("Nombre y tipo son campos requeridos");
        return;
      }

      await axios.post(
        "http://localhost:3000/api/equipos",
        {
          nombre: nuevoEquipo.nombre,
          tipo: nuevoEquipo.tipo,
          codigo_inventario: nuevoEquipo.codigo_inventario,
          estado: nuevoEquipo.estado,
        },
        {
          headers: {
            Authorization: `Bearer ${usuario.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Limpiar formulario y recargar lista
      setNuevoEquipo({
        nombre: "",
        tipo: "",
        codigo_inventario: "",
        estado: "Disponible",
      });
      obtenerEquipos();
      alert("Equipo creado con éxito");
    } catch (err) {
      console.error("Error al crear equipo:", err.response?.data || err.message);
      alert(`Error al crear equipo: ${err.response?.data?.message || err.message}`);
    }
  };

  // Eliminar un equipo con confirmación previa
  const eliminarEquipo = async (id_equipo) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este equipo?")) return;

    try {
      await axios.delete(`http://localhost:3000/api/equipos/${id_equipo}`, {
        headers: {
          Authorization: `Bearer ${usuario.token}`,
        },
      });
      obtenerEquipos(); // Recargar lista después de eliminar
      alert("Equipo eliminado");
    } catch (err) {
      console.error("Error al eliminar equipo:", err);
      alert("No se pudo eliminar el equipo");
    }
  };

  // Cargar equipos al montar el componente
  useEffect(() => {
    obtenerEquipos();
  }, []);

  return (
  <div className="flex justify-center mt-12 p-6">
    <div className="w-full max-w-5xl">
      {/* Formulario de creación */}
        <h2 className="text-2xl font-bold text-vino mb-6 text-center">Administrar Equipos</h2>
        <div className="bg-white border border-vino rounded p-4 mb-6 shadow max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold mb-2">Nuevo equipo</h3>
          
          <form onSubmit={(e) => { e.preventDefault(); crearEquipo(); }}>
            <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
              <input
                type="text"
                placeholder="Nombre*"
                value={nuevoEquipo.nombre}
                onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, nombre: e.target.value })}
                className="border rounded px-3 py-2 w-full"
                required
              />
              
              <input
                type="text"
                placeholder="Código Inventario"
                value={nuevoEquipo.codigo_inventario}
                onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, codigo_inventario: e.target.value })}
                className="border rounded px-3 py-2 w-full"
              />
              
              <input
                type="text"
                placeholder="Tipo*"
                value={nuevoEquipo.tipo}
                onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, tipo: e.target.value })}
                className="border rounded px-3 py-2 w-full"
                required
              />
            </div>
            
            <button
              type="submit"
              className="mt-4 bg-vino text-white py-2 px-4 rounded hover:opacity-90 w-full"
            >
              Crear equipo
            </button>
          </form>
        </div>

      {/* Lista de equipos existentes */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {equipos.map((equipo) => (
          <div key={equipo.id_equipo} className="bg-white border border-vino rounded p-4 shadow">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">Nombre:</label>
              <input
                type="text"
                value={equipo.nombre}
                onChange={(e) => handleCambio(equipo.id_equipo, "nombre", e.target.value)}
                className="border rounded px-3 py-1"
              />

              <label className="text-sm font-semibold mt-2">Tipo:</label>
              <input
                type="text"
                value={equipo.tipo}
                onChange={(e) => handleCambio(equipo.id_equipo, "tipo", e.target.value)}
                className="border rounded px-3 py-1"
              />

              <label className="text-sm font-semibold mt-2">Estado:</label>
              <select
                value={equipo.estado}
                onChange={(e) => handleCambio(equipo.id_equipo, "estado", e.target.value)}
                className="border rounded px-3 py-1"
              >
                <option value="Disponible">Disponible</option>
                <option value="En Mantenimiento">En Mantenimiento</option>
                <option value="Dañado">Dañado</option>
              </select>

              <button
                onClick={() => guardarCambios(equipo)}
                className="bg-vino text-white mt-4 py-2 rounded hover:opacity-90"
              >
                Guardar cambios
              </button>

              <button
                onClick={() => eliminarEquipo(equipo.id_equipo)}
                className="mt-2 bg-red-600 text-white py-2 rounded hover:opacity-90"
              >
                Eliminar equipo
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
}