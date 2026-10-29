import { jsPDF } from 'jspdf'
import { recordFileName } from './animalRecord.js'

const FONT_URL = '/fonts/DejaVuSans.ttf'
let fontPromise

function loadFont() {
  if (!fontPromise) {
    fontPromise = fetch(FONT_URL)
      .then((response) => {
        if (!response.ok) throw new Error('No se pudo cargar la tipografía para el PDF.')
        return response.arrayBuffer()
      })
      .then((buffer) => {
        const bytes = new Uint8Array(buffer)
        let binary = ''
        for (let index = 0; index < bytes.length; index += 0x8000) {
          binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000))
        }
        return btoa(binary)
      })
      .catch((error) => {
        fontPromise = null
        throw error
      })
  }
  return fontPromise
}

// Photos are stored locally as data URLs. Convert supported browser image formats
// to a small, square JPEG so they can be embedded consistently in the PDF.
function preparePhoto(source) {
  if (!source) return Promise.resolve(null)

  return new Promise((resolve) => {
    const image = new Image()
    let finished = false
    const finish = (result) => {
      if (finished) return
      finished = true
      clearTimeout(timeout)
      resolve(result)
    }
    const timeout = setTimeout(() => finish(null), 8000)
    image.onload = () => {
      try {
        const size = Math.min(image.naturalWidth, image.naturalHeight)
        if (!size) return finish(null)
        const canvas = document.createElement('canvas')
        canvas.width = 400
        canvas.height = 400
        const context = canvas.getContext('2d')
        if (!context) return finish(null)
        context.fillStyle = '#ffffff'
        context.fillRect(0, 0, 400, 400)
        context.drawImage(image, (image.naturalWidth - size) / 2, (image.naturalHeight - size) / 2, size, size, 0, 0, 400, 400)
        finish(canvas.toDataURL('image/jpeg', 0.85))
      } catch {
        finish(null)
      }
    }
    image.onerror = () => finish(null)
    image.crossOrigin = 'anonymous'
    image.src = source
  })
}

