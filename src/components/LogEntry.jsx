import { format } from 'date-fns'
import { Pen, PlusCircle, Trash2, Edit2 } from 'lucide-react'

const typeConfig = {
  health: { label: 'Salud', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', icon: '🩺' },
  note: { label: 'Nota', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', icon: '📝' },
  activity: { label: 'Actividad', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100', icon: '🎾' },
  vet: { label: 'Veterinario', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', icon: '👨‍⚕️' },
  food: { label: 'Alimentación', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100', icon: '🍗' },
  weight: { label: 'Peso', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100', icon: '⚖️' },
}

export default function LogEntry({ log, onEdit, onDelete }) {
  const config = typeConfig[log.type] || typeConfig.note
  const dateStr = log.date ? format(new Date(log.date), 'dd MMM yyyy, HH:mm') : ''

  return (
    <div className={`${config.bg} border ${config.border} rounded-xl p-4 mb-3 animate-in fade-in slide-in-from-left-2 duration-300`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold">{config.icon}</span>
          <span className={`text-xs font-semibold uppercase tracking-wider ${config.color}`}>{config.label}</span>
        </div>
        <span className="text-xs text-slate-400">{dateStr}</span>
      </div>

      <h4 className="text-sm font-semibold text-slate-900 mb-1">{log.title}</h4>
      {log.description && (
        <p className="text-sm text-slate-600 mb-3">{log.description}</p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-slate-400">
          {log.mood && (
            <span className="flex items-center gap-1">
              {log.mood === 'happy' ? '😊 Feliz' : log.mood === 'calm' ? '😐 Tranquilo' : log.mood === 'sick' ? '😔 Mal' : log.mood}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit?.(log)}
            className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Editar"
          >
            <Edit2 className="w-3 h-3" />
          </button>
          <button
            onClick={() => onDelete?.(log.id)}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Eliminar"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  )
}
