import { useState } from 'react'
import { MoreVertical, Heart, AlertCircle, Calendar } from 'lucide-react'

export default function AnimalCard({ animal, onSelect }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const speciesLabel = animal.species === 'cat' ? 'Gato' : 'Perro'
  const speciesIcon = animal.species === 'cat' ? (
    <span className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-sm font-bold">🐱</span>
  ) : (
    <span className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-sm font-bold">🐶</span>
  )

  const latestLog = animal.logs?.[0]
  const latestWeight = animal.health.weightHistory?.[0]

  const statusBadges = []
  if (animal.health.vaccinated) statusBadges.push({ label: 'Vacunado', className: 'badge-success' })
  if (animal.health.sterilized) statusBadges.push({ label: 'Esterilizado', className: 'badge-info' })
  if (!animal.health.dewormed) statusBadges.push({ label: 'Desparasitación pendiente', className: 'badge-warning' })

  return (
    <div
      className="glass-card cursor-pointer group hover:shadow-card-hover transition-all duration-200"
      onClick={() => onSelect(animal)}
    >
      <div className="relative h-48 overflow-hidden">
        {animal.photo ? (
          <img
            src={animal.photo}
            alt={animal.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center">
            {speciesIcon}
          </div>
        )}
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen) }}
            className="p-2 bg-white/90 backdrop-blur rounded-full shadow-card text-slate-600 hover:bg-brand-600 hover:text-white transition-colors"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        {menuOpen && (
          <div className="absolute top-12 right-3 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
            <button
              onClick={() => {}}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-brand-600 transition-colors"
            >
              <Heart className="w-4 h-4" /> Marcar favorito
            </button>
            <button
              onClick={() => {}}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-brand-600 transition-colors"
            >
              <Paw className="w-4 h-4" /> Ver historial
            </button>
            <button
              onClick={() => {}}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <AlertCircle className="w-4 h-4" /> Eliminar
            </button>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {speciesIcon}
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{speciesLabel}</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 leading-tight">{animal.name}</h3>
            <p className="text-sm text-slate-500">
              {animal.breed || 'Raza no definida'} • {animal.age} año{animal.age !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex flex-wrap gap-1">
            {statusBadges.map((badge, i) => (
              <span key={i} className={badge.className}>{badge.label}</span>
            ))}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-xs text-slate-500 uppercase font-semibold">Peso actual</p>
            <p className="text-sm font-bold text-slate-900">
              {latestWeight ? latestWeight.weight : animal.weight} kg
            </p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-xs text-slate-500 uppercase font-semibold">Última actividad</p>
            <p className="text-sm font-bold text-slate-900 truncate">
              {latestLog ? latestLog.title : 'Sin registros'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
