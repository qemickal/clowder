import { useState } from 'react'
import { PawPrint, Menu, X, Sun, Moon, Bell, User } from 'lucide-react'
import { useAnimals } from '../context/AnimalContext'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { animals } = useAnimals()
  const catsCount = animals.filter((a) => a.species === 'cat').length
  const dogsCount = animals.filter((a) => a.species === 'dog').length

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/30">
              <PawPrint className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-brand-700 tracking-tight">CLOWDER</span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            <button className="nav-link px-3 py-2 text-sm">
              <HomeIcon className="w-4 h-4 mr-2" /> Inicio
            </button>
            <button className="nav-link px-3 py-2 text-sm">
              <Cat className="w-4 h-4 mr-2" /> Gatos <span className="bg-brand-200 text-brand-700 text-xs font-bold px-2 py-0.5 rounded ml-1">{catsCount}</span>
            </button>
            <button className="nav-link px-3 py-2 text-sm">
              <Dog className="w-4 h-4 mr-2" /> Perros <span className="bg-brand-200 text-brand-700 text-xs font-bold px-2 py-0.5 rounded ml-1">{dogsCount}</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button className="text-slate-400 hover:text-brand-600 transition-colors p-2 rounded-lg hover:bg-slate-100">
              <Bell className="w-5 h-5" />
            </button>
            <button className="text-slate-400 hover:text-brand-600 transition-colors p-2 rounded-lg hover:bg-slate-100">
              <User className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-slate-600 p-2 rounded-lg hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200">
          <div className="px-4 py-3 space-y-2">
            <button className="nav-link-active w-full justify-start">Inicio</button>
            <button className="nav-link w-full justify-start">Gatos ({catsCount})</button>
            <button className="nav-link w-full justify-start">Perros ({dogsCount})</button>
            <button className="nav-link w-full justify-start">Agregar animal</button>
          </div>
        </div>
      )}
    </nav>
  )
}
