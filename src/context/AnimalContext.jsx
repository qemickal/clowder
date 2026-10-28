import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { openDB } from 'idb'
import { format, subDays } from 'date-fns'

const DB_NAME = 'clowder-db'
const DB_VERSION = 1

const AnimalContext = createContext(null)

export function AnimalProvider({ children }) {
  const [animals, setAnimals] = useState([])
  const [loading, setLoading] = useState(true)
  const [db, setDb] = useState(null)

  useEffect(() => {
    const initDB = async () => {
      const database = await openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
          const store = db.createObjectStore('animals', { keyPath: 'id', autoIncrement: true })
          store.createIndex('species', 'species', { unique: false })
          store.createIndex('name', 'name', { unique: false })
        },
      })
      setDb(database)
      await loadAnimals()
      setLoading(false)
    }
    initDB()
  }, [])

  const loadAnimals = useCallback(async () => {
    if (!db) return
    const all = await db.getAll('animals')
    setAnimals(all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
  }, [db])

  const saveAnimal = useCallback(async (animalData) => {
    if (!db) return
    const now = new Date().toISOString()
    const animal = {
      ...animalData,
      createdAt: animalData.id ? animalData.createdAt : now,
      updatedAt: now,
      logs: animalData.logs || [],
      health: animalData.health || {
        vaccinated: false,
        dewormed: false,
        sterilized: false,
        chronicConditions: [],
        currentMedications: [],
        weightHistory: [],
        lastVetVisit: null,
        nextVetVisit: null,
      },
      preferences: animalData.preferences || {
        foods: [],
        toys: [],
        activities: [],
        fears: [],
      },
    }

    if (animal.id) {
      await db.put('animals', animal)
    } else {
      await db.add('animals', animal)
    }
    await loadAnimals()
    return animal
  }, [db, loadAnimals])

  const deleteAnimal = useCallback(async (id) => {
    if (!db) return
    await db.delete('animals', id)
    await loadAnimals()
  }, [db, loadAnimals])

  const addLog = useCallback(async (animalId, logEntry) => {
    if (!db) return
    const animal = await db.get('animals', animalId)
    if (!animal) return

    const newLog = {
      id: crypto.randomUUID(),
      ...logEntry,
      date: logEntry.date || new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }

    const updatedLogs = [newLog, ...(animal.logs || [])].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    )

    await db.put('animals', { ...animal, logs: updatedLogs, updatedAt: new Date().toISOString() })
    await loadAnimals()
  }, [db, loadAnimals])

  const updateHealth = useCallback(async (animalId, healthData) => {
    if (!db) return
    const animal = await db.get('animals', animalId)
    if (!animal) return

    await db.put('animals', {
      ...animal,
      health: { ...animal.health, ...healthData },
      updatedAt: new Date().toISOString(),
    })
    await loadAnimals()
  }, [db, loadAnimals])

  const addWeightRecord = useCallback(async (animalId, weight, date) => {
    if (!db) return
    const animal = await db.get('animals', animalId)
    if (!animal) return

    const record = {
      id: crypto.randomUUID(),
      weight,
      date: date || new Date().toISOString(),
    }

    const history = [...(animal.health.weightHistory || []), record].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    )

    await db.put('animals', {
      ...animal,
      health: { ...animal.health, weightHistory: history },
      updatedAt: new Date().toISOString(),
    })
    await loadAnimals()
  }, [db, loadAnimals])

  const getAnimal = useCallback(async (id) => {
    if (!db) return null
    return await db.get('animals', id)
  }, [db])

  const seedData = useCallback(async () => {
    if (!db) return
    const count = await db.count('animals')
    if (count > 0) return

    const now = new Date()
    const defaultAnimals = [
      {
        name: 'Luna',
        species: 'cat',
        breed: 'Siamesa',
        age: 3,
        gender: 'female',
        color: 'Crema con puntos oscuros',
        weight: 4.2,
        photo: null,
        microchip: 'MC-001234',
        rescuedAt: subDays(now, 365).toISOString(),
        description: 'Muy cariñosa, le encanta el sol de la tarde.',
        health: {
          vaccinated: true,
          dewormed: true,
          sterilized: true,
          chronicConditions: [],
          currentMedications: [],
          weightHistory: [
            { id: crypto.randomUUID(), weight: 3.8, date: subDays(now, 180).toISOString() },
            { id: crypto.randomUUID(), weight: 4.2, date: now.toISOString() },
          ],
          lastVetVisit: subDays(now, 60).toISOString(),
          nextVetVisit: subDays(now, -30).toISOString(),
        },
        preferences: {
          foods: ['Pollo', 'Salmón'],
          toys: ['Plumero', 'Pelota de lana'],
          activities: ['Dormir al sol', 'Rascar rascador'],
          fears: ['Aspiradora', 'Truenos'],
        },
        logs: [
          {
            id: crypto.randomUUID(),
            type: 'health',
            title: 'Primera revisión veterinaria',
            description: 'Vacunación completa y desparasitación interna.',
            date: subDays(now, 300).toISOString(),
            createdAt: subDays(now, 300).toISOString(),
          },
          {
            id: crypto.randomUUID(),
            type: 'note',
            title: 'Descubierta escondida bajo el sofá',
            description: 'Parece que le gustan los espacios osquitos y tranquilos.',
            date: subDays(now, 200).toISOString(),
            createdAt: subDays(now, 200).toISOString(),
          },
        ],
      },
      {
        name: 'Max',
        species: 'dog',
        breed: 'Labrador Retriever',
        age: 5,
        gender: 'male',
        color: 'Negro',
        weight: 28.5,
        photo: null,
        microchip: 'MC-005678',
        rescuedAt: subDays(now, 730).toISOString(),
        description: 'Muy juguetón, ama el agua y las caminatas largas.',
        health: {
          vaccinated: true,
          dewormed: false,
          sterilized: false,
          chronicConditions: ['Artritis leve'],
          currentMedications: ['Glucosamina 1x al día'],
          weightHistory: [
            { id: crypto.randomUUID(), weight: 27.0, date: subDays(now, 200).toISOString() },
            { id: crypto.randomUUID(), weight: 28.5, date: now.toISOString() },
          ],
          lastVetVisit: subDays(now, 90).toISOString(),
          nextVetVisit: subDays(now, -90).toISOString(),
        },
        preferences: {
          foods: ['Carne de res', 'Zanahorias'],
          toys: ['Pelota de tenis', 'Hueso de goma'],
          activities: ['Caminar', 'Nadar', 'Buscar la pelota'],
          fears: ['Fuegos artificiales'],
        },
        logs: [
          {
            id: crypto.randomUUID(),
            type: 'health',
            title: 'Control anual',
            description: 'Revisión de articulaciones y vacuna de rabia.',
            date: subDays(now, 90).toISOString(),
            createdAt: subDays(now, 90).toISOString(),
          },
          {
            id: crypto.randomUUID(),
            type: 'activity',
            title: 'Primera vez en la playa',
            description: 'Disfrutó muchísimo mojando las patas.',
            date: subDays(now, 45).toISOString(),
            createdAt: subDays(now, 45).toISOString(),
          },
        ],
      },
    ]

    for (const animal of defaultAnimals) {
      await db.add('animals', animal)
    }
    await loadAnimals()
  }, [db, loadAnimals])

  useEffect(() => {
    seedData()
  }, [seedData, db])

  const value = {
    animals,
    loading,
    saveAnimal,
    deleteAnimal,
    addLog,
    updateHealth,
    addWeightRecord,
    getAnimal,
  }

  return <AnimalContext.Provider value={value}>{children}</AnimalContext.Provider>
}

export function useAnimals() {
  return useContext(AnimalContext)
}
