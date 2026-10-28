import {
  ShieldCheck,
  Droplets,
  Stethoscope,
  BarChart3,
  Clock,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react'

export default function HealthSummary({ health }) {
  return (
    <div className="glass-card p-6">
      <h3 className="text-sm font-semibold text-slate-700 mb-6 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-brand-600" /> Estado de salud
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-50 rounded-xl p-4 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 uppercase font-semibold">Vacunas</span>
            <span className={`w-2 h-2 rounded-full ${health.vaccinated ? 'bg-green-500' : 'bg-slate-300'}`}></span>
          </div>
          <span className={health.vaccinated ? 'text-green-700 font-semibold' : 'text-red-600 font-semibold'}>
            {health.vaccinated ? 'Al día' : 'Pendiente'}
          </span>
        </div>
        <div className="bg-slate-50 rounded-xl p-4 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 uppercase font-semibold">Desparasitación</span>
            <span className={`w-2 h-2 rounded-full ${health.dewormed ? 'bg-green-500' : 'bg-slate-300'}`}></span>
          </div>
          <span className={health.dewormed ? 'text-green-700 font-semibold' : 'text-amber-600 font-semibold'}>
            {health.dewormed ? 'Al día' : 'Pendiente'}
          </span>
        </div>
        <div className="bg-slate-50 rounded-xl p-4 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 uppercase font-semibold">Esterilización</span>
            <span className={`w-2 h-2 rounded-full ${health.sterilized ? 'bg-green-500' : 'bg-slate-300'}`}></span>
          </div>
          <span className={health.sterilized ? 'text-green-700 font-semibold' : 'text-blue-600 font-semibold'}>
            {health.sterilized ? 'Sí' : 'No'}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {health.chronicConditions?.length > 0 ? (
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
            <h4 className="text-xs font-semibold text-amber-800 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Condiciones crónicas
            </h4>
            <ul className="text-sm text-amber-700 space-y-1 list-disc pl-4">
              {health.chronicConditions.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="p-4 bg-green-50 rounded-xl border border-green-100">
            <p className="text-sm text-green-700 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Sin condiciones crónicas registradas
            </p>
          </div>
        )}

        {health.currentMedications?.length > 0 ? (
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
            <h4 className="text-xs font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <Stethoscope className="w-4 h-4" /> Medicamentos actuales
            </h4>
            <ul className="text-sm text-blue-700 space-y-1 list-disc pl-4">
              {health.currentMedications.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {health.weightHistory?.length > 0 ? (
          <div className="mt-6">
            <h4 className="text-xs font-semibold text-slate-600 mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-brand-600" /> Historial de peso
            </h4>
            <div className="space-y-2">
              {health.weightHistory.slice(0, 5).map((record) => (
                <div key={record.id} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">{new Date(record.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
                  <span className="font-semibold text-slate-900">{record.weight} kg</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3">
            <Clock className="w-4 h-4 text-slate-500" />
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold">Última visita</p>
              <p className="text-sm font-semibold text-slate-900">
                {health.lastVetVisit ? new Date(health.lastVetVisit).toLocaleDateString('es-ES') : 'No registrada'}
              </p>
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3">
            <Clock className="w-4 h-4 text-slate-500" />
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold">Próxima visita</p>
              <p className="text-sm font-semibold text-slate-900">
                {health.nextVetVisit ? new Date(health.nextVetVisit).toLocaleDateString('es-ES') : 'No programada'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
