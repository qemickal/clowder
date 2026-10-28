import { useState, useEffect } from 'react'
import { useAnimals } from '../context/AnimalContext'
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Menu,
  X,
  ClipboardList,
  HeartPulse,
  PawPrint,
  Info,
} from 'lucide-react'
import HealthSummary from '../components/HealthSummary'
import LogEntry from '../components/LogEntry'

export default function AnimalDetail({ animal, onBack }) {
  const { saveAnimal, addLog, deleteAnimal, addWeightRecord } = useAnimals()
  const [currentAnimal, setCurrentAnimal] = useState(animal)
  const [showLogForm, setShowLogForm] = useState(false)

  const [newLog, setNewLog] = useState({
    type: 'note',
    title: '',
    description: '',
    date: new Date().toISOString().slice(0, 16),
    mood: 'calm',
  })

  const handleSaveLog = async (e) => {
    e.preventDefault()
    await addLog(currentAnimal.id, newLog)
    setShowLogForm(false)
    setNewLog({
      type: 'note',
      title: '',
      description: '',
      date: new Date().toISOString().slice(0, 16),
      mood: 'calm',
    })
  }

  const handleDeleteLog = async (id) => {
    const updatedLogs = (currentAnimal.logs || []).filter((l) => l.id !== id)
    await saveAnimal({ ...currentAnimal, logs: updatedLogs })
    setCurrentAnimal((prev) => ({ ...prev, logs: updatedLogs }))
  }

  const handleDeleteAnimal = async () => {
    if (confirm(`¿Estás seguro de que quieres eliminar a ${currentAnimal.name}?`)) {
      await deleteAnimal(currentAnimal.id)
      onBack()
    }
  }

  const speciesLabel = currentAnimal.species === 'cat' ? 'Gato' : 'Perro'
  const latestWeight = currentAnimal.health.weightHistory?.[0]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{currentAnimal.name}</h1>
          <p className="text-slate-500">
            {speciesLabel} • {currentAnimal.breed || 'Raza no definida'} • {currentAnimal.age} año{currentAnimal.age !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onBack}
            className="btn-outline flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Volver
          </button>
          <button
            onClick={() => setShowLogForm(true)}
            className="btn-brand flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Nuevo registro
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <PawPrint className="w-24 h-24 text-brand-600" />
            </div>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-shrink-0">
                {currentAnimal.photo ? (
                  <img
                    src={currentAnimal.photo}
                    alt={currentAnimal.name}
                    className="w-40 h-40 rounded-2xl object-cover shadow-card border-4 border-brand-100"
                  />
                ) : (
                  <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center border-4 border-brand-100">
                    <Paw className="w-16 h-16 text-brand-400" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {currentAnimal.species === 'cat' ? '🐱 Gato' : '🐶 Perro'}
                  </span>
                  {currentAnimal.gender && (
                    <span className="w-2 h-2 rounded-full bg-brand-500"></span>
                  )}
                  <span className="text-sm text-slate-600 capitalize">{currentAnimal.gender}</span>
                </div>
                <div className="space-y-1 text-sm text-slate-600">
                  <p><span className="font-semibold text-slate-900">Color:</span> {currentAnimal.color || 'No especificado'}</p>
                  <p><span className="font-semibold text-slate-900">Microchip:</span> {currentAnimal.microchip || 'No registrado'}</p>
                  <p><span className="font-semibold text-slate-900">Peso actual:</span> {latestWeight ? latestWeight.weight : currentAnimal.weight} kg</p>
                  {currentAnimal.rescuedAt && (
                    <p><span className="font-semibold text-slate-900">Rescatado/llegó:</span> {new Date(currentAnimal.rescuedAt).toLocaleDateString('es-ES')}</p>
                  )}
                </div>
                {currentAnimal.description && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-sm text-slate-700">{currentAnimal.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Info className="w-4 h-4 text-brand-600" /> Bitácora cronológica
              </h3>
              <button
                onClick={() => setShowLogForm(true)}
                className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Agregar evento
              </button>
            </div>

            {currentAnimal.logs?.length > 0 ? (
              <div className="space-y-0">
                {currentAnimal.logs.map((log) => (
                  <LogEntry
                    key={log.id}
                    log={log}
                    onEdit={() => {}}
                    onDelete={handleDeleteLog}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <ClipboardList className="w-6 h-6" />
                </div>
                <p className="text-sm text-slate-500">Aún no hay registros. Agrega el primer evento de bienestar.</p>
              </div>
            )}
          </div>

          {showLogForm && (
            <div className="glass-card p-6 mt-6 animate-in zoom-in duration-200">
              <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-brand-600" /> Nuevo registro
              </h3>
              <form onSubmit={handleSaveLog} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label-field">Tipo de evento</label>
                    <select
                      className="input-field"
                      name="type"
                      value={newLog.type}
                      onChange={(e) => setNewLog({ ...newLog, type: e.target.value })}
                    >
                      <option value="note">Nota</option>
                      <option value="health">Salud</option>
                      <option value="vet">Veterinario</option>
                      <option value="activity">Actividad</option>
                      <option value="food">Alimentación</option>
                      <option value="weight">Peso</option>
                    </select>
                  </div>
                  <div>
                    <label className="label-field">Estado de ánimo</label>
                    <select
                      className="input-field"
                      name="mood"
                      value={newLog.mood}
                      onChange={(e) => setNewLog({ ...newLog, mood: e.target.value })}
                    >
                      <option value="calm">Tranquilo</option>
                      <option value="happy">Feliz</option>
                      <option value="sick">Enfermo / mal</option>
                      <option value="excited">Emocionado</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="label-field">Título</label>
                  <input
                    className="input-field"
                    name="title"
                    value={newLog.title}
                    onChange={(e) => setNewLog({ ...newLog, title: e.target.value })}
                    placeholder="Ej. Visita al veterinario"
                    required
                  />
                </div>
                <div>
                  <label className="label-field">Descripción</label>
                  <textarea
                    className="input-field h-32 resize-none"
                    name="description"
                    value={newLog.description}
                    onChange={(e) => setNewLog({ ...newLog, description: e.target.value })}
                    placeholder="Qué pasó, observaciones importantes..."
                    required
                  />
                </div>
                <div>
                  <label className="label-field">Fecha y hora</label>
                  <input
                    className="input-field"
                    type="datetime-local"
                    name="date"
                    value={newLog.date}
                    onChange={(e) => setNewLog({ ...newLog, date: e.target.value })}
                    required
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowLogForm(false)}
                    className="btn-outline"
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-brand">
                    Guardar registro
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        <div className="lg:col-span-1 space-y-6">
          <HealthSummary health={currentAnimal.health} />

          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-brand-600" /> Peso
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Peso actual</span>
                <span className="text-lg font-bold text-slate-900">
                  {latestWeight ? latestWeight.weight : currentAnimal.weight} kg
                </span>
              </div>
              <button
                onClick={() => {
                  const weight = prompt('Ingrese el peso actual (kg):')
                  if (weight) {
                    addWeightRecord(currentAnimal.id, parseFloat(weight))
                    const updatedAnimal = { ...currentAnimal }
                    updatedAnimal.health.weightHistory = [
                      ...(updatedAnimal.health.weightHistory || []),
                      { id: crypto.randomUUID(), weight: parseFloat(weight), date: new Date().toISOString() },
                    ]
                    setCurrentAnimal(updatedAnimal)
                  }
                }}
                className="w-full btn-brand text-sm py-2"
              >
                + Agregar peso
              </button>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <PawPrint className="w-4 h-4 text-brand-600" /> Acciones
            </h3>
            <div className="space-y-2">
              <button
                onClick={handleDeleteAnimal}
                className="w-full text-left py-2 px-3 rounded-xl text-sm text-red-600 font-medium hover:bg-red-50 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Eliminar animal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
