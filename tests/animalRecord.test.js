import test from 'node:test'
import assert from 'node:assert/strict'
import {
  buildAnimalRecord,
  formatRecordDate,
  formatWeight,
  getWeightHistory,
  recordFileName,
} from '../src/utils/animalRecord.js'

const value = (fields, label) => fields.find((field) => field.label === label)?.value

test('la ficha reúne datos actuales, salud, preferencias y registros ordenados sin modificar el animal', () => {
  const animal = {
    name: 'Muñeca Álvarez', species: 'dog', breed: 'Mestiza', age: 1, gender: 'female',
    color: 'Blanca', microchip: 'MX-123', weight: 3.5, rescuedAt: '2024-06-20',
    description: 'Cariñosa y tranquila.',
    health: {
      vaccinated: true, dewormed: false, sterilized: true,
      chronicConditions: ['Alergia'], currentMedications: ['Medicamento'],
      weightHistory: [
        { id: 'old', weight: 3.4, date: '2024-01-01' },
        { id: 'new', weight: 4.8, date: '2025-01-01' },
      ],
      lastVetVisit: '2025-02-10', nextVetVisit: '2025-03-12',
    },
    preferences: { foods: ['Salmón', 'Pollo'], toys: ['Pelota'], activities: ['Pasear'], fears: ['Truenos'] },
    logs: [
      { title: 'Registro anterior', type: 'note', date: '2024-01-01T09:00' },
      { title: 'Revisión médica', description: 'Todo está bien.', type: 'vet', mood: 'happy', date: '2025-01-01T10:00' },
    ],
  }
  const original = structuredClone(animal)
  const record = buildAnimalRecord(animal, new Date('2026-10-29T12:00:00'))

  assert.equal(record.name, 'Muñeca Álvarez')
  assert.equal(record.generatedAt, '29/10/2026')
  assert.equal(value(record.identification, 'Edad'), '1 año')
  assert.equal(value(record.identification, 'Peso actual'), '4.8 kg')
  assert.equal(value(record.identification, 'Fecha de rescate / llegada'), '20/06/2024')
  assert.equal(value(record.health, 'Vacunas'), 'Al día')
  assert.equal(value(record.health, 'Desparasitación'), 'Pendiente')
  assert.equal(value(record.care, 'Condiciones crónicas'), 'Alergia')
  assert.equal(value(record.preferences, 'Comidas favoritas'), 'Salmón, Pollo')
  assert.deepEqual(record.weights.map((item) => item.weight), ['4.8 kg', '3.4 kg'])
  assert.deepEqual(record.logs.map((item) => item.title), ['Revisión médica', 'Registro anterior'])
  assert.equal(record.logs[0].type, 'Veterinario')
  assert.equal(record.logs[0].mood, 'Feliz')
  assert.deepEqual(animal, original)
})

test('los datos opcionales ausentes y las fechas inválidas tienen valores claros', () => {
  const record = buildAnimalRecord({ name: 'Luna', species: 'cat', age: 0, weight: 0 })
  assert.equal(value(record.identification, 'Edad'), '0 años')
  assert.equal(value(record.identification, 'Peso actual'), 'No registrado')
  assert.equal(value(record.health, 'Vacunas'), 'No registrado')
  assert.equal(value(record.health, 'Próxima visita veterinaria'), 'No programada')
  assert.equal(value(record.preferences, 'Juguetes favoritos'), 'No registrados')
  assert.deepEqual(record.weights, [])
  assert.deepEqual(record.logs, [])
  assert.equal(formatRecordDate('no-es-fecha'), 'No registrada')
  assert.equal(formatRecordDate('2024-06-20'), '20/06/2024')
  assert.equal(formatWeight(null), 'No registrado')
  assert.equal(formatWeight(-1), 'No registrado')
  assert.equal(formatWeight('4.2'), '4.2 kg')
})

test('el historial de peso es descendente y no altera los datos originales', () => {
  const health = { weightHistory: [{ date: '2021-01-01', weight: 1 }, { date: '2024-01-01', weight: 2 }] }
  assert.deepEqual(getWeightHistory(health).map((item) => item.weight), [2, 1])
  assert.deepEqual(health.weightHistory.map((item) => item.weight), [1, 2])
  assert.deepEqual(getWeightHistory(), [])
})

test('el nombre del PDF es seguro y legible', () => {
  assert.equal(recordFileName('Muñeca Álvarez'), 'ficha-muneca-alvarez.pdf')
  assert.equal(recordFileName('../ Luna / Max'), 'ficha-luna-max.pdf')
  assert.equal(recordFileName('🐱'), 'ficha-residente.pdf')
})
