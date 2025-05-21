export default function FiltroEquipos({ filtro, setFiltro }) {
  return (
    <div className="flex flex-wrap gap-4">
      <input
        type="text"
        placeholder="Buscar por nombre"
        value={filtro.texto}
        onChange={(e) => setFiltro({ ...filtro, texto: e.target.value })}
        className="border px-3 py-1 rounded w-full sm:w-auto"
      />
      <select
        value={filtro.estado}
        onChange={(e) => setFiltro({ ...filtro, estado: e.target.value })}
        className="border px-3 py-1 rounded"
      >
        <option value="">Todos los estados</option>
        <option value="Disponible">Disponible</option>
        <option value="Prestado">Prestado</option>
        <option value="Dañado">Dañado</option>
      </select>
      <select
        value={filtro.tipo}
        onChange={(e) => setFiltro({ ...filtro, tipo: e.target.value })}
        className="border px-3 py-1 rounded"
      >
        <option value="">Todos los tipos</option>
        <option value="Eléctrico">Eléctrico</option>
        <option value="Mecánico">Mecánico</option>
        <option value="Térmico">Térmico</option>
        <option value="Óptico">Óptico</option>
      </select>
    </div>
  );
}