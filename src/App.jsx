import { useState } from 'react'
import { useAnimals } from './context/AnimalContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import AnimalDetail from './pages/AnimalDetail'
import AddAnimalForm from './components/AddAnimalForm'
import {
  Plus,
  ArrowLeft,
  PawPrint,
  Cat,
  Dog,
  Home as HomeIcon,
  Settings,
  Filter,
} from 'lucide-react'

export default function App() {
  const [view, setView] = useState('home') // 'home' | 'detail' | 'add'
  const [selectedAnimal, setSelectedAnimal] = useState(null)
  const [showAdd, setShowAdd] = useState(false)

  return (
    <div className="min-h-screen bg-brand-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {view === 'add' || showAdd ? (
          <div className="flex flex-col lg:flex-row gap-6">
            <button
              onClick={() => { setView('home'); setShowAdd(false) }}
              className="nav-link mb-4"
            >
              <ArrowLeft className="w-4 h-4" /> Volver al inicio
            </button>
            <AddAnimalForm onClose={() => setShowAdd(false)} onSuccess={() => setView('home')} />
          </div>
        ) : view === 'detail' && selectedAnimal ? (
          <div className="flex flex-col lg:flex-row gap-6">
            <button
              onClick={() => setView('home')}
              className="nav-link mb-4"
            >
              <ArrowLeft className="w-4 h-4" /> Volver al inicio
            </button>
            <AnimalDetail animal={selectedAnimal} onBack={() => setView('home')} />
          </div>
        ) : (
          <Home onAnimalSelect={(animal) => { setSelectedAnimal(animal); setView('detail') }} onAddAnimal={() => setShowAdd(true)} />
        )}
      </div>
    </div>
  )
}
