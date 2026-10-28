import { useState } from 'react'
import { Cat, Dog, Grid, List, PawPrint, Plus, Search } from 'lucide-react'
import { useAnimals } from '../context/AnimalContext'
import AnimalCard from '../components/AnimalCard'

export default function Home({
  onAnimalSelect,
  onAddAnimal,
  speciesFilter = 'all',
  onSpeciesFilterChange = () => {},
}) {
  const { animals, loading, error } = useAnimals()
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState('grid')

  const filteredAnimals = animals.filter((animal) => {
    const matchesSearch = (animal.name || '').toLowerCase().includes(search.toLowerCase())
    const matchesSpecies = speciesFilter === 'all' || animal.species === speciesFilter
    return matchesSearch && matchesSpecies
  })

  if (loading) {
    return (
      <div className="flex h-80 flex-col items-center justify-center gap-3">
        <PawPrint className="h-8 w-8 animate-pulse text-brand-400" strokeWidth={1.5} />
        <p className="text-sm text-slate-500">Cargando tu clowder...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div role="alert" className="glass-card mx-auto mt-8 max-w-xl p-7 text-center">
        <PawPrint className="mx-auto mb-3 h-9 w-9 text-brand-500" strokeWidth={1.5} />
        <h1 className="text-lg font-semibold text-slate-900">No se pudo cargar Clowder</h1>
        <p className="mt-2 text-sm text-slate-600">{error}</p>
        <button type="button" onClick={() => window.location.reload()} className="btn-brand mt-5">Volver a intentar</button>
      </div>
    )
  }

  const filterClass = (active) => (
    `inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${active
      ? 'bg-white text-brand-700 shadow-sm ring-1 ring-slate-200/70'
      : 'text-slate-500 hover:bg-white/70 hover:text-slate-700'}`
  )

  return (
    <div className="space-y-5">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-600">Clowder · bienestar animal</p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Tus compañeros</h1>
          <p className="mt-1 text-sm text-slate-500">
            Un espacio tranquilo para cuidar y seguir su bienestar.
          </p>
        </div>
        <button type="button" onClick={onAddAnimal} className="btn-brand self-start sm:self-auto">
          <Plus className="h-4 w-4" strokeWidth={1.8} /> Agregar animal
        </button>
      </header>

      <section className="glass-panel p-3 sm:p-4" aria-label="Buscar y filtrar animales">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" strokeWidth={1.7} aria-hidden="true" />
            <input
              type="search"
              aria-label="Buscar animal por nombre"
              placeholder="Buscar por nombre..."
              className="input-field pl-9"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="flex items-center gap-1 rounded-xl bg-slate-100/70 p-1">
            <button type="button" onClick={() => onSpeciesFilterChange('all')} className={filterClass(speciesFilter === 'all')}>
              Todos
            </button>
            <button type="button" onClick={() => onSpeciesFilterChange('cat')} className={filterClass(speciesFilter === 'cat')}>
              <Cat className="h-3.5 w-3.5" strokeWidth={1.7} aria-hidden="true" /> Gatos
            </button>
            <button type="button" onClick={() => onSpeciesFilterChange('dog')} className={filterClass(speciesFilter === 'dog')}>
              <Dog className="h-3.5 w-3.5" strokeWidth={1.7} aria-hidden="true" /> Perros
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-slate-200/60 pt-3">
          <span className="text-xs text-slate-500">
            <span className="font-semibold text-slate-700">{filteredAnimals.length}</span> resultado{filteredAnimals.length === 1 ? '' : 's'}
          </span>
          <div className="flex items-center gap-1" role="group" aria-label="Modo de visualización">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`rounded-lg p-2 transition-colors ${viewMode === 'grid' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-400 hover:bg-white/70 hover:text-slate-600'}`}
              title="Vista en cuadrícula"
              aria-label="Vista en cuadrícula"
              aria-pressed={viewMode === 'grid'}
            >
              <Grid className="h-4 w-4" strokeWidth={1.7} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`rounded-lg p-2 transition-colors ${viewMode === 'list' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-400 hover:bg-white/70 hover:text-slate-600'}`}
              title="Vista en lista"
              aria-label="Vista en lista"
              aria-pressed={viewMode === 'list'}
            >
              <List className="h-4 w-4" strokeWidth={1.7} />
            </button>
          </div>
        </div>
      </section>

      {filteredAnimals.length === 0 ? (
        <div className="glass-panel px-6 py-14 text-center">
          <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
            <PawPrint className="h-6 w-6" strokeWidth={1.5} />
          </span>
          <h2 className="text-base font-semibold text-slate-900">
            {animals.length === 0 ? 'Aún no hay integrantes' : 'No encontramos coincidencias'}
          </h2>
          <p className="mx-auto mt-1.5 max-w-sm text-sm text-slate-500">
            {animals.length === 0
              ? 'Agrega a tu primer compañero para empezar a llevar su registro de bienestar.'
              : 'Prueba con otro nombre o cambia el filtro de especie.'}
          </p>
          {animals.length === 0 ? (
            <button type="button" onClick={onAddAnimal} className="btn-brand mt-5">
              <Plus className="h-4 w-4" strokeWidth={1.8} /> Agregar primer animal
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setSearch('')
                onSpeciesFilterChange('all')
              }}
              className="btn-outline mt-5"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid grid-cols-1 gap-3'}>
          {filteredAnimals.map((animal) => (
            <AnimalCard key={animal.id} animal={animal} onSelect={onAnimalSelect} viewMode={viewMode} />
          ))}
        </div>
      )}
    </div>
  )
}
