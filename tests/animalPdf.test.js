import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { buildAnimalRecord } from '../src/utils/animalRecord.js'
import { createAnimalPdf } from '../src/utils/animalPdf.js'

const fontBase64 = readFileSync(new URL('../public/fonts/DejaVuSans.ttf', import.meta.url)).toString('base64')

test('genera un PDF válido con acentos y caracteres españoles', () => {
  const record = buildAnimalRecord({
    name: 'Muñeca Álvarez', species: 'dog', age: 2,
    health: { vaccinated: true, chronicConditions: ['Alergia'], weightHistory: [] },
    logs: [{ title: 'Revisión médica', description: 'Vacunación al día.', type: 'vet', date: '2026-01-10T10:00' }],
  })
  const { doc, unsupportedCharacters } = createAnimalPdf(record, { fontBase64 })
  const bytes = new Uint8Array(doc.output('arraybuffer'))
  assert.equal(Buffer.from(bytes.slice(0, 5)).toString(), '%PDF-')
  assert.ok(doc.getNumberOfPages() >= 1)
  assert.equal(unsupportedCharacters, false)
})

test('pagina fichas largas y avisa de caracteres no admitidos', () => {
  const record = buildAnimalRecord({
    name: 'Luna 🐾', species: 'cat',
    description: 'Observación larga. '.repeat(1200),
    health: { weightHistory: Array.from({ length: 80 }, (_, index) => ({ date: '2025-01-01', weight: index + 1 })) },
    logs: Array.from({ length: 80 }, (_, index) => ({ title: `Registro ${index}`, description: 'Detalle del seguimiento.', date: '2025-01-01' })),
  })
  const { doc, unsupportedCharacters } = createAnimalPdf(record, { fontBase64 })
  assert.ok(doc.getNumberOfPages() > 5)
  assert.equal(record.weights.length, 80)
  assert.equal(record.logs.length, 80)
  assert.equal(unsupportedCharacters, true)
})

test('si falta la fuente no genera silenciosamente un documento incompleto', () => {
  assert.throws(() => createAnimalPdf(buildAnimalRecord({ name: 'Luna' })), /tipografía/)
})
