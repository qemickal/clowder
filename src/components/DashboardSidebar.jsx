import { useState } from 'react'
import {
  BarChart3,
  CalendarDays,
  ChevronRight,
  Heart,
  ShieldCheck,
  Stethoscope,
  Syringe,
} from 'lucide-react'

const reminderStyles = {
  deworming: { icon: Syringe, color: 'text-emerald-700', background: 'bg-emerald-50' },
  vaccination: { icon: ShieldCheck, color: 'text-sky-700', background: 'bg-sky-50' },
  vet: { icon: Stethoscope, color: 'text-brand-700', background: 'bg-brand-50' },
}

const tips = [
  'La frecuencia de desparasitación depende de cada animal. Confirma el calendario adecuado con su veterinario.',
  'Anotar el peso de vez en cuando ayuda a tener su evolución a la mano.',
  'Guardar las fechas de vacunas y consultas facilita encontrar su historial cuando lo necesitas.',
]

function ReportProgress({ label, value, total, color }) {
  const percentage = total ? Math.round((value / total) * 100) : 0

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[11px]">
        <span className="text-slate-500">{label}</span>
        <span className="font-semibold text-slate-700">{value}/{total}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}

export default function DashboardSidebar({ animals, reminders, catsCount, dogsCount, onAnimalSelect }) {
  const [showAllReminders, setShowAllReminders] = useState(false)
  const [showReportDetails, setShowReportDetails] = useState(false)
  const [tipIndex, setTipIndex] = useState(0)

  const total = animals.length
  const catPercentage = total ? (catsCount / total) * 100 : 0
  const dogPercentage = total ? (dogsCount / total) * 100 : 0
  const chartBackground = total
    ? `conic-gradient(#847368 0 ${catPercentage}%, #9aafbf ${catPercentage}% ${catPercentage + dogPercentage}%, #e5e7eb ${catPercentage + dogPercentage}% 100%)`
    : 'conic-gradient(#e5e7eb 0 100%)'

  const vaccinatedCount = animals.filter((animal) => animal.health?.vaccinated).length
  const dewormedCount = animals.filter((animal) => animal.health?.dewormed).length
  const withoutLogsCount = animals.filter((animal) => !animal.logs?.length).length
  const visibleReminders = showAllReminders ? reminders : reminders.slice(0, 3)

  return (
    <aside className="space-y-3">
      <section id="reminders" className="glass-card scroll-mt-24 p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-700">Organización</p>
            <h2 className="mt-0.5 text-sm font-semibold text-slate-900">Próximos recordatorios</h2>
          </div>
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>

        {visibleReminders.length ? (
          <div className="space-y-2">
            {visibleReminders.map((reminder) => {
              const style = reminderStyles[reminder.type] || reminderStyles.vet
              const ReminderIcon = style.icon
              const day = reminder.date
                ? new Intl.DateTimeFormat('es-MX', { day: '2-digit' }).format(reminder.date)
                : null
              const month = reminder.date
                ? new Intl.DateTimeFormat('es-MX', { month: 'short' }).format(reminder.date).replace('.', '').toUpperCase()
                : null
              const overdue = reminder.date && reminder.date < new Date()

              return (
                <button
                  type="button"
                  key={reminder.id}
                  onClick={() => onAnimalSelect(reminder.animal)}
                  className="flex w-full items-center gap-2.5 rounded-xl border border-slate-100/80 bg-white/65 p-2.5 text-left transition-colors hover:bg-white"
                  aria-label={`${reminder.title}, ${reminder.animal.name}. Ver perfil`}
                >
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${style.background} ${style.color}`}>
                    <ReminderIcon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-semibold text-slate-800">{reminder.title}</span>
                    <span className="mt-0.5 block truncate text-[10px] text-slate-500">{reminder.animal.name}</span>
                  </span>
                  {reminder.date ? (
                    <span className="flex min-w-9 flex-col items-center leading-tight">
                      <span className="text-sm font-semibold text-slate-800">{day}</span>
                      <span className={`text-[9px] font-semibold tracking-wide ${overdue ? 'text-red-600' : 'text-slate-400'}`}>
                        {overdue ? 'VENCIDA' : month}
                      </span>
                    </span>
                  ) : (
                    <span className="text-[9px] font-semibold uppercase tracking-wide text-amber-700">Pendiente</span>
                  )}
                </button>
              )
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white/45 px-3 py-5 text-center">
            <ShieldCheck className="mx-auto mb-2 h-5 w-5 text-emerald-600" aria-hidden="true" />
            <p className="text-xs font-medium text-slate-600">Todo al día por ahora</p>
            <p className="mt-1 text-[10px] text-slate-400">Las próximas visitas aparecerán aquí.</p>
          </div>
        )}

        {reminders.length > 3 && (
          <button
            type="button"
            onClick={() => setShowAllReminders((show) => !show)}
            className="mt-3 flex w-full items-center justify-between px-1 py-1 text-xs font-medium text-brand-700 hover:text-brand-900"
          >
            {showAllReminders ? 'Mostrar menos' : 'Ver todos los recordatorios'}
            <ChevronRight className={`h-4 w-4 transition-transform ${showAllReminders ? 'rotate-90' : ''}`} />
          </button>
        )}
      </section>

      <section id="quick-summary" className="glass-card scroll-mt-24 p-4 sm:p-5">
        <div className="mb-3 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-brand-700" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-slate-900">Resumen rápido</h2>
        </div>

        <div className="flex items-center justify-center gap-5 py-1 sm:justify-start sm:gap-4">
          <div
            className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full"
            style={{ background: chartBackground }}
            role="img"
            aria-label={`${total} animales en total: ${catsCount} gatos y ${dogsCount} perros`}
          >
            <div className="flex h-[4.6rem] w-[4.6rem] flex-col items-center justify-center rounded-full bg-white/95 shadow-inner">
              <span className="text-xl font-semibold leading-none text-slate-900">{total}</span>
              <span className="mt-1 text-[9px] font-medium uppercase tracking-wide text-slate-400">Totales</span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand-500" aria-hidden="true" />
              <span className="text-slate-600">{catsCount} {catsCount === 1 ? 'gato' : 'gatos'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-sky-400" aria-hidden="true" />
              <span className="text-slate-600">{dogsCount} {dogsCount === 1 ? 'perro' : 'perros'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-slate-300" aria-hidden="true" />
              <span className="text-slate-600">{withoutLogsCount} sin bitácora</span>
            </div>
          </div>
        </div>

        {showReportDetails && (
          <div className="mt-4 space-y-3 border-t border-slate-100 pt-3">
            <ReportProgress label="Vacunas al día" value={vaccinatedCount} total={total} color="bg-brand-500" />
            <ReportProgress label="Desparasitación al día" value={dewormedCount} total={total} color="bg-emerald-500" />
            <ReportProgress label="Con bitácora" value={total - withoutLogsCount} total={total} color="bg-sky-400" />
          </div>
        )}

        <button
          type="button"
          onClick={() => setShowReportDetails((show) => !show)}
          className="mt-3 flex w-full items-center justify-center gap-1 rounded-xl border border-slate-200/70 bg-white/60 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-white hover:text-brand-700"
        >
          {showReportDetails ? 'Ocultar reporte' : 'Ver reportes'}
          <ChevronRight className={`h-3.5 w-3.5 transition-transform ${showReportDetails ? 'rotate-90' : ''}`} />
        </button>
      </section>

      <section className="glass-panel p-4 sm:p-5">
        <div className="mb-2 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-100/80 text-brand-700">
            <Heart className="h-4 w-4" aria-hidden="true" />
          </span>
          <h2 className="text-sm font-semibold text-slate-900">Consejo del día</h2>
        </div>
        <p className="text-xs leading-relaxed text-slate-600">{tips[tipIndex]}</p>
        <button
          type="button"
          onClick={() => setTipIndex((index) => (index + 1) % tips.length)}
          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:text-brand-900"
        >
          Ver otro consejo <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </section>
    </aside>
  )
}
