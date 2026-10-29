import { useState } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import AnimalDetail from './pages/AnimalDetail'
import AddAnimalForm from './components/AddAnimalForm'

export default function App() {
  const [view, setView] = useState('home')
  const [selectedAnimal, setSelectedAnimal] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [speciesFilter, setSpeciesFilter] = useState('all')

  const goHome = () => {
    setView('home')
    setShowAdd(false)
  }

  const selectSpecies = (species) => {
    setSpeciesFilter(species)
    goHome()
  }

  return (
    <div className="app-shell">
      <Navbar
        onHome={goHome}
        onFilterSpecies={selectSpecies}
        onAddAnimal={() => setShowAdd(true)}
        speciesFilter={speciesFilter}
        isHome={view === 'home'}
      />

      <main className="app-main mx-auto max-w-[1680px] px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-[calc(5rem+env(safe-area-inset-top))] sm:px-6 sm:pl-[max(1.5rem,env(safe-area-inset-left))] sm:pr-[max(1.5rem,env(safe-area-inset-right))] lg:px-8 lg:pb-8">
        {view === 'detail' && selectedAnimal ? (
          <AnimalDetail
            animal={selectedAnimal}
            onBack={() => {
              goHome()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          />
        ) : (
          <Home
            speciesFilter={speciesFilter}
            onSpeciesFilterChange={setSpeciesFilter}
            onAnimalSelect={(animal) => {
              setSelectedAnimal(animal)
              setView('detail')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            onAddAnimal={() => setShowAdd(true)}
          />
        )}
      </main>

      {showAdd && (
        <AddAnimalForm
          onClose={() => setShowAdd(false)}
          onSuccess={goHome}
        />
      )}
    </div>
  )
}
