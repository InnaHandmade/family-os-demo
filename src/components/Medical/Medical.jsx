import { useState, useEffect, useRef } from 'react'
import { COUNTRIES, COUNTRY_NAMES, COUNTRY_FLAGS, loadData, saveData, getFamilyNames } from '../../lib/data'

const MED_TYPES = [
  'Doctor Visit', 'Surgery / Procedure', 'Vaccination',
  'Test / Analysis', 'Diagnosis', 'Hospital Stay',
  'Prescription', 'Insurance', 'Screening', 'Other'
]

const typeIcons = {
  'Doctor Visit': '🩺', 'Surgery / Procedure': '🏥', 'Vaccination': '💉',
  'Test / Analysis': '🔬', 'Diagnosis': '📋', 'Hospital Stay': '🛏',
  'Prescription': '💊', 'Insurance': '🛡', 'Screening': '📊', 'Other': '📁'
}

const defaultRecords = [
  { id: 1, person: 'Anna', country: 'UA', type: 'Surgery / Procedure', date: '2008-05-14', institution: 'City Hospital No. 3, Kyiv', doctor: 'Dr. Petrenko', title: 'Appendectomy', description: 'Removal of appendix, laparoscopic', result: 'Successful, full recovery', nextDate: '', note: 'Выписка хранится', files: [] },
  { id: 2, person: 'Anna', country: 'PL', type: 'Doctor Visit', date: '2024-03-10', institution: 'Medicover Warsaw', doctor: 'Dr. Kowalski', title: 'Annual checkup', description: 'General health examination', result: 'All normal', nextDate: '2025-03-10', note: '', files: [] },
  { id: 3, person: 'Max', country: 'UA', type: 'Vaccination', date: '2019-10-05', institution: 'Children\'s Clinic No. 7', doctor: '', title: 'MMR Vaccine', description: 'Measles, Mumps, Rubella — 2nd dose', result: 'Done', nextDate: '', note: '', files: [] },
  { id: 4, person: 'Max', country: 'UK', type: 'Vaccination', date: '2023-01-15', institution: 'GP Surgery Greenfield', doctor: 'Dr. Smith', title: 'Flu vaccine', description: 'Seasonal influenza vaccination', result: 'Done', nextDate: '2024-01-01', note: '', files: [] },
  { id: 5, person: 'Leo', country: 'TR', type: 'Doctor Visit', date: '2023-08-20', institution: 'Ankara Private Clinic', doctor: 'Dr. Yilmaz', title: 'ENT consultation', description: 'Ear infection check', result: 'Mild otitis, prescribed drops', nextDate: '', note: 'Рецепт сохранён', files: [] },
  { id: 6, person: 'Leo', country: 'UA', type: 'Vaccination', date: '2021-06-12', institution: 'Children\'s Clinic No. 7', doctor: '', title: 'DTP Booster', description: 'Diphtheria, Tetanus, Pertussis', result: 'Done', nextDate: '', note: '', files: [] },
  { id: 7, person: 'Helen', country: 'UA', type: 'Test / Analysis', date: '2024-01-08', institution: 'Sinevo Lab, Kyiv', doctor: '', title: 'Blood test', description: 'General blood count + biochemistry', result: 'Minor vitamin D deficiency', nextDate: '2024-07-08', note: 'Назначен витамин D', files: [] },
  { id: 8, person: 'Mark', country: 'PL', type: 'Screening', date: '2023-11-20', institution: 'LUX MED Warsaw', doctor: 'Dr. Nowak', title: 'Cardiac screening', description: 'ECG + Echo', result: 'Normal', nextDate: '2025-11-20', note: '', files: [] },
]

