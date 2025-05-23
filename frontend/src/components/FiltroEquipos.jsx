export default function FiltroEquipos({ filtro, setFiltro }) {
  return (
    <div className="flex flex-wrap items-center gap-4 w-full">
      <input
        type="text"
        placeholder="Buscar por nombre"
        value={filtro.texto}
        onChange={(e) => setFiltro({ ...filtro, texto: e.target.value })}
        className="border rounded px-3 py-1 flex-grow max-w-xs"
      />
      <select
        value={filtro.estado}
        onChange={(e) => setFiltro({ ...filtro, estado: e.target.value })}
        className="border rounded px-3 py-1"
      >
        <option value="">Todos los estados</option>
        <option value="Disponible">Disponible</option>
        <option value="Prestado">Prestado</option>
        <option value="Dañado">Dañado</option>
      </select>
      <select
        value={filtro.tipo}
        onChange={(e) => setFiltro({ ...filtro, tipo: e.target.value })}
        className="border rounded px-3 py-1"
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