import { useState } from 'react'
import {
  Bell,
  CalendarDays,
  Cat,
  ChartNoAxesColumnIncreasing,
  ChevronDown,
  ChevronRight,
  Dog,
  House,
  Menu,
  Plus,
  Settings,
  X,
} from 'lucide-react'
import { useAnimals } from '../context/AnimalContext'

export default function Navbar({ onHome, onFilterSpecies, onAddAnimal, speciesFilter = 'all' }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { animals } = useAnimals()
  const catsCount = animals.filter((animal) => animal.species === 'cat').length
  const dogsCount = animals.filter((animal) => animal.species === 'dog').length

  const scrollToSection = (id) => {
    onHome()
    window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 40)
    setMenuOpen(false)
  }

  const select = (callback, value) => {
    callback(value)
    setMenuOpen(false)
  }

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/70 bg-white/80 shadow-sm backdrop-blur-2xl">
      <div className="mx-auto max-w-[1680px] px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="rounded-xl border border-slate-200/70 bg-white/60 p-2 text-slate-600 hover:bg-white lg:hidden"
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>

            <div className="hidden items-center gap-0.5 lg:flex">
              <button type="button" onClick={onHome} className={`nav-link ${speciesFilter === 'all' ? 'text-brand-700' : ''}`}>
                <House className="h-4 w-4" /> <span>Inicio</span>
              </button>
              <button type="button" onClick={() => onFilterSpecies('cat')} className={`nav-link ${speciesFilter === 'cat' ? 'text-brand-700' : ''}`}>
                <Cat className="h-4 w-4" /> <span>Gatos</span>
                <span className="rounded-full bg-brand-100 px-1.5 py-0.5 text-[10px] font-semibold text-brand-700">{catsCount}</span>
              </button>
              <button type="button" onClick={() => onFilterSpecies('dog')} className={`nav-link ${speciesFilter === 'dog' ? 'text-brand-700' : ''}`}>
                <Dog className="h-4 w-4" /> <span>Perros</span>
                <span className="rounded-full bg-brand-100 px-1.5 py-0.5 text-[10px] font-semibold text-brand-700">{dogsCount}</span>
              </button>
              <button type="button" onClick={() => scrollToSection('reminders')} className="nav-link hidden xl:flex">
                <CalendarDays className="h-4 w-4" /> <span>Calendario</span>
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={onHome}
            className="flex shrink-0 items-center lg:absolute lg:left-1/2 lg:-translate-x-1/2"
            aria-label="Ir al inicio de Clowder"
          >
            <img
              src="/clowder-wordmark.png"
              alt="Clowder"
              className="h-6 w-auto max-w-[138px] object-contain sm:h-7 sm:max-w-[168px]"
            />
          </button>

          <div className="flex shrink-0 items-center gap-1.5">
            <div className="hidden items-center gap-0.5 xl:flex">
              <button type="button" onClick={() => scrollToSection('reminders')} className="nav-link px-2.5" title="Recordatorios">
                <Bell className="h-4 w-4" /> <span>Recordatorios</span>
              </button>
              <button type="button" onClick={() => scrollToSection('quick-summary')} className="nav-link px-2.5" title="Reportes">
                <ChartNoAxesColumnIncreasing className="h-4 w-4" /> <span>Reportes</span>
              </button>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setSettingsOpen((open) => !open)}
                  className={`rounded-xl p-2 transition-colors ${settingsOpen ? 'bg-brand-50 text-brand-700' : 'text-slate-500 hover:bg-white hover:text-brand-700'}`}
                  aria-label="Configuración"
                  aria-expanded={settingsOpen}
                >
                  <Settings className="h-4 w-4" />
                </button>
                {settingsOpen && (
                  <div className="absolute right-0 top-12 z-50 w-64 rounded-2xl border border-white/80 bg-white/95 p-4 shadow-card-hover backdrop-blur-xl">
                    <p className="text-xs font-semibold text-slate-800">Configuración de Clowder</p>
                    <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500">
                      Tus perfiles y registros se guardan localmente en este dispositivo.
                    </p>
                  </div>
                )}
              </div>
              <span className="mx-1 hidden items-center gap-1.5 border-l border-slate-200 pl-3 text-xs text-slate-500 2xl:flex">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-50 text-brand-700">C</span>
                Hola, Clowder <ChevronDown className="h-3.5 w-3.5" />
              </span>
            </div>

            <button type="button" onClick={onAddAnimal} className="btn-brand gap-1.5 px-3 py-2 text-xs sm:px-4 sm:text-sm">
              <Plus className="h-4 w-4" /> <span className="hidden sm:inline">Agregar</span>
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-white/70 bg-white/95 px-4 py-3 shadow-card backdrop-blur-2xl lg:hidden">
          <div className="mx-auto grid max-w-[1680px] grid-cols-2 gap-1 sm:grid-cols-3">
            <button type="button" onClick={() => select(onHome)} className="nav-link-active justify-start">
              <House className="h-4 w-4" /> Inicio
            </button>
            <button type="button" onClick={() => select(onFilterSpecies, 'cat')} className="nav-link justify-start">
              <Cat className="h-4 w-4" /> Gatos ({catsCount})
            </button>
            <button type="button" onClick={() => select(onFilterSpecies, 'dog')} className="nav-link justify-start">
              <Dog className="h-4 w-4" /> Perros ({dogsCount})
            </button>
            <button type="button" onClick={() => scrollToSection('reminders')} className="nav-link justify-start">
              <CalendarDays className="h-4 w-4" /> Calendario
            </button>
            <button type="button" onClick={() => scrollToSection('reminders')} className="nav-link justify-start">
              <Bell className="h-4 w-4" /> Recordatorios
            </button>
            <button type="button" onClick={() => scrollToSection('quick-summary')} className="nav-link justify-start">
              <ChartNoAxesColumnIncreasing className="h-4 w-4" /> Reportes <ChevronRight className="ml-auto h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
