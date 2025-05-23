import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  LabelList
} from "recharts";

export default function AdminEstadisticas() {
  const { usuario } = useAuth(); // Obtenemos datos del usuario autenticado
  const [porMes, setPorMes] = useState([]); // Datos estadísticos agrupados por mes
  const [masPrestados, setMasPrestados] = useState([]); // Datos de equipos más prestados

  // useEffect para cargar datos estadísticos al montar el componente y cada vez que cambia el token
  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        // Solicitar estadísticas de movimientos agrupados por mes
        const resMes = await axios.get("http://localhost:3000/api/movimientos/estadisticas", {
          headers: { Authorization: `Bearer ${usuario.token}` },
        });
        setPorMes(resMes.data); // Guardar datos por mes en estado

        // Solicitar datos de los equipos más prestados
        const resEquipos = await axios.get("http://localhost:3000/api/movimientos/estadisticas/equipos", {
          headers: { Authorization: `Bearer ${usuario.token}` },
        });
        setMasPrestados(resEquipos.data); // Guardar datos de equipos más prestados en estado

        // Logs para depuración en consola
        console.log("Por Mes:", resMes.data);
        console.log("Más Prestados:", resEquipos.data);
      } catch (error) {
        // Manejo de errores en caso de fallo en las solicitudes
        console.error("Error al cargar estadísticas:", error);
      }
    };

    obtenerDatos();
  }, [usuario.token]);

  const colores = ["#9333ea", "#f59e0b", "#10b981", "#3b82f6", "#ef4444"];

  return (
    <div className="flex justify-center mt-12 p-6">
      <div className="w-full max-w-6xl text-center">
        <h2 className="text-2xl font-bold text-vino mb-8">Estadísticas de Préstamos</h2>

        <h3 className="text-xl font-semibold mb-4">Préstamos por mes</h3>
        <div className="w-full h-[350px] mb-12">
          {porMes.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={porMes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                {Object.keys(porMes[0])
                  .filter((key) => key !== "mes")
                  .map((tipo, i) => (
                    <Bar
                      key={tipo}
                      dataKey={tipo}
                      fill={colores[i % colores.length]}
                    />
                  ))}
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500">Cargando datos...</p>
          )}
        </div>

        <h3 className="text-xl font-semibold mb-4">Equipos más prestados</h3>
        <div className="w-full h-[400px]">
          {masPrestados.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={masPrestados} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="equipo" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="cantidad" fill="#9333ea">
                  <LabelList dataKey="cantidad" position="right" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500">Cargando datos...</p>
          )}
        </div>
      </div>
    </div>
  );
}