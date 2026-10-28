import { useState } from 'react'
import { Menu, X, House, Cat, Dog, Plus } from 'lucide-react'
import { useAnimals } from '../context/AnimalContext'

export default function Navbar({ onHome, onFilterSpecies, onAddAnimal, speciesFilter = 'all' }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { animals } = useAnimals()
  const catsCount = animals.filter((animal) => animal.species === 'cat').length
  const dogsCount = animals.filter((animal) => animal.species === 'dog').length

  const select = (callback, value) => {
    callback(value)
    setMenuOpen(false)
  }

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/70 bg-white/75 shadow-sm backdrop-blur-2xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <button type="button" onClick={onHome} className="flex shrink-0 items-center" aria-label="Ir al inicio de Clowder">
            <img
              src="/clowder-wordmark.png"
              alt="Clowder"
              className="h-6 w-auto max-w-[150px] object-contain sm:h-7 sm:max-w-[170px]"
            />
          </button>

          <div className="hidden items-center gap-1 md:flex">
            <button type="button" onClick={onHome} className={`nav-link px-3 py-2 text-sm ${speciesFilter === 'all' ? 'text-brand-700' : ''}`}>
              <House className="mr-1 h-4 w-4" /> Inicio
            </button>
            <button type="button" onClick={() => onFilterSpecies('cat')} className={`nav-link px-3 py-2 text-sm ${speciesFilter === 'cat' ? 'text-brand-700' : ''}`}>
              <Cat className="mr-1 h-4 w-4" /> Gatos
              <span className="ml-1 rounded bg-brand-100 px-2 py-0.5 text-xs font-bold text-brand-700">{catsCount}</span>
            </button>
            <button type="button" onClick={() => onFilterSpecies('dog')} className={`nav-link px-3 py-2 text-sm ${speciesFilter === 'dog' ? 'text-brand-700' : ''}`}>
              <Dog className="mr-1 h-4 w-4" /> Perros
              <span className="ml-1 rounded bg-brand-100 px-2 py-0.5 text-xs font-bold text-brand-700">{dogsCount}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button type="button" onClick={onAddAnimal} className="btn-brand hidden gap-2 px-4 py-2 sm:inline-flex">
              <Plus className="h-4 w-4" /> Agregar
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-white/70 bg-white/85 backdrop-blur-2xl md:hidden">
          <div className="space-y-1 px-4 py-3">
            <button type="button" onClick={() => select(onHome)} className="nav-link-active w-full justify-start">
              <House className="h-4 w-4" /> Inicio
            </button>
            <button type="button" onClick={() => select(onFilterSpecies, 'cat')} className="nav-link w-full justify-start">
              <Cat className="h-4 w-4" /> Gatos ({catsCount})
            </button>
            <button type="button" onClick={() => select(onFilterSpecies, 'dog')} className="nav-link w-full justify-start">
              <Dog className="h-4 w-4" /> Perros ({dogsCount})
            </button>
            <button type="button" onClick={() => select(onAddAnimal)} className="nav-link w-full justify-start text-brand-700">
              <Plus className="h-4 w-4" /> Agregar animal
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
