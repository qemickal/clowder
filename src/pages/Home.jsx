import { useMemo, useState } from 'react'
import {
  Activity,
  Bell,
  CalendarDays,
  Cat,
  Dog,
  Grid,
  List,
  PawPrint,
  Plus,
  Search,
} from 'lucide-react'
import { useAnimals } from '../context/AnimalContext'
import AnimalCard from '../components/AnimalCard'
import DashboardSidebar from '../components/DashboardSidebar'
import { countEventsToday, getDashboardReminders } from '../utils/dashboardData'

function MetricCard({ icon: Icon, value, label, caption, iconTone }) {
  return (
    <div className="glass-card flex min-w-0 items-center gap-3 p-3 sm:p-3.5">
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconTone}`}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-lg font-semibold leading-tight text-slate-900">{value}</p>
        <p className="truncate text-xs font-medium text-slate-700">{label}</p>
        <p className="truncate text-[10px] text-slate-400">{caption}</p>
      </div>
    </div>
  )
}

export default function Home({
  onAnimalSelect,
  onAddAnimal,
  speciesFilter = 'all',
  onSpeciesFilterChange = () => {},
}) {
  const { animals, loading, error } = useAnimals()
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState('grid')

  const catsCount = animals.filter((animal) => animal.species === 'cat').length
  const dogsCount = animals.filter((animal) => animal.species === 'dog').length
  const reminders = useMemo(() => getDashboardReminders(animals), [animals])
  const eventsToday = useMemo(() => countEventsToday(animals), [animals])

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
    `inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${active
      ? 'bg-white text-brand-700 shadow-sm ring-1 ring-slate-200/70'
      : 'text-slate-500 hover:bg-white/70 hover:text-slate-700'}`
  )

  return (
    <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
      <section className="glass-panel min-w-0 p-4 sm:p-5 xl:p-6">
        <header className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-700">Clowder · bienestar animal</p>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-[1.7rem]">Tus compañeros</h1>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">Un espacio tranquilo para cuidar y seguir su bienestar.</p>
          </div>
          <button type="button" onClick={onAddAnimal} className="btn-outline self-start sm:self-auto">
            <Plus className="h-4 w-4" /> Agregar animal
          </button>
        </header>

        <div className="mb-5 grid grid-cols-2 gap-2.5 xl:grid-cols-4">
          <MetricCard icon={Cat} value={catsCount} label="Gatos" caption="En tu familia" iconTone="bg-brand-50 text-brand-700" />
          <MetricCard icon={Dog} value={dogsCount} label="Perros" caption="En tu familia" iconTone="bg-sky-50 text-sky-700" />
          <MetricCard icon={Bell} value={reminders.length} label="Recordatorios" caption="Por atender" iconTone="bg-emerald-50 text-emerald-700" />
          <MetricCard icon={CalendarDays} value={eventsToday} label="Hoy" caption="Eventos registrados" iconTone="bg-violet-50 text-violet-700" />
        </div>

        <div className="mb-3 flex flex-col gap-2.5 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              type="search"
              aria-label="Buscar animal por nombre"
              placeholder="Buscar por nombre..."
              className="input-field pl-9"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1 rounded-xl bg-slate-100/70 p-1">
              <button type="button" onClick={() => onSpeciesFilterChange('all')} className={filterClass(speciesFilter === 'all')}>
                Todos
              </button>
              <button type="button" onClick={() => onSpeciesFilterChange('cat')} className={filterClass(speciesFilter === 'cat')}>
                <Cat className="h-3.5 w-3.5" aria-hidden="true" /> Gatos
              </button>
              <button type="button" onClick={() => onSpeciesFilterChange('dog')} className={filterClass(speciesFilter === 'dog')}>
                <Dog className="h-3.5 w-3.5" aria-hidden="true" /> Perros
              </button>
            </div>

            <div className="flex items-center gap-1 rounded-xl border border-slate-200/70 bg-white/55 p-1" role="group" aria-label="Modo de visualización">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`rounded-lg p-2 transition-colors ${viewMode === 'grid' ? 'bg-brand-50 text-brand-700 shadow-sm' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
                title="Vista en cuadrícula"
                aria-label="Vista en cuadrícula"
                aria-pressed={viewMode === 'grid'}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`rounded-lg p-2 transition-colors ${viewMode === 'list' ? 'bg-brand-50 text-brand-700 shadow-sm' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
                title="Vista en lista"
                aria-label="Vista en lista"
                aria-pressed={viewMode === 'list'}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="mb-3 flex items-center justify-between border-b border-slate-200/60 pb-2.5">
          <p className="text-xs text-slate-500">
            <span className="font-semibold text-slate-700">{filteredAnimals.length}</span> resultado{filteredAnimals.length === 1 ? '' : 's'}
          </p>
          <p className="hidden items-center gap-1 text-[10px] text-slate-400 sm:flex">
            <Activity className="h-3.5 w-3.5" aria-hidden="true" /> Datos guardados en este dispositivo
          </p>
        </div>

        {filteredAnimals.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white/40 px-5 py-12 text-center">
            <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <PawPrint className="h-5 w-5" strokeWidth={1.5} />
            </span>
            <h2 className="text-sm font-semibold text-slate-900">
              {animals.length === 0 ? 'Aún no hay integrantes' : 'No encontramos coincidencias'}
            </h2>
            <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500">
              {animals.length === 0
                ? 'Agrega a tu primer compañero para empezar a llevar su registro de bienestar.'
                : 'Prueba con otro nombre o cambia el filtro de especie.'}
            </p>
            {animals.length === 0 ? (
              <button type="button" onClick={onAddAnimal} className="btn-brand mt-4">
                <Plus className="h-4 w-4" /> Agregar primer animal
              </button>
            ) : (
              <button type="button" onClick={() => { setSearch(''); onSpeciesFilterChange('all') }} className="btn-outline mt-4">
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4' : 'grid grid-cols-1 gap-3'}>
            {filteredAnimals.map((animal) => (
              <AnimalCard key={animal.id} animal={animal} onSelect={onAnimalSelect} viewMode={viewMode} />
            ))}
          </div>
        )}
      </section>

      <DashboardSidebar
        animals={animals}
        reminders={reminders}
        catsCount={catsCount}
        dogsCount={dogsCount}
        onAnimalSelect={onAnimalSelect}
      />
    </div>
  )
}
