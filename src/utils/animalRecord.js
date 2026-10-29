const eventLabels = {
  note: 'Nota',
  health: 'Salud',
  vet: 'Veterinario',
  activity: 'Actividad',
  food: 'Alimentación',
  weight: 'Peso',
}

const moodLabels = {
  calm: 'Tranquilo',
  happy: 'Feliz',
  sick: 'Enfermo / mal',
  excited: 'Emocionado',
}

function textOr(value, fallback) {
  if (value === null || value === undefined) return fallback
  const text = String(value).trim()
  return text || fallback
}

function parseDate(value) {
  if (value === null || value === undefined || value === '') return null
  // A date without a time is a local calendar date, not midnight UTC.
  const date = typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T00:00:00`)
    : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatRecordDate(value, { withTime = false, fallback = 'No registrada' } = {}) {
  const date = parseDate(value)
  if (!date) return fallback
  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit', hour12: false } : {}),
  }).format(date)
}

function newestFirst(items) {
  return [...items].sort((first, second) => {
    const firstDate = parseDate(first.date)?.getTime() ?? -Infinity
    const secondDate = parseDate(second.date)?.getTime() ?? -Infinity
    return secondDate - firstDate
  })
}

export function getWeightHistory(health = {}) {
  return newestFirst(Array.isArray(health?.weightHistory) ? health.weightHistory : [])
}

export function formatWeight(value) {
  if (value === null || value === undefined || value === '' || !Number.isFinite(Number(value)) || Number(value) <= 0) {
    return 'No registrado'
  }
  return `${value} kg`
}

function listOrDefault(value, fallback = 'No registrados') {
  if (!Array.isArray(value)) return fallback
  const items = value.map((item) => textOr(item, '')).filter(Boolean)
  return items.length ? items.join(', ') : fallback
}

function status(value, yes, no) {
  if (value === true) return yes
  if (value === false) return no
  return 'No registrado'
}

/** Build one shared, printable snapshot without changing the stored resident. */
export function buildAnimalRecord(animal, generatedAt = new Date()) {
  const health = animal.health || {}
  const preferences = animal.preferences || {}
  const weights = getWeightHistory(health)
  const latestWeight = weights.find((item) => formatWeight(item.weight) !== 'No registrado')
  const currentWeight = formatWeight(latestWeight?.weight ?? animal.weight)
  const logs = newestFirst(Array.isArray(animal.logs) ? animal.logs : [])
  const species = animal.species === 'cat' ? 'Gato' : animal.species === 'dog' ? 'Perro' : 'No registrada'
  const gender = animal.gender === 'female' ? 'Hembra' : animal.gender === 'male' ? 'Macho' : 'No registrado'
  const age = animal.age === '' || animal.age === null || animal.age === undefined
    ? 'No registrada'
    : `${animal.age} año${Number(animal.age) === 1 ? '' : 's'}`

  return {
    name: textOr(animal.name, 'Sin nombre'),
    species,
    breed: textOr(animal.breed, 'Raza no definida'),
    photo: animal.photo || null,
    currentWeight,
    generatedAt: formatRecordDate(generatedAt),
    identification: [
      { label: 'Nombre', value: textOr(animal.name, 'Sin nombre') },
      { label: 'Especie', value: species },
      { label: 'Raza / tipo', value: textOr(animal.breed, 'No registrada') },
      { label: 'Edad', value: age },
      { label: 'Sexo', value: gender },
      { label: 'Color / pelaje', value: textOr(animal.color, 'No registrado') },
      { label: 'Microchip', value: textOr(animal.microchip, 'No registrado') },
      { label: 'Peso actual', value: currentWeight },
      { label: 'Fecha de rescate / llegada', value: formatRecordDate(animal.rescuedAt) },
    ],
    description: textOr(animal.description, 'Sin descripción registrada.'),
    health: [
      { label: 'Vacunas', value: status(health.vaccinated, 'Al día', 'Pendiente') },
      { label: 'Desparasitación', value: status(health.dewormed, 'Al día', 'Pendiente') },
      { label: 'Esterilización', value: status(health.sterilized, 'Sí', 'No') },
      { label: 'Última visita veterinaria', value: formatRecordDate(health.lastVetVisit) },
      { label: 'Próxima visita veterinaria', value: formatRecordDate(health.nextVetVisit, { fallback: 'No programada' }) },
    ],
    care: [
      { label: 'Condiciones crónicas', value: listOrDefault(health.chronicConditions, 'No registradas') },
      { label: 'Medicamentos actuales', value: listOrDefault(health.currentMedications) },
    ],
    preferences: [
      { label: 'Comidas favoritas', value: listOrDefault(preferences.foods, 'No registradas') },
      { label: 'Juguetes favoritos', value: listOrDefault(preferences.toys) },
      { label: 'Actividades favoritas', value: listOrDefault(preferences.activities, 'No registradas') },
      { label: 'Miedos o disgustos', value: listOrDefault(preferences.fears) },
    ],
    weights: weights.map((item) => ({
      date: formatRecordDate(item.date),
      weight: formatWeight(item.weight),
    })),
    logs: logs.map((log) => ({
      type: eventLabels[log.type] || 'Registro',
      title: textOr(log.title, 'Sin título'),
      description: textOr(log.description, ''),
      date: formatRecordDate(log.date, { withTime: true, fallback: 'Fecha no registrada' }),
      mood: moodLabels[log.mood] || '',
    })),
  }
}

export function recordFileName(name) {
  const slug = textOr(name, 'residente')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/, '')
    .toLowerCase()
  return `ficha-${slug || 'residente'}.pdf`
}
