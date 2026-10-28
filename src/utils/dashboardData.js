function parseDate(value) {
  if (!value) return null
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export function getDashboardReminders(animals) {
  const reminders = []

  animals.forEach((animal) => {
    const health = animal.health || {}

    if (health.dewormed === false) {
      reminders.push({
        id: `${animal.id}-deworming`,
        animal,
        date: null,
        type: 'deworming',
        title: 'Desparasitación pendiente',
        detail: 'Confirma la fecha con su veterinario',
      })
    }

    if (health.vaccinated === false) {
      reminders.push({
        id: `${animal.id}-vaccination`,
        animal,
        date: null,
        type: 'vaccination',
        title: 'Vacunas pendientes',
        detail: 'Revisa su cartilla de vacunación',
      })
    }

    const nextVetVisit = parseDate(health.nextVetVisit)
    if (nextVetVisit) {
      reminders.push({
        id: `${animal.id}-vet`,
        animal,
        date: nextVetVisit,
        type: 'vet',
        title: nextVetVisit < new Date() ? 'Consulta veterinaria vencida' : 'Revisión general',
        detail: 'Visita veterinaria',
      })
    }
  })

  return reminders.sort((first, second) => {
    if (!first.date) return second.date ? -1 : first.title.localeCompare(second.title, 'es')
    if (!second.date) return 1
    return first.date.getTime() - second.date.getTime()
  })
}

export function countEventsToday(animals, now = new Date()) {
  return animals.reduce((count, animal) => {
    const todayCount = (animal.logs || []).filter((log) => {
      const date = parseDate(log.date)
      return date
        && date.getFullYear() === now.getFullYear()
        && date.getMonth() === now.getMonth()
        && date.getDate() === now.getDate()
    }).length

    return count + todayCount
  }, 0)
}
