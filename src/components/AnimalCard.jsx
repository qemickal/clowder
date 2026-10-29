import { Activity, ArrowUpRight, Cat, Dog, Scale } from 'lucide-react'
import { formatWeight, getWeightHistory } from '../utils/animalRecord'

export default function AnimalCard({ animal, onSelect, viewMode = 'grid' }) {
  const listView = viewMode === 'list'
  const speciesLabel = animal.species === 'cat' ? 'Gato' : 'Perro'
  const SpeciesIcon = animal.species === 'cat' ? Cat : Dog
  const latestLog = animal.logs?.[0]
  const health = animal.health || {}
  const latestWeight = getWeightHistory(health).find((record) => formatWeight(record.weight) !== 'No registrado')

  const statusBadges = []
  if (health.vaccinated) statusBadges.push({ label: 'Vacunas al día', className: 'badge-success' })
  if (health.sterilized) statusBadges.push({ label: 'Esterilizado', className: 'badge-info' })
  if (!health.dewormed) statusBadges.push({ label: 'Desparasitación pendiente', className: 'badge-warning' })

  return (
    <button
      type="button"
      aria-label={`Ver detalles de ${animal.name}`}
      className={`glass-card group w-full cursor-pointer text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${listView ? 'sm:flex sm:items-center' : ''}`}
      onClick={() => onSelect(animal)}
    >
      <div className={`relative h-36 overflow-hidden ${listView ? 'sm:h-32 sm:w-32 sm:shrink-0' : ''}`}>
        {animal.photo ? (
          <img
            src={animal.photo}
            alt={animal.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-100/80 via-white/60 to-brand-200/80">
            <SpeciesIcon className="h-14 w-14 text-brand-300" strokeWidth={1.35} aria-hidden="true" />
          </div>
        )}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-slate-600 shadow-sm backdrop-blur-md">
          <SpeciesIcon className="h-3.5 w-3.5 text-brand-600" strokeWidth={1.7} aria-hidden="true" />
          {speciesLabel}
        </span>
        <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/70 bg-white/80 text-slate-500 shadow-sm backdrop-blur-md transition-colors group-hover:text-brand-700">
          <ArrowUpRight className="h-4 w-4" strokeWidth={1.7} aria-hidden="true" />
        </span>
      </div>

      <div className={`min-w-0 space-y-3 p-4 ${listView ? 'flex-1' : ''}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-slate-900">{animal.name}</h3>
            <p className="mt-0.5 truncate text-xs text-slate-500">
              {animal.breed || 'Raza no definida'} <span aria-hidden="true">·</span> {animal.age} año{animal.age !== 1 ? 's' : ''}
            </p>
          </div>
          {animal.gender && (
            <span className="shrink-0 rounded-full bg-slate-100/80 px-2 py-1 text-[10px] font-medium text-slate-500">
              {animal.gender === 'female' ? 'Hembra' : 'Macho'}
            </span>
          )}
        </div>

        {statusBadges.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {statusBadges.slice(0, 2).map((badge) => (
              <span key={badge.label} className={badge.className}>{badge.label}</span>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 border-t border-slate-100/80 pt-3">
          <div className="flex min-w-0 items-center gap-2">
            <Scale className="h-4 w-4 shrink-0 text-slate-400" strokeWidth={1.7} aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Peso</p>
              <p className="truncate text-xs font-semibold text-slate-700">{formatWeight(latestWeight?.weight ?? animal.weight)}</p>
            </div>
          </div>
          <div className="flex min-w-0 items-center gap-2">
            <Activity className="h-4 w-4 shrink-0 text-slate-400" strokeWidth={1.7} aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Último registro</p>
              <p className="truncate text-xs font-semibold text-slate-700">{latestLog?.title || 'Sin registros'}</p>
            </div>
          </div>
        </div>
      </div>
    </button>
  )
}
