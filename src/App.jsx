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
      />

      <main className="mx-auto max-w-[1680px] px-4 pb-8 pt-20 sm:px-6 lg:px-8">
        {view === 'detail' && selectedAnimal ? (
          <AnimalDetail animal={selectedAnimal} onBack={goHome} />
        ) : (
          <Home
            speciesFilter={speciesFilter}
            onSpeciesFilterChange={setSpeciesFilter}
            onAnimalSelect={(animal) => {
              setSelectedAnimal(animal)
              setView('detail')
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
