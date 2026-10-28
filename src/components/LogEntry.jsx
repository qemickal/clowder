import { format } from 'date-fns'
import {
  Activity,
  BriefcaseMedical,
  Edit2,
  Frown,
  HeartPulse,
  Meh,
  NotebookPen,
  Scale,
  Smile,
  Sparkles,
  Trash2,
  Utensils,
} from 'lucide-react'

const typeConfig = {
  health: { label: 'Salud', color: 'text-rose-600', icon: HeartPulse },
  note: { label: 'Nota', color: 'text-brand-700', icon: NotebookPen },
  activity: { label: 'Actividad', color: 'text-emerald-600', icon: Activity },
  vet: { label: 'Veterinario', color: 'text-blue-600', icon: BriefcaseMedical },
  food: { label: 'Alimentación', color: 'text-amber-600', icon: Utensils },
  weight: { label: 'Peso', color: 'text-brand-600', icon: Scale }
}

const moodConfig = {
  happy: { label: 'Feliz', icon: Smile },
  calm: { label: 'Tranquilo', icon: Meh },
  sick: { label: 'Mal', icon: Frown },
  excited: { label: 'Emocionado', icon: Sparkles },
}

export default function LogEntry({ log, onEdit, onDelete }) {
  const config = typeConfig[log.type] || typeConfig.note
  const TypeIcon = config.icon
  const mood = moodConfig[log.mood]
  const MoodIcon = mood?.icon
  const dateStr = log.date ? format(new Date(log.date), 'dd MMM yyyy, HH:mm') : ''

  return (
    <article className="mb-2 rounded-xl border border-slate-200/70 bg-white/60 p-3.5 transition-colors hover:bg-white/80">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={`flex h-8 w-8 items-center justify-center rounded-lg bg-white/80 ${config.color}`}>
            <TypeIcon className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
          </span>
          <span className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${config.color}`}>
            {config.label}
          </span>
        </div>
        <time className="text-[10px] text-slate-400">{dateStr}</time>
      </div>

      <h4 className="text-sm font-semibold text-slate-900">{log.title}</h4>
      {log.description && <p className="mt-1 text-xs leading-relaxed text-slate-600">{log.description}</p>}

      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          {mood && MoodIcon && (
            <>
              <MoodIcon className="h-3.5 w-3.5 text-slate-400" strokeWidth={1.6} aria-hidden="true" />
              <span>{mood.label}</span>
            </>
          )}
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => onEdit?.(log)}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-brand-600"
            title="Editar"
            aria-label={`Editar registro: ${log.title}`}
          >
            <Edit2 className="h-3.5 w-3.5" strokeWidth={1.7} />
          </button>
          <button
            type="button"
            onClick={() => onDelete?.(log.id)}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
            title="Eliminar"
            aria-label={`Eliminar registro: ${log.title}`}
          >
            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.7} />
          </button>
        </div>
      </div>
    </article>
  )
}
