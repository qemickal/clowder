import { useState } from 'react'
import { Search, Plus, Grid, List, PawPrint } from 'lucide-react'
import { useAnimals } from '../context/AnimalContext'
import AnimalCard from '../components/AnimalCard'

export default function Home({ onAnimalSelect, onAddAnimal }) {
  const { animals, loading } = useAnimals()
  const [search, setSearch] = useState('')
  const [speciesFilter, setSpeciesFilter] = useState('all')
  const [viewMode, setViewMode] = useState('grid')

  const filteredAnimals = animals.filter((a) => {
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase())
    const matchesSpecies = speciesFilter === 'all' || a.species === speciesFilter
    return matchesSearch && matchesSpecies
  })

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <PawPrint className="w-12 h-12 text-brand-400 animate-spin mb-4" />
        <p className="text-slate-500">Cargando tu clowder...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 text-balance">CLOWDER</h1>
          <p className="text-slate-600 mt-1">
            Bienvenido/a. Aquí llevas el registro y bienestar de tus {animals.length} animales.
          </p>
        </div>
        <button
          onClick={onAddAnimal}
          className="btn-brand flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Agregar animal
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nombre..."
              className="input-field pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSpeciesFilter('all')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                speciesFilter === 'all'
                  ? 'bg-brand-100 text-brand-700 shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setSpeciesFilter('cat')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                speciesFilter === 'cat'
                  ? 'bg-brand-100 text-brand-700 shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Gatos
            </button>
            <button
              onClick={() => setSpeciesFilter('dog')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                speciesFilter === 'dog'
                  ? 'bg-indigo-100 text-indigo-700 shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Perros
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg text-sm transition-all ${
              viewMode === 'grid'
                ? 'bg-brand-100 text-brand-700'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
            title="Vista en grid"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg text-sm transition-all ${
              viewMode === 'list'
                ? 'bg-brand-100 text-brand-700'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
            title="Vista en lista"
          >
            <List className="w-4 h-4" />
          </button>
          <span className="text-xs text-slate-400 ml-2">{filteredAnimals.length} resultado{filteredAnimals.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {filteredAnimals.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <PawPrint className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No hay animales</h3>
          <p className="text-slate-500 mb-6 max-w-xs mx-auto">
            ¡Aún no has agregado ningún integrante! Presiona el botón de arriba para comenzar.
          </p>
          <button onClick={onAddAnimal} className="btn-brand">
            <Plus className="w-4 h-4 mr-2" /> Agregar primer animal
          </button>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-3'}>
          {filteredAnimals.map((animal) => (
            <AnimalCard key={animal.id} animal={animal} onSelect={onAnimalSelect} />
          ))}
        </div>
      )}
    </div>
  )
}
