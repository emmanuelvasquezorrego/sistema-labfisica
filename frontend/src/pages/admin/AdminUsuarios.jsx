import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function AdminUsuarios() {
  const { usuario } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [ediciones, setEdiciones] = useState({});

  const obtenerUsuarios = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/usuarios", {
        headers: {
          Authorization: `Bearer ${usuario.token}`,
        },
      });
      setUsuarios(res.data);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
    }
  };

  const handleEditar = (id, campo, valor) => {
    setEdiciones((prev) => ({
      ...prev,
      [id]: { ...prev[id], [campo]: valor },
    }));
  };

  const guardarCambios = async (id) => {
    try {
      await axios.put(
        `http://localhost:3000/api/usuarios/${id}`,
        ediciones[id],
        {
          headers: {
            Authorization: `Bearer ${usuario.token}`,
          },
        }
      );
      alert("Usuario actualizado");
      setEdiciones((prev) => {
        const nuevo = { ...prev };
        delete nuevo[id];
        return nuevo;
      });
      obtenerUsuarios();
    } catch (err) {
      console.error("Error al actualizar usuario:", err);
      alert("No se pudo actualizar el usuario");
    }
  };

  const restablecerContraseña = async (id) => {
    const nueva = prompt("Ingrese la nueva contraseña para este usuario:");
    if (!nueva) return;

    try {
      await axios.put(
        `http://localhost:3000/api/usuarios/${id}/password`,
        { nuevaContraseña: nueva },
        {
          headers: {
            Authorization: `Bearer ${usuario.token}`,
          },
        }
      );
      alert("Contraseña restablecida correctamente");
    } catch (err) {
      console.error("Error al restablecer contraseña:", err);
      alert("No se pudo restablecer la contraseña");
    }
  };

  const eliminarUsuario = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) return;

    try {
      await axios.delete(`http://localhost:3000/api/usuarios/${id}`, {
        headers: {
          Authorization: `Bearer ${usuario.token}`,
        },
      });
      alert("Usuario eliminado");
      obtenerUsuarios();
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      alert("No se pudo eliminar el usuario");
    }
  };

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      u.correo.toLowerCase().includes(filtro.toLowerCase())
  );

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  return (
    <div className="flex justify-center mt-12 p-6">
      <div className="w-full max-w-5xl">
        <h2 className="text-2xl font-bold text-vino mb-6 text-center">Gestión de Usuarios</h2>

        <input
          type="text"
          placeholder="Buscar por nombre o correo"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="w-full mb-6 px-4 py-2 border rounded"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {usuariosFiltrados.map((u) => (
            <div key={u.id_usuario} className="bg-white border border-vino rounded p-4 shadow">
                <p className="font-semibold">Nombre: {u.nombre}</p>
                <p>Correo: {u.correo}</p>

                <label className="text-sm font-semibold">Rol:</label>
                <select
                    value={ediciones[u.id_usuario]?.rol ?? u.rol}
                    onChange={(e) => handleEditar(u.id_usuario, "rol", e.target.value)}
                    className="border rounded px-3 py-1 w-full mb-3"
                >
                    <option value="estudiante">Estudiante</option>
                    <option value="admin">Administrador</option>
                </select>

                <button
                    onClick={() => guardarCambios(u.id_usuario)}
                    className="bg-vino text-white py-2 px-3 rounded hover:opacity-90 mr-2"
                >
                    Cambiar rol
                </button>

                <button
                    onClick={() => restablecerContraseña(u.id_usuario)}
                    className="mt-2 bg-gray-700 text-white py-2 px-3 rounded hover:opacity-90 mr-2"
                >
                    Restablecer contraseña
                </button>

                <button
                    onClick={() => eliminarUsuario(u.id_usuario)}
                    className=" bg-red-600 text-white py-2 px-3 rounded hover:opacity-90"
                >
                    Eliminar usuario
                </button>
                </div>
          ))}
        </div>
      </div>
    </div>
  );
}