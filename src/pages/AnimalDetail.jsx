import { useState } from 'react'
import { useAnimals } from '../context/AnimalContext'
import {
  ArrowLeft,
  Plus,
  Trash2,
  ClipboardList,
  HeartPulse,
  PawPrint,
  Info,
  Cat,
  Dog,
  UserRound,
} from 'lucide-react'
import HealthSummary from '../components/HealthSummary'
import LogEntry from '../components/LogEntry'

export default function AnimalDetail({ animal, onBack }) {
  const { animals, saveAnimal, addLog, deleteAnimal, addWeightRecord } = useAnimals()
  const currentAnimal = animals.find((item) => item.id === animal.id) || animal
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
  }

  const handleDeleteAnimal = async () => {
    if (confirm(`¿Estás seguro de que quieres eliminar a ${currentAnimal.name}?`)) {
      await deleteAnimal(currentAnimal.id)
      onBack()
    }
  }

  const speciesLabel = currentAnimal.species === 'cat' ? 'Gato' : 'Perro'
  const SpeciesIcon = currentAnimal.species === 'cat' ? Cat : Dog
  const latestWeight = currentAnimal.health?.weightHistory?.[0]

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{currentAnimal.name}</h1>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <PawPrint className="h-20 w-20 text-brand-600" strokeWidth={1.1} />
            </div>
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="flex-shrink-0">
                {currentAnimal.photo ? (
                  <img
                    src={currentAnimal.photo}
                    alt={currentAnimal.name}
                    className="h-32 w-32 rounded-2xl border border-white/80 object-cover shadow-card sm:h-36 sm:w-36"
                  />
                ) : (
                  <div className="flex h-32 w-32 items-center justify-center rounded-2xl border border-white/80 bg-gradient-to-br from-brand-100/80 via-white/70 to-brand-200/80 sm:h-36 sm:w-36">
                    <SpeciesIcon className="h-14 w-14 text-brand-300" strokeWidth={1.35} aria-hidden="true" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-100 bg-brand-50/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-brand-700">
                    <SpeciesIcon className="h-3.5 w-3.5" strokeWidth={1.6} aria-hidden="true" /> {speciesLabel}
                  </span>
                  {currentAnimal.gender && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                      <UserRound className="h-3.5 w-3.5" strokeWidth={1.6} aria-hidden="true" />
                      {currentAnimal.gender === 'female' ? 'Hembra' : 'Macho'}
                    </span>
                  )}
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

          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-4">
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
            <div className="glass-card p-4 mt-4 animate-in zoom-in duration-200">
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

        <div className="lg:col-span-1 space-y-4">
          <HealthSummary health={currentAnimal.health || {}} />

          <div className="glass-card p-4">
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
                type="button"
                onClick={async () => {
                  const input = window.prompt('Ingrese el peso actual (kg):')
                  if (input === null || input.trim() === '') return
                  const weight = Number.parseFloat(input)
                  if (Number.isFinite(weight) && weight > 0) {
                    await addWeightRecord(currentAnimal.id, weight)
                  } else {
                    window.alert('Ingresa un peso válido mayor que cero.')
                  }
                }}
                className="w-full btn-brand text-sm py-2"
              >
                + Agregar peso
              </button>
            </div>
          </div>

          <div className="glass-card p-4">
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