// --- File Attachments ---
function FileAttachments({ files = [], onChange }) {
  const inputRef = useRef()
  function handleFiles(e) {
    Array.from(e.target.files).forEach(file => {
      if (file.size > 4 * 1024 * 1024) { alert(`"${file.name}" макс. 4MB`); return }
      const reader = new FileReader()
      reader.onload = ev => onChange([...files, { name: file.name, type: file.type, data: ev.target.result, size: file.size }])
      reader.readAsDataURL(file)
    })
    e.target.value = ''
  }
  function formatSize(b) { return b < 1048576 ? `${(b / 1024).toFixed(0)}KB` : `${(b / 1048576).toFixed(1)}MB` }
  function download(f) { const a = document.createElement('a'); a.href = f.data; a.download = f.name; a.click() }
  return (
    <div className="space-y-1">
      {files.map((f, i) => (
        <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-gray-800 border border-gray-700">
          <span className="text-xs">📎</span>
          <button onClick={() => download(f)} className="text-xs text-blue-400 hover:text-blue-300 flex-1 text-left truncate">{f.name}</button>
          <span className="text-xs text-gray-600">{formatSize(f.size)}</span>
          <button onClick={() => onChange(files.filter((_, j) => j !== i))} className="text-gray-600 hover:text-red-400 text-xs">✕</button>
        </div>
      ))}
      <button onClick={() => inputRef.current.click()} className="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1">
        📎 Прикрепить файлы (выписка, анализ, рецепт)
      </button>
      <input ref={inputRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" className="hidden" onChange={handleFiles} />
    </div>
  )
}

// --- Record Modal ---
function RecordModal({ initial, defaultCountry, defaultPerson, onClose, onSave }) {
  const [form, setForm] = useState(initial ?? {
    person: defaultPerson ?? FAMILY[0],
    country: defaultCountry ?? COUNTRIES[0],
    type: MED_TYPES[0],
    date: '', title: '', institution: '', doctor: '',
    description: '', result: '', nextDate: '', note: '',
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const inp = "w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-yellow-500/50 placeholder-gray-600"
  const sel = "w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-yellow-500/50"
  const lbl = t => <label className="text-xs text-gray-500 font-medium">{t}</label>

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6 space-y-3 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold">{initial ? 'Edit Record' : 'New Medical Record'}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl">✕</button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">{lbl('Person')}<select className={sel} value={form.person} onChange={e => set('person', e.target.value)}>{FAMILY.map(p => <option key={p}>{p}</option>)}</select></div>
          <div className="space-y-1">{lbl('Country')}<select className={sel} value={form.country} onChange={e => set('country', e.target.value)}>{COUNTRIES.map(c => <option key={c}>{COUNTRY_FLAGS[c]} {c}</option>)}</select></div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">{lbl('Type')}<select className={sel} value={form.type} onChange={e => set('type', e.target.value)}>{MED_TYPES.map(t => <option key={t}>{t}</option>)}</select></div>
          <div className="space-y-1">{lbl('Date')}<input type="date" className={inp} value={form.date} onChange={e => set('date', e.target.value)} /></div>
        </div>

        <div className="space-y-1">{lbl('Title / Event name')}<input className={inp} placeholder="Название события" value={form.title} onChange={e => set('title', e.target.value)} /></div>
        <div className="space-y-1">{lbl('Institution / Clinic')}<input className={inp} placeholder="Больница, клиника, лаборатория" value={form.institution} onChange={e => set('institution', e.target.value)} /></div>
        <div className="space-y-1">{lbl('Doctor / Specialist')}<input className={inp} placeholder="Dr. Smith" value={form.doctor} onChange={e => set('doctor', e.target.value)} /></div>
        <div className="space-y-1">{lbl('Description')}<textarea className={`${inp} resize-none`} rows={2} placeholder="Что произошло, что проверяли..." value={form.description} onChange={e => set('description', e.target.value)} /></div>
        <div className="space-y-1">{lbl('Result / Conclusion')}<textarea className={`${inp} resize-none`} rows={2} placeholder="Результат, диагноз, заключение" value={form.result} onChange={e => set('result', e.target.value)} /></div>
        <div className="space-y-1">{lbl('Next appointment')}<input type="date" className={inp} value={form.nextDate} onChange={e => set('nextDate', e.target.value)} /></div>
        <div className="space-y-1">{lbl('Notes')}<textarea className={`${inp} resize-none`} rows={2} placeholder="Доп. заметки, рецепты, напоминания" value={form.note} onChange={e => set('note', e.target.value)} /></div>

        <button onClick={() => { if (!form.date && !form.title) return; onSave(form); onClose() }} className="w-full py-2 rounded-lg bg-yellow-500/20 text-yellow-400 text-sm font-medium hover:bg-yellow-500/30 transition-colors">Save</button>
      </div>
    </div>
  )
}

// --- Record Card ---
function RecordCard({ rec, onEdit, onDelete, onFilesChange }) {
  const icon = typeIcons[rec.type] ?? '📁'

  function formatDate(d) {
    if (!d) return ''
    const [y, m, day] = d.split('-')
    return `${day}.${m}.${y}`
  }

  return (
    <div className="p-4 rounded-xl bg-gray-900 border border-gray-800">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Date — prominent */}
          <div className="flex-shrink-0 text-center bg-gray-800 rounded-lg px-2 py-1 min-w-[52px]">
            <div className="text-xs text-gray-500">{rec.date?.slice(0, 4)}</div>
            <div className="text-sm font-bold text-white">{rec.date ? `${rec.date.slice(8)}.${rec.date.slice(5, 7)}` : '—'}</div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base">{icon}</span>
              <span className="text-white font-medium">{rec.title || rec.type}</span>
              <span className="text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded">{rec.type}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1 flex items-center gap-2 flex-wrap">
              <span className="text-gray-300">{rec.person}</span>
              <span>·</span>
              <span>{COUNTRY_FLAGS[rec.country]} {rec.country}</span>
              {rec.institution && <><span>·</span><span>{rec.institution}</span></>}
            </div>
            {rec.doctor && <div className="text-xs text-gray-600 mt-0.5">{rec.doctor}</div>}
            {rec.description && <div className="text-xs text-gray-500 mt-1">{rec.description}</div>}
            {rec.result && <div className="text-xs text-blue-300 mt-1">→ {rec.result}</div>}
            {rec.nextDate && (
              <div className="text-xs text-yellow-400 mt-1">
                📅 Следующий визит: {formatDate(rec.nextDate)}
              </div>
            )}
            {rec.note && <div className="text-xs text-gray-500 mt-1 italic">{rec.note}</div>}
          </div>
        </div>

        <div className="flex gap-1 flex-shrink-0">
          <button onClick={onEdit} className="p-1.5 rounded-lg text-gray-600 hover:text-yellow-400 hover:bg-yellow-500/10 text-xs transition-colors">✎</button>
          <button onClick={onDelete} className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 text-xs transition-colors">✕</button>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-800">
        <FileAttachments files={rec.files ?? []} onChange={onFilesChange} />
      </div>
    </div>
  )
}

// --- Country Card ---
function CountryCard({ country, records, onClick }) {
  const people = [...new Set(records.map(r => r.person))]
  const hasNext = records.filter(r => r.nextDate && new Date(r.nextDate) > new Date()).length
  return (
    <button onClick={onClick} className="p-5 rounded-xl bg-gray-900 border border-gray-800 hover:border-gray-600 transition-colors text-left w-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{COUNTRY_FLAGS[country]}</span>
          <div>
            <div className="text-white font-semibold">{country}</div>
            <div className="text-xs text-gray-600">{COUNTRY_NAMES[country]}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-white">{records.length}</div>
          <div className="text-xs text-gray-600">записей</div>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {people.map(p => <span key={p} className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">{p}</span>)}
        {records.length === 0 && <span className="text-xs text-gray-700">Нет записей</span>}
      </div>
      {hasNext > 0 && <div className="mt-2 text-xs text-yellow-400">📅 {hasNext} предстоящий визит</div>}
    </button>
  )
}

function Medical() {
  const FAMILY = getFamilyNames()
  const [records, setRecords] = useState(() => loadData('medical-v1', defaultRecords))
  const [view, setView] = useState('countries')
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [selectedPerson, setSelectedPerson] = useState(null)
  const [filterPerson, setFilterPerson] = useState('all')
  const [filterCountry, setFilterCountry] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [modal, setModal] = useState(null)

  useEffect(() => { saveData('medical-v1', records) }, [records])

  function handleSave(form) {
    if (modal === 'new') setRecords(prev => [{ ...form, id: Date.now(), files: [] }, ...prev])
    else setRecords(prev => prev.map(r => r.id === modal.id ? { ...modal, ...form } : r))
  }

  function handleDelete(id) {
    if (window.confirm('Удалить запись?')) setRecords(prev => prev.filter(r => r.id !== id))
  }

  function updateFiles(id, files) {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, files } : r))
  }

  // Sort by date descending
  function sorted(list) {
    return [...list].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
  }

  // --- Country detail ---
  if (selectedCountry) {
    const list = sorted(records
      .filter(r => r.country === selectedCountry)
      .filter(r => filterPerson === 'all' || r.person === filterPerson)
      .filter(r => filterType === 'all' || r.type === filterType))
    const people = [...new Set(records.filter(r => r.country === selectedCountry).map(r => r.person))]

    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={() => { setSelectedCountry(null); setFilterPerson('all'); setFilterType('all') }} className="text-gray-500 hover:text-white text-sm">← Назад</button>
          <span className="text-2xl">{COUNTRY_FLAGS[selectedCountry]}</span>
          <div>
            <h1 className="text-xl font-bold text-white">{COUNTRY_NAMES[selectedCountry]}</h1>
            <p className="text-xs text-gray-500">{selectedCountry}</p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex gap-2 flex-wrap">
            <select value={filterPerson} onChange={e => setFilterPerson(e.target.value)} className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white outline-none">
              <option value="all">Все люди</option>
              {[...people, ...FAMILY.filter(p => !people.includes(p))].map(p => <option key={p}>{p}</option>)}
            </select>
            <select value={filterType} onChange={e => setFilterType(e.target.value)} className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white outline-none">
              <option value="all">Все типы</option>
              {MED_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <button onClick={() => setModal('new')} className="text-sm px-4 py-2 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors">+ Добавить запись</button>
        </div>
        <div className="text-xs text-gray-600">{list.length} записей</div>
        <div className="space-y-3">
          {list.length === 0 && <div className="text-gray-600 text-sm py-8 text-center">Нет записей</div>}
          {list.map(rec => <RecordCard key={rec.id} rec={rec} onEdit={() => setModal(rec)} onDelete={() => handleDelete(rec.id)} onFilesChange={files => updateFiles(rec.id, files)} />)}
        </div>
        {modal && <RecordModal initial={modal === 'new' ? null : modal} defaultCountry={selectedCountry} defaultPerson={filterPerson !== 'all' ? filterPerson : undefined} onClose={() => setModal(null)} onSave={handleSave} />}
      </div>
    )
  }

  // --- Person detail ---
  if (selectedPerson) {
    const list = sorted(records
      .filter(r => r.person === selectedPerson)
      .filter(r => filterCountry === 'all' || r.country === filterCountry)
      .filter(r => filterType === 'all' || r.type === filterType))
    const countries = [...new Set(records.filter(r => r.person === selectedPerson).map(r => r.country))]

    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={() => { setSelectedPerson(null); setFilterCountry('all'); setFilterType('all') }} className="text-gray-500 hover:text-white text-sm">← Назад</button>
          <h1 className="text-xl font-bold text-white">{selectedPerson}</h1>
        </div>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex gap-2 flex-wrap">
            <select value={filterCountry} onChange={e => setFilterCountry(e.target.value)} className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white outline-none">
              <option value="all">Все страны</option>
              {countries.map(c => <option key={c}>{COUNTRY_FLAGS[c]} {c}</option>)}
            </select>
            <select value={filterType} onChange={e => setFilterType(e.target.value)} className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white outline-none">
              <option value="all">Все типы</option>
              {MED_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <button onClick={() => setModal('new')} className="text-sm px-4 py-2 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors">+ Добавить запись</button>
        </div>
        <div className="space-y-3">
          {list.length === 0 && <div className="text-gray-600 text-sm py-8 text-center">Нет записей</div>}
          {list.map(rec => <RecordCard key={rec.id} rec={rec} onEdit={() => setModal(rec)} onDelete={() => handleDelete(rec.id)} onFilesChange={files => updateFiles(rec.id, files)} />)}
        </div>
        {modal && <RecordModal initial={modal === 'new' ? null : modal} defaultPerson={selectedPerson} onClose={() => setModal(null)} onSave={handleSave} />}
      </div>
    )
  }

  // --- Top level ---
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Medical</h1>
        <p className="text-gray-500 text-sm mt-1">Медицинские записи семьи</p>
      </div>

      <div className="flex gap-1 bg-gray-900 p-1 rounded-xl w-fit">
        <button onClick={() => setView('countries')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'countries' ? 'bg-yellow-500/10 text-yellow-400' : 'text-gray-500 hover:text-gray-300'}`}>🌍 По странам</button>
        <button onClick={() => setView('people')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'people' ? 'bg-yellow-500/10 text-yellow-400' : 'text-gray-500 hover:text-gray-300'}`}>👤 По людям</button>
      </div>

      {view === 'countries' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {COUNTRIES.map(c => <CountryCard key={c} country={c} records={records.filter(r => r.country === c)} onClick={() => setSelectedCountry(c)} />)}
        </div>
      )}

      {view === 'people' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {FAMILY.map(person => {
            const personRecs = records.filter(r => r.person === person)
            const countries = [...new Set(personRecs.map(r => r.country))]
            const nextVisits = personRecs.filter(r => r.nextDate && new Date(r.nextDate) > new Date()).length
            return (
              <button key={person} onClick={() => setSelectedPerson(person)} className="p-4 rounded-xl bg-gray-900 border border-gray-800 hover:border-gray-600 transition-colors text-center">
                <div className="text-3xl mb-2">👤</div>
                <div className="text-sm font-medium text-white">{person}</div>
                <div className="text-xs text-gray-600 mt-1">{personRecs.length} записей</div>
                <div className="flex gap-1 justify-center mt-2 flex-wrap">
                  {countries.map(c => <span key={c} className="text-xs">{COUNTRY_FLAGS[c]}</span>)}
                </div>
                {nextVisits > 0 && <div className="text-xs text-yellow-400 mt-1">📅 {nextVisits} визит</div>}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Medical