/** Create a paginated document from the same snapshot used by the print view. */
export function createAnimalPdf(record, { fontBase64, photoDataUrl = null } = {}) {
  if (!fontBase64) throw new Error('Falta la tipografía para crear el PDF.')

  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true, putOnlyUsedFonts: true })
  doc.addFileToVFS('DejaVuSans.ttf', fontBase64)
  doc.addFont('DejaVuSans.ttf', 'DejaVu', 'normal')
  doc.setProperties({ title: `Ficha del residente - ${record.name}`, creator: 'Clowder' })
  doc.setFont('DejaVu', 'normal')
  const font = doc.getFont().metadata
  let unsupportedCharacters = false
  const safeText = (value) => Array.from(String(value)).map((character) => {
    if (character === '\n') return character
    if (character === '\r') return ''
    if (character === '\t') return '    '
    const codePoint = character.codePointAt(0)
    if (codePoint > 0xffff || !font.characterToGlyph(codePoint)) {
      unsupportedCharacters = true
      return '□'
    }
    return character
  }).join('')

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 16
  const contentWidth = pageWidth - margin * 2
  const bottom = pageHeight - 19
  const lineHeight = 4.5
  let y = 0
  let photoIncluded = false

  const regular = (size = 9.5, color = [30, 41, 59]) => {
    doc.setFont('DejaVu', 'normal')
    doc.setFontSize(size)
    doc.setTextColor(...color)
  }
  const bold = (size = 9, color = [100, 116, 139]) => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(size)
    doc.setTextColor(...color)
  }
  const addPage = () => {
    doc.addPage()
    y = 16
  }
  const ensureSpace = (height) => {
    if (y + height > bottom) addPage()
  }
  const linesFor = (value, width, size = 9.5) => {
    regular(size)
    return doc.splitTextToSize(String(value), width)
  }

  // First-page heading and photo.
  doc.setFillColor(250, 248, 246)
  doc.rect(0, 0, pageWidth, 29, 'F')
  bold(15, [111, 96, 87])
  doc.text('CLOWDER', margin, 17)
  bold(10, [30, 41, 59])
  doc.text('Ficha del residente', pageWidth - margin, 14, { align: 'right' })
  regular(8, [100, 116, 139])
  doc.text(`Generada el ${record.generatedAt}`, pageWidth - margin, 20, { align: 'right' })
  y = 36

  doc.setDrawColor(229, 217, 208)
  doc.setFillColor(250, 248, 246)
  doc.roundedRect(margin, y, 31, 31, 2, 2, 'FD')
  if (photoDataUrl) {
    try {
      doc.addImage(photoDataUrl, 'JPEG', margin, y, 31, 31)
      photoIncluded = true
    } catch (error) {
      console.warn('No se pudo incluir la foto en el PDF:', error)
    }
  }
  if (!photoIncluded) {
    regular(8, [100, 116, 139])
    doc.text('Sin foto', margin + 15.5, y + 16.5, { align: 'center' })
  }

  const heroX = margin + 37
  const heroWidth = contentWidth - 37
  bold(8, [111, 96, 87])
  doc.text('REGISTRO DE BIENESTAR', heroX, y + 5)
  regular(17, [15, 23, 42])
  const heroName = record.name.length > 120 ? `${record.name.slice(0, 117)}...` : record.name
  const nameLines = doc.splitTextToSize(safeText(heroName), heroWidth).slice(0, 2)
  nameLines.forEach((line, index) => doc.text(line, heroX, y + 13 + index * 7))
  regular(9, [71, 85, 105])
  const subtitle = `${record.species} - ${record.breed}`
  const subtitleLine = doc.splitTextToSize(subtitle.length > 120 ? `${subtitle.slice(0, 117)}...` : subtitle, heroWidth)[0]
  doc.text(subtitleLine, heroX, y + 29)
  y += 38

  const heading = (title) => {
    ensureSpace(19)
    bold(11, [111, 96, 87])
    doc.text(title, margin, y + 4)
    doc.setDrawColor(226, 232, 240)
    doc.line(margin, y + 6, pageWidth - margin, y + 6)
    y += 10
  }

  // Fields are arranged in two columns. Extremely long values continue onto
  // subsequent pages rather than being clipped or overlapping the footer.
  const fields = (items) => {
    const gap = 8
    const width = (contentWidth - gap) / 2
    for (let index = 0; index < items.length; index += 2) {
      const cells = items.slice(index, index + 2).map((field) => ({
        ...field,
        lines: linesFor(field.value, width),
      }))
      const totalLines = Math.max(...cells.map((cell) => cell.lines.length))
      let offset = 0
      while (offset < totalLines) {
        ensureSpace(12)
        const capacity = Math.max(1, Math.floor((bottom - y - 7) / lineHeight))
        const count = Math.min(capacity, totalLines - offset)
        cells.forEach((cell, column) => {
          if (offset >= cell.lines.length) return
          const x = margin + column * (width + gap)
          bold(8)
          doc.text(offset ? `${cell.label} (cont.)` : cell.label, x, y + 3)
          regular()
          cell.lines.slice(offset, offset + count).forEach((line, lineIndex) => {
            doc.text(line, x, y + 7.5 + lineIndex * lineHeight)
          })
        })
        y += 7 + count * lineHeight + 2
        offset += count
        if (offset < totalLines) addPage()
      }
    }
  }

  const fullField = (label, value) => {
    ensureSpace(12)
    bold(8)
    doc.text(label, margin, y + 3)
    y += 5
    const lines = linesFor(value, contentWidth)
    lines.forEach((line) => {
      ensureSpace(lineHeight)
      regular()
      doc.text(line, margin, y + 3.5)
      y += lineHeight
    })
    y += 3
  }

  const empty = (message) => {
    ensureSpace(7)
    regular(9, [100, 116, 139])
    doc.text(message, margin, y + 3.5)
    y += 8
  }

  heading('Datos del residente')
  fields(record.identification)
  fullField('Descripción y personalidad', record.description)

  heading('Salud y cuidados')
  fields(record.health)
  fields(record.care)

  heading('Gustos y preferencias')
  fields(record.preferences)

  heading('Historial de peso')
  if (record.weights.length) {
    const tableHeader = () => {
      ensureSpace(8)
      bold(8)
      doc.text('Fecha', margin, y + 3)
      doc.text('Peso', margin + contentWidth / 2, y + 3)
      y += 6
    }
    tableHeader()
    record.weights.forEach((weight) => {
      if (y + 6 > bottom) {
        addPage()
        tableHeader()
      }
      regular()
      doc.text(weight.date, margin, y + 3)
      doc.text(weight.weight, margin + contentWidth / 2, y + 3)
      doc.setDrawColor(241, 245, 249)
      doc.line(margin, y + 5, pageWidth - margin, y + 5)
      y += 6
    })
    y += 2
  } else {
    empty('Sin registros de peso.')
  }

  heading('Bitácora cronológica')
  if (record.logs.length) {
    record.logs.forEach((log) => {
      ensureSpace(15)
      bold(8, [111, 96, 87])
      doc.text(log.type, margin, y + 3)
      regular(8, [100, 116, 139])
      doc.text(log.date, pageWidth - margin, y + 3, { align: 'right' })
      y += 5

      const writeLines = (value, size, color) => {
        const lines = linesFor(value, contentWidth, size)
        lines.forEach((line) => {
          ensureSpace(lineHeight)
          regular(size, color)
          doc.text(line, margin, y + 3.5)
          y += lineHeight
        })
      }
      writeLines(log.title, 10.5, [15, 23, 42])
      if (log.description) writeLines(log.description, 9.5, [71, 85, 105])
      if (log.mood) writeLines(`Estado de ánimo: ${log.mood}`, 8.5, [100, 116, 139])
      ensureSpace(4)
      doc.setDrawColor(226, 232, 240)
      doc.line(margin, y + 1, pageWidth - margin, y + 1)
      y += 5
    })
  } else {
    empty('Sin registros en la bitácora.')
  }

  const totalPages = doc.getNumberOfPages()
  for (let page = 1; page <= totalPages; page += 1) {
    doc.setPage(page)
    doc.setDrawColor(226, 232, 240)
    doc.line(margin, pageHeight - 13, pageWidth - margin, pageHeight - 13)
    regular(7.5, [100, 116, 139])
    doc.text('Clowder - Información registrada en este dispositivo', margin, pageHeight - 8)
    doc.text(`Página ${page} de ${totalPages}`, pageWidth - margin, pageHeight - 8, { align: 'right' })
  }

  return { doc, photoIncluded, unsupportedCharacters }
}

export async function downloadAnimalPdf(record) {
  const [fontBase64, photoDataUrl] = await Promise.all([loadFont(), preparePhoto(record.photo)])
  const { doc, photoIncluded, unsupportedCharacters } = createAnimalPdf(record, { fontBase64, photoDataUrl })
  doc.save(recordFileName(record.name))
  return { photoMissing: Boolean(record.photo) && !photoIncluded, unsupportedCharacters }
}
