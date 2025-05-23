import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function AdminUsuarios() {
  const { usuario } = useAuth(); // Obtener datos del usuario autenticado (token, id, etc)
  const [usuarios, setUsuarios] = useState([]); // Lista de usuarios obtenidos del backend
  const [filtro, setFiltro] = useState(""); // Texto para filtrar usuarios por nombre o correo
  const [ediciones, setEdiciones] = useState({}); // Objeto para guardar cambios temporales por usuario (id => campos editados)

  // Función para obtener todos los usuarios desde la API
  const obtenerUsuarios = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/usuarios", {
        headers: {
          Authorization: `Bearer ${usuario.token}`, // Autenticación con token JWT
        },
      });
      setUsuarios(res.data); // Guardar usuarios en estado
    } catch (err) {
      console.error("Error al cargar usuarios:", err); // Mostrar error en consola
    }
  };

  // Función para actualizar el objeto de ediciones cuando el usuario modifica un campo
  const handleEditar = (id, campo, valor) => {
    setEdiciones((prev) => ({
      ...prev,
      [id]: { ...prev[id], [campo]: valor }, // Mantener ediciones anteriores, actualizar el campo modificado
    }));
  };

  // Función para enviar al backend los cambios realizados a un usuario específico
  const guardarCambios = async (id) => {
    try {
      await axios.put(
        `http://localhost:3000/api/usuarios/${id}`,
        ediciones[id], // Enviar solo los campos editados para ese usuario
        {
          headers: {
            Authorization: `Bearer ${usuario.token}`, // Token para autorización
          },
        }
      );
      alert("Usuario actualizado"); // Confirmación al usuario
      // Eliminar ediciones guardadas para este usuario porque ya fueron enviadas
      setEdiciones((prev) => {
        const nuevo = { ...prev };
        delete nuevo[id];
        return nuevo;
      });
      obtenerUsuarios(); // Recargar lista actualizada desde el backend
    } catch (err) {
      console.error("Error al actualizar usuario:", err);
      alert("No se pudo actualizar el usuario"); // Mensaje en caso de error
    }
  };

  // Función para restablecer la contraseña de un usuario (admin ingresa nueva contraseña mediante prompt)
  const restablecerContraseña = async (id) => {
    const nueva = prompt("Ingrese la nueva contraseña para este usuario:");
    if (!nueva) return; // Si cancela o deja vacío, no hace nada

    try {
      await axios.put(
        `http://localhost:3000/api/usuarios/${id}/password`,
        { nuevaContraseña: nueva }, // Enviar la nueva contraseña
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

  // Función para eliminar un usuario con confirmación previa
  const eliminarUsuario = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) return;

    try {
      await axios.delete(`http://localhost:3000/api/usuarios/${id}`, {
        headers: {
          Authorization: `Bearer ${usuario.token}`,
        },
      });
      alert("Usuario eliminado");
      obtenerUsuarios(); // Recargar la lista luego de eliminar
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      alert("No se pudo eliminar el usuario");
    }
  };

  // Filtrar usuarios según texto en nombre o correo (case insensitive)
  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      u.correo.toLowerCase().includes(filtro.toLowerCase())
  );

  // Al montar el componente, obtener usuarios desde el backend
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