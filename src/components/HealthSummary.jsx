import {
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Clock,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react'

export default function HealthSummary({ health = {} }) {
  const indicators = [
    { label: 'Vacunas', value: health.vaccinated ? 'Al día' : 'Pendiente', active: health.vaccinated },
    { label: 'Desparasitación', value: health.dewormed ? 'Al día' : 'Pendiente', active: health.dewormed },
    { label: 'Esterilización', value: health.sterilized ? 'Sí' : 'No', active: health.sterilized },
  ]

  return (
    <section className="glass-card p-4">
      <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
        <ShieldCheck className="h-4 w-4 text-brand-600" aria-hidden="true" /> Estado de salud
      </h2>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
        {indicators.map((indicator) => (
          <div key={indicator.label} className="rounded-xl border border-slate-100/80 bg-white/55 px-3 py-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{indicator.label}</span>
              <span className={`h-1.5 w-1.5 rounded-full ${indicator.active ? 'bg-emerald-500' : 'bg-amber-400'}`} aria-hidden="true" />
            </div>
            <p className={`mt-1 text-xs font-semibold ${indicator.active ? 'text-emerald-700' : 'text-amber-700'}`}>
              {indicator.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        {health.chronicConditions?.length > 0 ? (
          <div className="rounded-xl border border-amber-100 bg-amber-50/70 p-3">
            <h3 className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-amber-800">
              <AlertTriangle className="h-4 w-4" aria-hidden="true" /> Condiciones crónicas
            </h3>
            <ul className="list-disc space-y-1 pl-5 text-xs text-amber-800">
              {health.chronicConditions.map((condition, index) => <li key={`${condition}-${index}`}>{condition}</li>)}
            </ul>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50/70 p-3 text-xs text-emerald-700">
            <CheckCircle className="h-4 w-4" aria-hidden="true" /> Sin condiciones crónicas registradas
          </div>
        )}

        {health.currentMedications?.length > 0 && (
          <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-3">
            <h3 className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-blue-800">
              <Stethoscope className="h-4 w-4" aria-hidden="true" /> Medicamentos actuales
            </h3>
            <ul className="list-disc space-y-1 pl-5 text-xs text-blue-700">
              {health.currentMedications.map((medication, index) => <li key={`${medication}-${index}`}>{medication}</li>)}
            </ul>
          </div>
        )}

        {health.weightHistory?.length > 0 && (
          <div className="border-t border-slate-100 pt-3">
            <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-600">
              <BarChart3 className="h-4 w-4 text-brand-600" aria-hidden="true" /> Historial de peso
            </h3>
            <div className="space-y-1.5">
              {health.weightHistory.slice(0, 5).map((record) => (
                <div key={record.id} className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    {new Date(record.date).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
                  </span>
                  <span className="font-semibold text-slate-700">{record.weight} kg</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
          <div className="flex items-start gap-2 rounded-xl bg-white/55 p-2.5">
            <Clock className="mt-0.5 h-4 w-4 text-slate-400" aria-hidden="true" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Última visita</p>
              <p className="mt-0.5 text-xs font-medium text-slate-700">
                {health.lastVetVisit ? new Date(health.lastVetVisit).toLocaleDateString('es-MX') : 'No registrada'}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2 rounded-xl bg-white/55 p-2.5">
            <Clock className="mt-0.5 h-4 w-4 text-slate-400" aria-hidden="true" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Próxima visita</p>
              <p className="mt-0.5 text-xs font-medium text-slate-700">
                {health.nextVetVisit ? new Date(health.nextVetVisit).toLocaleDateString('es-MX') : 'No programada'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
