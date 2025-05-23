import { useEffect, useState } from "react";
import EquipoCard from "../components/EquipoCard";
import FiltroEquipos from "../components/FiltroEquipos";
import axios from "axios";
import { useAuth } from "../context/AuthContext";


import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Home({ onAbrirLogin, onAbrirPrestamo }) {
  const { usuario } = useAuth(); // Obtenemos el usuario autenticado desde el contexto

  // Estado para almacenar la lista completa de equipos obtenida desde la API
  const [equipos, setEquipos] = useState([]);

  // Estado para los filtros: texto libre, estado y tipo del equipo
  const [filtro, setFiltro] = useState({ texto: "", estado: "", tipo: "" });

  // Efecto para cargar los equipos desde la API al montar el componente
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/equipos")
      .then((res) => setEquipos(res.data)) // Guardamos los equipos en el estado
      .catch((err) => console.error("Error al obtener equipos:", err));
  }, []);

  // Filtramos la lista de equipos según el texto, estado y tipo indicados
  const equiposFiltrados = equipos.filter((e) => {
    const coincideNombre = e.nombre.toLowerCase().includes(filtro.texto.toLowerCase());
    const coincideEstado = filtro.estado ? e.estado === filtro.estado : true;
    const coincideTipo = filtro.tipo ? e.tipo === filtro.tipo : true;
    return coincideNombre && coincideEstado && coincideTipo;
  });

  // Función para manejar la acción de pedir préstamo
  // Si no hay usuario logueado, se abre el modal de login
  // Si ya está logueado, se abre el modal de préstamo con el equipo seleccionado
  const handlePedirPrestamo = (equipo) => {
    if (!usuario) {
      onAbrirLogin();
    } else {
      onAbrirPrestamo(equipo);
    }
  };

  return (
    <>
      {/* Contenedor de filtros ahora en línea */}
      <div className="flex flex-wrap items-center gap-4"> {/* flex-wrap permite responsive */}
        <FiltroEquipos filtro={filtro} setFiltro={setFiltro} />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {equiposFiltrados.map((equipo) => (
          <EquipoCard key={equipo.id_equipo} equipo={equipo} onPedirPrestamo={handlePedirPrestamo} />
        ))}
      </div>
    </>
  );
}