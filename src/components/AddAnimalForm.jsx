import { useState, useCallback, useRef } from 'react'
import { useAnimals } from '../context/AnimalContext'
import { X, PawPrint, Image as ImageIcon, Plus, Calendar, UserRound } from 'lucide-react'

export default function AddAnimalForm({ onClose, onSuccess }) {
  const { saveAnimal } = useAnimals()
  const [loading, setLoading] = useState(false)
  const [photoUrl, setPhotoUrl] = useState(null)
  const photoInputRef = useRef(null)

  const [form, setForm] = useState({
    name: '',
    species: 'cat',
    breed: '',
    age: '',
    gender: '',
    color: '',
    weight: '',
    microchip: '',
    description: '',
    rescuedAt: '',
    vaccinated: false,
    dewormed: false,
    sterilized: false,
    chronicConditions: '',
    currentMedications: '',
    foods: '',
    toys: '',
    activities: '',
    fears: '',
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handlePhoto = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      window.alert('La foto debe pesar menos de 5 MB.')
      e.target.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = () => setPhotoUrl(reader.result)
    reader.onerror = () => window.alert('No se pudo leer la foto. Inténtalo de nuevo.')
    reader.readAsDataURL(file)
  }

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const health = {
        vaccinated: form.vaccinated,
        dewormed: form.dewormed,
        sterilized: form.sterilized,
        chronicConditions: form.chronicConditions.split(',').map((c) => c.trim()).filter(Boolean),
        currentMedications: form.currentMedications.split(',').map((c) => c.trim()).filter(Boolean),
        weightHistory: [],
        lastVetVisit: null,
        nextVetVisit: null,
      }

      const preferences = {
        foods: form.foods.split(',').map((c) => c.trim()).filter(Boolean),
        toys: form.toys.split(',').map((c) => c.trim()).filter(Boolean),
        activities: form.activities.split(',').map((c) => c.trim()).filter(Boolean),
        fears: form.fears.split(',').map((c) => c.trim()).filter(Boolean),
      }

      await saveAnimal({
        ...form,
        age: Number(form.age) || 0,
        weight: Number(form.weight) || 0,
        photo: photoUrl,
        health,
        preferences,
      })

      onSuccess()
    } catch (error) {
      console.error(error)
      alert('Error al guardar el animal')
    } finally {
      setLoading(false)
    }
  }, [form, photoUrl, saveAnimal, onSuccess])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-3 backdrop-blur-sm sm:p-6">
      <div className="glass-card flex max-h-[92vh] w-full max-w-2xl flex-col bg-white/90 shadow-card-hover">
        <div className="flex items-center justify-between border-b border-slate-100/80 p-4 sm:p-5">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <PawPrint className="w-5 h-5 text-brand-600" /> Nuevo integrante
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="label-field">Nombre</label>
              <input
                className="input-field"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ej. Luna, Max"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="label-field">Especie</label>
              <select className="input-field" name="species" value={form.species} onChange={handleChange}>
                <option value="cat">Gato</option>
                <option value="dog">Perro</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="label-field">Raza / Tipo</label>
              <input className="input-field" name="breed" value={form.breed} onChange={handleChange} placeholder="Opcional" />
            </div>
            <div className="space-y-2">
              <label className="label-field">Edad (años)</label>
              <input className="input-field" type="number" name="age" value={form.age} onChange={handleChange} placeholder="0" />
            </div>
            <div className="space-y-2">
              <label className="label-field">Género</label>
              <div className="grid grid-cols-2 gap-2" role="group" aria-label="Seleccionar género">
                <button
                  type="button"
                  aria-pressed={form.gender === 'male'}
                  onClick={() => setForm({ ...form, gender: 'male' })}
                  className={`inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
                    form.gender === 'male'
                      ? 'border-brand-300 bg-brand-50 text-brand-700'
                      : 'border-slate-200 bg-white/70 text-slate-600 hover:border-brand-200'
                  }`}
                >
                  <UserRound className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" /> Macho
                </button>
                <button
                  type="button"
                  aria-pressed={form.gender === 'female'}
                  onClick={() => setForm({ ...form, gender: 'female' })}
                  className={`inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
                    form.gender === 'female'
                      ? 'border-brand-300 bg-brand-50 text-brand-700'
                      : 'border-slate-200 bg-white/70 text-slate-600 hover:border-brand-200'
                  }`}
                >
                  <UserRound className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" /> Hembra
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="label-field">Color / Pelaje</label>
            <input className="input-field" name="color" value={form.color} onChange={handleChange} placeholder="Ej. Negro, siamés, tricolor" />
          </div>

          <div className="space-y-2">
            <label className="label-field">Foto (opcional)</label>
            <div className="flex items-center gap-3">
              <input
                ref={photoInputRef}
                className="sr-only"
                type="file"
                accept="image/*"
                onChange={handlePhoto}
                aria-label="Seleccionar foto del animal"
              />
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                className="btn-outline flex items-center gap-2"
              >
                <ImageIcon className="w-4 h-4" /> Subir foto
              </button>
              {photoUrl && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  Foto seleccionada
                  <button
                    type="button"
                    onClick={() => setPhotoUrl(null)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Cambiar
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="label-field">Peso (kg)</label>
              <input className="input-field" type="number" step="0.1" name="weight" value={form.weight} onChange={handleChange} placeholder="Ej. 4.5" />
            </div>
            <div className="space-y-2">
              <label className="label-field">Fecha de rescate / llegada</label>
              <input className="input-field" type="date" name="rescuedAt" value={form.rescuedAt} onChange={handleChange} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="label-field">Descripción y personalidad</label>
            <textarea
              className="input-field h-24 resize-none"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Carácter, manías, cosas que le gustan..."
            />
          </div>

          <div className="border-t pt-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Salud
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="vaccinated"
                  checked={form.vaccinated}
                  onChange={handleChange}
                  className="rounded border-brand-300 text-brand-600 focus:ring-brand-500"
                />
                Vacunado
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="dewormed"
                  checked={form.dewormed}
                  onChange={handleChange}
                  className="rounded border-brand-300 text-brand-600 focus:ring-brand-500"
                />
                Desparasitado
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="sterilized"
                  checked={form.sterilized}
                  onChange={handleChange}
                  className="rounded border-brand-300 text-brand-600 focus:ring-brand-500"
                />
                Esterilizado
              </label>
            </div>

            <div className="mt-4 space-y-2">
              <label className="label-field">Condiciones crónicas (separadas por coma)</label>
              <input className="input-field" name="chronicConditions" value={form.chronicConditions} onChange={handleChange} placeholder="Ej. alergia, artritis" />
            </div>
            <div className="space-y-2">
              <label className="label-field">Medicamentos actuales (separados por coma)</label>
              <input className="input-field" name="currentMedications" value={form.currentMedications} onChange={handleChange} placeholder="Ej. glucosamina, antibiótico" />
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Gustos y preferencias
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="label-field">Comidas favoritas</label>
                <input className="input-field" name="foods" value={form.foods} onChange={handleChange} placeholder="Ej. pollo, atún" />
              </div>
              <div className="space-y-2">
                <label className="label-field">Juguetes favoritos</label>
                <input className="input-field" name="toys" value={form.toys} onChange={handleChange} placeholder="Ej. pelota, plumero" />
              </div>
              <div className="space-y-2">
                <label className="label-field">Actividades que le gustan</label>
                <input className="input-field" name="activities" value={form.activities} onChange={handleChange} placeholder="Ej. dormir al sol, paseos" />
              </div>
              <div className="space-y-2">
                <label className="label-field">Miedos o cosas que le disgustan</label>
                <input className="input-field" name="fears" value={form.fears} onChange={handleChange} placeholder="Ej. aspiradora, truenos" />
              </div>
            </div>
          </div>

          <div className="pt-6 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn-outline">Cancelar</button>
            <button type="submit" className="btn-brand" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar animal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
