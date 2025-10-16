export default function Sidebar() {
  return (
    <div className="w-80 h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-900">La Voz ciudadana</h1>
        <button className="w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors">
          <span className="text-lg font-medium"> + </span>
        </button>
      </div>

      {/* FILTERS SECTION */}
      <div className="p-4 space-y-4">
        {/* Category Filter */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">CATEGORÍA</h3>
          <div className="flex flex-wrap gap-2">
            <button className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800 border border-blue-200">
              Todas
            </button>
            <button className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200">
              Bache
            </button>
            <button className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200">
              Alumbrado
            </button>
            <button className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200">
              Graffiti
            </button>
            <button className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200">
              Accidente
            </button>
            <button className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200">
              Inundación
            </button>
            <button className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200">
              Basura
            </button>
            <button className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200">
              Árbol caído
            </button>
            <button className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200">
              Otro
            </button>
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">ESTADO</h3>
          <div className="flex flex-wrap gap-2">
            <button className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800 border border-blue-200">
              Todas
            </button>
            <button className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200">
              Pendiente
            </button>
            <button className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200">
              En progreso
            </button>
            <button className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200">
              Resuelto
            </button>
          </div>
        </div>
      </div>

      {/* INCIDENTS LIST SECTION aca empiezan las cards*/}
      <div className="flex-1 overflow-y-auto border-t border-gray-200">
        <div className="divide-y divide-gray-200">
          {/* Incident Card 1 */}
          <div className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                Pendiente
              </span>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                Bache
              </span>
            </div>
            <h4 className="font-medium text-gray-900 mb-1">hola</h4>
            <p className="text-sm text-gray-600 mb-2">nada</p>
            <p className="text-xs text-gray-500">Hoy</p>
          </div>

           {/* Card 2 */}
    <div className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
      <div className="flex items-center gap-2 mb-2">
        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
          En progreso
        </span>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          Alumbrado
        </span>
      </div>
      <h4 className="font-medium text-gray-900 mb-1">Farola apagada</h4>
      <p className="text-sm text-gray-600 mb-2">Calle principal sin iluminación</p>
      <p className="text-xs text-gray-500">Ayer</p>
    </div>

          <div className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                Resuelto
              </span>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                Basura
              </span>
            </div>
            <h4 className="font-medium text-gray-900 mb-1">Contenedor lleno</h4>
            <p className="text-sm text-gray-600 mb-2">Desbordamiento en el parque</p>
            <p className="text-xs text-gray-500">Hace 2 días</p>
          </div>
        </div>
      </div>

      {/* FOOTER SECTION */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <p className="text-center text-sm text-gray-500">
          3 incidentes mostrados
        </p>
      </div>
    </div>
  );
}