import { useEffect, useState } from "react";
import EquipoCard from "../components/EquipoCard";
import FiltroEquipos from "../components/FiltroEquipos";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Home({ onAbrirLogin, onAbrirPrestamo }) {
  const { usuario } = useAuth();
  const [equipos, setEquipos] = useState([]);
  const [filtro, setFiltro] = useState({ texto: "", estado: "", tipo: "" });

  useEffect(() => {
    axios.get("http://localhost:3000/api/equipos")
    .then((res) => setEquipos(res.data))
    .catch((err) => console.error("Error al obtener equipos:", err));
  }, []);

  const equiposFiltrados = equipos.filter((e) => {
    const coincideNombre = e.nombre.toLowerCase().includes(filtro.texto.toLowerCase());
    const coincideEstado = filtro.estado ? e.estado === filtro.estado : true;
    const coincideTipo = filtro.tipo ? e.tipo === filtro.tipo : true;
    return coincideNombre && coincideEstado && coincideTipo;
  });

  const handlePedirPrestamo = (equipo) => {
    if (!usuario) {
      onAbrirLogin();
    } else {
      onAbrirPrestamo(equipo);
    }
  };

  return (
    <div className="p-6">
      <FiltroEquipos filtro={filtro} setFiltro={setFiltro} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {equiposFiltrados.map((equipo) => (
          <EquipoCard key={equipo.id_equipo} equipo={equipo} onPedirPrestamo={handlePedirPrestamo} />
        ))}
      </div>
    </div>
  );
}