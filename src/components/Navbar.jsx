import { useEffect, useRef, useState } from 'react'
import {
  Bell,
  CalendarDays,
  Cat,
  ChartNoAxesColumnIncreasing,
  ChevronDown,
  ChevronRight,
  Dog,
  Ellipsis,
  House,
  Plus,
  Settings,
} from 'lucide-react'
import { useAnimals } from '../context/AnimalContext'

const mobileItemClass = (active) => (
  `flex min-h-[58px] min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-0.5 py-1 text-[10px] font-semibold leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${active
    ? 'bg-brand-50 text-brand-700'
    : 'text-slate-500 hover:bg-brand-50/70 hover:text-brand-700'}`
)

export default function Navbar({ onHome, onFilterSpecies, onAddAnimal, speciesFilter = 'all', isHome = true }) {
  const [moreOpen, setMoreOpen] = useState(false)
  const [activeSection, setActiveSection] = useState(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const mobileNavRef = useRef(null)
  const moreButtonRef = useRef(null)
  const { animals } = useAnimals()
  const catsCount = animals.filter((animal) => animal.species === 'cat').length
  const dogsCount = animals.filter((animal) => animal.species === 'dog').length

  useEffect(() => {
    if (!moreOpen) return undefined
    const onOutsideClick = (event) => {
      if (!mobileNavRef.current?.contains(event.target)) setMoreOpen(false)
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMoreOpen(false)
        moreButtonRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', onOutsideClick)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onOutsideClick)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [moreOpen])

  useEffect(() => {
    if (!isHome) {
      setActiveSection(null)
      setMoreOpen(false)
    }
  }, [isHome])

  useEffect(() => setActiveSection(null), [speciesFilter])

  // Keep the selected destination in sync when the dashboard is scrolled by hand.
  useEffect(() => {
    if (!isHome) return undefined
    let frame
    const updateSection = () => {
      frame = undefined
      const marker = 120
      const visible = ['quick-summary', 'reminders'].find((id) => {
        const rect = document.getElementById(id)?.getBoundingClientRect()
        return rect && rect.top <= marker && rect.bottom > marker
      })
      setActiveSection(visible || null)
    }
    const onScroll = () => {
      if (frame === undefined) frame = window.requestAnimationFrame(updateSection)
    }
    updateSection()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame !== undefined) window.cancelAnimationFrame(frame)
    }
  }, [isHome])

  const selectSpecies = (species) => {
    setActiveSection(null)
    setMoreOpen(false)
    onFilterSpecies(species)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToSection = (id) => {
    setActiveSection(id)
    setMoreOpen(false)
    onHome()
    window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 40)
  }

  const isSpeciesActive = (species) => isHome && !activeSection && speciesFilter === species

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/70 bg-white/80 pt-[env(safe-area-inset-top)] shadow-sm backdrop-blur-2xl print:hidden">
        <div className="mx-auto max-w-[1680px] px-4 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] sm:px-6 sm:pl-[max(1.5rem,env(safe-area-inset-left))] sm:pr-[max(1.5rem,env(safe-area-inset-right))] lg:px-8">
          <div className="relative flex h-16 items-center justify-between gap-3">
            <nav aria-label="Navegación principal" className="hidden min-w-0 items-center gap-0.5 lg:flex">
              <button type="button" onClick={() => selectSpecies('all')} className={`nav-link ${isSpeciesActive('all') ? 'text-brand-700' : ''}`}>
                <House className="h-4 w-4" /> <span>Inicio</span>
              </button>
              <button type="button" onClick={() => selectSpecies('cat')} className={`nav-link ${isSpeciesActive('cat') ? 'text-brand-700' : ''}`}>
                <Cat className="h-4 w-4" /> <span>Gatos</span>
                <span className="rounded-full bg-brand-100 px-1.5 py-0.5 text-[10px] font-semibold text-brand-700">{catsCount}</span>
              </button>
              <button type="button" onClick={() => selectSpecies('dog')} className={`nav-link ${isSpeciesActive('dog') ? 'text-brand-700' : ''}`}>
                <Dog className="h-4 w-4" /> <span>Perros</span>
                <span className="rounded-full bg-brand-100 px-1.5 py-0.5 text-[10px] font-semibold text-brand-700">{dogsCount}</span>
              </button>
              <button type="button" onClick={() => scrollToSection('reminders')} className="nav-link hidden xl:flex">
                <CalendarDays className="h-4 w-4" /> <span>Calendario</span>
              </button>
            </nav>

            <button
              type="button"
              onClick={() => selectSpecies('all')}
              className="flex shrink-0 items-center lg:absolute lg:left-1/2 lg:-translate-x-1/2"
              aria-label="Ir al inicio de Clowder"
            >
              <img src="/clowder-wordmark.png" alt="Clowder" className="h-6 w-auto max-w-[138px] object-contain sm:h-7 sm:max-w-[168px]" />
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
                <Plus className="h-4 w-4" /> <span>Agregar</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav
        ref={mobileNavRef}
        aria-label="Navegación móvil"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-white/80 bg-white/95 shadow-[0_-8px_24px_-18px_rgba(15,23,42,0.35)] backdrop-blur-2xl lg:hidden print:hidden"
      >
        <div id="mobile-more-menu" hidden={!moreOpen} className="absolute bottom-[calc(100%+0.5rem)] left-[max(0.75rem,env(safe-area-inset-left))] right-[max(0.75rem,env(safe-area-inset-right))] rounded-2xl border border-white/90 bg-white p-2 shadow-card-hover">
          <button type="button" onClick={() => scrollToSection('reminders')} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-slate-700 hover:bg-brand-50">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700"><Bell className="h-4 w-4" aria-hidden="true" /></span>
            <span className="min-w-0 flex-1"><span className="block text-sm font-semibold">Recordatorios</span><span className="block text-[11px] text-slate-500">Consulta los cuidados pendientes</span></span>
            <ChevronRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
          </button>
          <button type="button" onClick={() => scrollToSection('quick-summary')} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-slate-700 hover:bg-brand-50">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700"><ChartNoAxesColumnIncreasing className="h-4 w-4" aria-hidden="true" /></span>
            <span className="min-w-0 flex-1"><span className="block text-sm font-semibold">Reportes</span><span className="block text-[11px] text-slate-500">Ver el resumen de tu clowder</span></span>
            <ChevronRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
          </button>
        </div>

        <div className="mx-auto grid max-w-xl grid-cols-5 gap-1 px-2 pb-[calc(0.25rem+env(safe-area-inset-bottom))] pl-[max(0.5rem,env(safe-area-inset-left))] pr-[max(0.5rem,env(safe-area-inset-right))] pt-1">
          <button type="button" onClick={() => selectSpecies('all')} className={mobileItemClass(isSpeciesActive('all'))} aria-current={isSpeciesActive('all') ? 'page' : undefined}>
            <House className="h-5 w-5" aria-hidden="true" /><span>Inicio</span>
          </button>
          <button type="button" onClick={() => selectSpecies('cat')} className={mobileItemClass(isSpeciesActive('cat'))} aria-current={isSpeciesActive('cat') ? 'page' : undefined} aria-label={`Gatos (${catsCount})`}>
            <Cat className="h-5 w-5" aria-hidden="true" /><span>Gatos</span>
          </button>
          <button type="button" onClick={() => selectSpecies('dog')} className={mobileItemClass(isSpeciesActive('dog'))} aria-current={isSpeciesActive('dog') ? 'page' : undefined} aria-label={`Perros (${dogsCount})`}>
            <Dog className="h-5 w-5" aria-hidden="true" /><span>Perros</span>
          </button>
          <button type="button" onClick={() => scrollToSection('reminders')} className={mobileItemClass(isHome && activeSection === 'reminders')} aria-current={isHome && activeSection === 'reminders' ? 'location' : undefined} aria-label="Agenda: calendario y recordatorios">
            <CalendarDays className="h-5 w-5" aria-hidden="true" /><span>Agenda</span>
          </button>
          <button
            ref={moreButtonRef}
            type="button"
            onClick={() => setMoreOpen((open) => !open)}
            className={mobileItemClass(moreOpen || (isHome && activeSection === 'quick-summary'))}
            aria-expanded={moreOpen}
            aria-controls="mobile-more-menu"
            aria-current={isHome && activeSection === 'quick-summary' ? 'location' : undefined}
          >
            <Ellipsis className="h-5 w-5" aria-hidden="true" /><span>Más</span>
          </button>
        </div>
      </nav>
    </>
  )
}
