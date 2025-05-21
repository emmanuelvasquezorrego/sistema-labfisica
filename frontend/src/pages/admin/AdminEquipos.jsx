import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function AdminEquipos() {
  const { usuario } = useAuth();
  const [equipos, setEquipos] = useState([]);

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

  const handleCambio = (id, campo, valor) => {
    setEquipos((prev) =>
      prev.map((eq) =>
        eq.id_equipo === id ? { ...eq, [campo]: valor } : eq
      )
    );
  };

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

  const crearEquipo = async () => {
    try {
        await axios.post("http://localhost:3000/api/equipos", nuevoEquipo, {
        headers: {
            Authorization: `Bearer ${usuario.token}`,
        },
        });
        setNuevoEquipo({ nombre: "", tipo: "", codigo_inventario: "", estado: "Disponible" });
        obtenerEquipos(); // recarga
        alert("Equipo creado");
    } catch (err) {
        console.error("Error al crear equipo:", err);
        alert("Error al crear equipo");
    }
 };

  const eliminarEquipo = async (id_equipo) => {
  if (!window.confirm("¿Estás seguro de que deseas eliminar este equipo?")) return;

  try {
    await axios.delete(`http://localhost:3000/api/equipos/${id_equipo}`, {
      headers: {
        Authorization: `Bearer ${usuario.token}`,
      },
    });
    obtenerEquipos(); // recargar
    alert("Equipo eliminado");
  } catch (err) {
    console.error("Error al eliminar equipo:", err);
    alert("No se pudo eliminar el equipo");
  }
};

  const [nuevoEquipo, setNuevoEquipo] = useState({
    nombre: "",
    tipo: "",
    codigo_inventario: "",
    estado: "Disponible",
  });

  useEffect(() => {
    obtenerEquipos();
  }, []);

  return (
    <div className="flex justify-center mt-12 p-6">
      <div className="w-full max-w-5xl">
        <h2 className="text-2xl font-bold text-vino mb-6 text-center">Administrar Equipos</h2>
        <div className="bg-white border border-vino rounded p-4 mb-6 shadow max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold mb-2">Nuevo equipo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nombre"
                value={nuevoEquipo.nombre}
                onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, nombre: e.target.value })}
                className="border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Tipo"
                value={nuevoEquipo.tipo}
                onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, tipo: e.target.value })}
                className="border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Código Inventario"
                value={nuevoEquipo.codigo_inventario}
                onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, codigo_inventario: e.target.value })}
                className="border rounded px-3 py-2"
              />
            </div>
            <button
                onClick={crearEquipo}
                className="mt-4 bg-vino text-white py-2 px-4 rounded hover:opacity-90"
            >
                Crear equipo
            </button>
            </div>
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