import { useState, useEffect, useRef } from 'react'
import { COUNTRIES, COUNTRY_NAMES, COUNTRY_FLAGS, loadData, saveData, getFamilyNames } from '../../lib/data'

const EDU_TYPES = [
  'School', 'University', 'College', 'Kindergarten',
  'Language Course', 'Online Course', 'Certificate Program',
  'Vocational Training', 'Tutoring', 'Other'
]

const EDU_STATUSES = ['In Progress', 'Completed', 'On Hold', 'Dropped']

const statusCfg = {
  'In Progress': { text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', dot: 'bg-blue-400' },
  'Completed':   { text: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', dot: 'bg-green-400' },
  'On Hold':     { text: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', dot: 'bg-yellow-400' },
  'Dropped':     { text: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-700', dot: 'bg-gray-600' },
}

const defaultRecords = [
  { id: 1, person: 'Anna', country: 'UA', type: 'University', institution: 'Kyiv Polytechnic Institute', program: 'Computer Science', dateFrom: '2010-09-01', dateTo: '2014-06-30', status: 'Completed', result: 'Bachelor\'s Degree', certNumber: 'UA/DIP/2014/001', note: '', files: [] },
  { id: 2, person: 'Anna', country: 'PL', type: 'Language Course', institution: 'Warsaw Language School', program: 'Polish B2', dateFrom: '2022-03-01', dateTo: '2022-12-15', status: 'Completed', result: 'Certificate B2', certNumber: 'PL/LANG/2022/044', note: '', files: [] },
  { id: 3, person: 'Anna', country: 'UK', type: 'Online Course', institution: 'Udemy', program: 'QA Automation with Selenium', dateFrom: '2024-01-10', dateTo: '', status: 'In Progress', result: '', certNumber: '', note: 'Завершить до конца года', files: [] },
  { id: 4, person: 'Max', country: 'UA', type: 'School', institution: 'School No. 12, Kyiv', program: 'Primary education', dateFrom: '2019-09-01', dateTo: '2022-06-01', status: 'Completed', result: 'Grade 3 completed', certNumber: '', note: '', files: [] },
  { id: 5, person: 'Max', country: 'UK', type: 'School', institution: 'Greenfield Primary School', program: 'Year 5', dateFrom: '2022-09-01', dateTo: '', status: 'In Progress', result: '', certNumber: '', note: 'Текущее место учёбы', files: [] },
  { id: 6, person: 'Leo', country: 'UA', type: 'Kindergarten', institution: 'Sadochok No. 7, Kyiv', program: '', dateFrom: '2021-09-01', dateTo: '2022-06-01', status: 'Completed', result: '', certNumber: '', note: '', files: [] },
  { id: 7, person: 'Leo', country: 'TR', type: 'Kindergarten', institution: 'Ankara International Kindergarten', program: '', dateFrom: '2022-09-01', dateTo: '2023-06-01', status: 'Completed', result: '', certNumber: '', note: 'Английский язык обучения', files: [] },
  { id: 8, person: 'Helen', country: 'UA', type: 'Certificate Program', institution: 'Prometheus', program: 'Digital Literacy', dateFrom: '2023-02-01', dateTo: '2023-04-15', status: 'Completed', result: 'Certificate', certNumber: 'PR/2023/8821', note: '', files: [] },
  { id: 9, person: 'Mark', country: 'PL', type: 'University', institution: 'Warsaw University of Technology', program: 'Engineering', dateFrom: '2005-09-01', dateTo: '2010-06-30', status: 'Completed', result: 'Master\'s Degree', certNumber: 'PL/DIP/2010/0412', note: '', files: [] },
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
        📎 Прикрепить файл (диплом, сертификат, справка)
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
    type: EDU_TYPES[0],
    institution: '', program: '',
    dateFrom: '', dateTo: '',
    status: 'In Progress',
    result: '', certNumber: '', note: '',
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const inp = "w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-yellow-500/50 placeholder-gray-600"
  const sel = "w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-yellow-500/50"
  const lbl = (t) => <label className="text-xs text-gray-500 font-medium">{t}</label>

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6 space-y-3 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold">{initial ? 'Edit Record' : 'New Education Record'}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl">✕</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">{lbl('Person')}<select className={sel} value={form.person} onChange={e => set('person', e.target.value)}>{FAMILY.map(p => <option key={p}>{p}</option>)}</select></div>
          <div className="space-y-1">{lbl('Country')}<select className={sel} value={form.country} onChange={e => set('country', e.target.value)}>{COUNTRIES.map(c => <option key={c}>{COUNTRY_FLAGS[c]} {c}</option>)}</select></div>
        </div>

        <div className="space-y-1">{lbl('Type')}<select className={sel} value={form.type} onChange={e => set('type', e.target.value)}>{EDU_TYPES.map(t => <option key={t}>{t}</option>)}</select></div>

        <div className="space-y-1">{lbl('Institution')}<input className={inp} placeholder="Название учебного заведения" value={form.institution} onChange={e => set('institution', e.target.value)} /></div>

        <div className="space-y-1">{lbl('Program / Subject')}<input className={inp} placeholder="Специальность, курс, предмет" value={form.program} onChange={e => set('program', e.target.value)} /></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">{lbl('Start date')}<input type="date" className={inp} value={form.dateFrom} onChange={e => set('dateFrom', e.target.value)} /></div>
          <div className="space-y-1">{lbl('End date')}<input type="date" className={inp} value={form.dateTo} onChange={e => set('dateTo', e.target.value)} /></div>
        </div>

        <div className="space-y-1">{lbl('Status')}<select className={sel} value={form.status} onChange={e => set('status', e.target.value)}>{EDU_STATUSES.map(s => <option key={s}>{s}</option>)}</select></div>

        <div className="space-y-1">{lbl('Result / Grade')}<input className={inp} placeholder="Степень, оценка, результат" value={form.result} onChange={e => set('result', e.target.value)} /></div>

        <div className="space-y-1">{lbl('Certificate / Diploma number')}<input className={inp} placeholder="Номер диплома или сертификата" value={form.certNumber} onChange={e => set('certNumber', e.target.value)} /></div>

        <div className="space-y-1">{lbl('Notes')}<textarea className={`${inp} resize-none`} rows={2} placeholder="Доп. информация..." value={form.note} onChange={e => set('note', e.target.value)} /></div>

        <button onClick={() => { if (!form.institution && !form.type) return; onSave(form); onClose() }} className="w-full py-2 rounded-lg bg-yellow-500/20 text-yellow-400 text-sm font-medium hover:bg-yellow-500/30 transition-colors">Save</button>
      </div>
    </div>
  )
}

// --- Record Card ---
function RecordCard({ rec, onEdit, onDelete, onFilesChange }) {
  const cfg = statusCfg[rec.status] ?? statusCfg['On Hold']
  return (
    <div className={`p-4 rounded-xl bg-gray-900 border ${cfg.border}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${cfg.dot}`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-white font-medium">{rec.institution || rec.type}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>{rec.status}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1 flex items-center gap-2 flex-wrap">
              <span className="text-gray-300">{rec.person}</span>
              <span>·</span>
              <span className="text-xs">{COUNTRY_FLAGS[rec.country]} {rec.country}</span>
              <span>·</span>
              <span>{rec.type}</span>
            </div>
            {rec.program && <div className="text-xs text-gray-400 mt-0.5">{rec.program}</div>}
            {(rec.dateFrom || rec.dateTo) && (
              <div className="text-xs text-gray-600 mt-0.5">
                {rec.dateFrom}{rec.dateFrom && rec.dateTo ? ' — ' : ''}{rec.dateTo || (rec.status === 'In Progress' ? 'настоящее время' : '')}
              </div>
            )}
            {rec.result && <div className="text-xs text-green-400 mt-0.5">✓ {rec.result}</div>}
            {rec.certNumber && <div className="text-xs text-gray-600 mt-0.5">№ {rec.certNumber}</div>}
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
  const inProgress = records.filter(r => r.status === 'In Progress').length
  const people = [...new Set(records.map(r => r.person))]
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
      {inProgress > 0 && <div className="mt-2 text-xs text-blue-400">📚 {inProgress} сейчас учится</div>}
    </button>
  )
}

const sortOrder = { 'In Progress': 0, 'On Hold': 1, 'Completed': 2, 'Dropped': 3 }

function Education() {
  const FAMILY = getFamilyNames()
  const [records, setRecords] = useState(() => loadData('education-v1', defaultRecords))
  const [view, setView] = useState('countries')
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [selectedPerson, setSelectedPerson] = useState(null)
  const [filterPerson, setFilterPerson] = useState('all')
  const [filterCountry, setFilterCountry] = useState('all')
  const [modal, setModal] = useState(null)

  useEffect(() => { saveData('education-v1', records) }, [records])

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

  function sorted(list) {
    return [...list].sort((a, b) => (sortOrder[a.status] ?? 9) - (sortOrder[b.status] ?? 9))
  }

  // --- Country detail ---
  if (selectedCountry) {
    const list = sorted(records
      .filter(r => r.country === selectedCountry)
      .filter(r => filterPerson === 'all' || r.person === filterPerson))
    const people = [...new Set(records.filter(r => r.country === selectedCountry).map(r => r.person))]

    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={() => { setSelectedCountry(null); setFilterPerson('all') }} className="text-gray-500 hover:text-white text-sm">← Назад</button>
          <span className="text-2xl">{COUNTRY_FLAGS[selectedCountry]}</span>
          <div>
            <h1 className="text-xl font-bold text-white">{COUNTRY_NAMES[selectedCountry]}</h1>
            <p className="text-xs text-gray-500">{selectedCountry}</p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <select value={filterPerson} onChange={e => setFilterPerson(e.target.value)} className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white outline-none">
            <option value="all">Все люди</option>
            {[...people, ...FAMILY.filter(p => !people.includes(p))].map(p => <option key={p}>{p}</option>)}
          </select>
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
      .filter(r => filterCountry === 'all' || r.country === filterCountry))
    const countries = [...new Set(records.filter(r => r.person === selectedPerson).map(r => r.country))]

    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={() => { setSelectedPerson(null); setFilterCountry('all') }} className="text-gray-500 hover:text-white text-sm">← Назад</button>
          <h1 className="text-xl font-bold text-white">{selectedPerson}</h1>
        </div>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <select value={filterCountry} onChange={e => setFilterCountry(e.target.value)} className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white outline-none">
            <option value="all">Все страны</option>
            {countries.map(c => <option key={c}>{COUNTRY_FLAGS[c]} {c}</option>)}
          </select>
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
        <h1 className="text-2xl font-bold text-white">Education</h1>
        <p className="text-gray-500 text-sm mt-1">Образование семьи по странам</p>
      </div>

      <div className="flex gap-1 bg-gray-900 p-1 rounded-xl overflow-x-auto">
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
            const inProgress = personRecs.filter(r => r.status === 'In Progress').length
            return (
              <button key={person} onClick={() => setSelectedPerson(person)} className="p-4 rounded-xl bg-gray-900 border border-gray-800 hover:border-gray-600 transition-colors text-center">
                <div className="text-3xl mb-2">👤</div>
                <div className="text-sm font-medium text-white">{person}</div>
                <div className="text-xs text-gray-600 mt-1">{personRecs.length} записей</div>
                <div className="flex gap-1 justify-center mt-2 flex-wrap">
                  {countries.map(c => <span key={c} className="text-xs">{COUNTRY_FLAGS[c]}</span>)}
                </div>
                {inProgress > 0 && <div className="text-xs text-blue-400 mt-1">📚 учится</div>}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Education
