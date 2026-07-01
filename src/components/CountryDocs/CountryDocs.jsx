import { useState, useEffect, useRef } from 'react'

const FAMILY = ['Anna', 'Max', 'Leo', 'Helen', 'Mark']
const COUNTRIES = ['UA', 'PL', 'UK', 'TR', 'UZ', 'GE']
const COUNTRY_NAMES = { UA: 'Ukraine', PL: 'Poland', UK: 'United Kingdom', TR: 'Turkey', UZ: 'Uzbekistan', GE: 'Georgia' }
const COUNTRY_FLAGS = { UA: '🇺🇦', PL: '🇵🇱', UK: '🇬🇧', TR: '🇹🇷', UZ: '🇺🇿', GE: '🇬🇪' }
const DOC_TYPES = ['Passport', 'ID Card', 'Residence Permit', 'Visa', 'Work Permit', 'Driving License', 'Health Insurance', 'Birth Certificate', 'Marriage Certificate', 'Tax ID', 'Bank Statement', 'Other']

const defaultDocs = [
  { id: 1, person: 'Anna', country: 'UA', type: 'Passport', number: 'FE123456', issued: '2016-08-20', expires: '2026-08-20', note: '', files: [] },
  { id: 2, person: 'Anna', country: 'PL', type: 'Residence Permit', number: 'KP/123456/2023', issued: '2023-03-01', expires: '2027-03-01', note: 'Karta pobytu', files: [] },
  { id: 3, person: 'Anna', country: 'UK', type: 'Visa', number: 'GBR-V-2024-001', issued: '2024-01-10', expires: '2026-08-15', note: 'Skilled Worker Visa', files: [] },
  { id: 4, person: 'Max', country: 'UA', type: 'Passport', number: 'FE654321', issued: '2020-05-15', expires: '2030-05-15', note: '', files: [] },
  { id: 5, person: 'Max', country: 'UK', type: 'Residence Permit', number: 'UK/RP/M/001', issued: '2023-06-01', expires: '2028-06-01', note: '', files: [] },
  { id: 6, person: 'Leo', country: 'UA', type: 'Passport', number: 'FE789012', issued: '2021-09-10', expires: '2031-09-10', note: '', files: [] },
  { id: 7, person: 'Leo', country: 'TR', type: 'Residence Permit', number: 'TR/YP/L/2023', issued: '2023-07-20', expires: '2025-07-20', note: 'İkamet İzni — EXPIRED', files: [] },
  { id: 8, person: 'Helen', country: 'UA', type: 'Passport', number: 'EH345678', issued: '2018-11-05', expires: '2028-11-05', note: '', files: [] },
  { id: 9, person: 'Helen', country: 'UZ', type: 'Visa', number: 'UZ-V-2025-001', issued: '2025-01-15', expires: '2026-01-15', note: 'Multiple entry', files: [] },
  { id: 10, person: 'Mark', country: 'PL', type: 'Passport', number: 'PL/P/M/2020', issued: '2020-03-22', expires: '2030-03-22', note: '', files: [] },
  { id: 11, person: 'Mark', country: 'UK', type: 'Residence Permit', number: 'UK/RP/MK/001', issued: '2022-09-01', expires: '2027-09-01', note: '', files: [] },
]

function getExpiryStatus(expires) {
  if (!expires) return 'unknown'
  const days = Math.floor((new Date(expires) - new Date()) / 86400000)
  if (days < 0) return 'expired'
  if (days < 90) return 'expiring'
  return 'valid'
}

function daysUntil(expires) {
  return Math.floor((new Date(expires) - new Date()) / 86400000)
}

const statusCfg = {
  expired: { label: 'Expired', text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', dot: 'bg-red-400' },
  expiring: { label: 'Expiring soon', text: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', dot: 'bg-yellow-400' },
  valid: { label: 'Valid', text: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', dot: 'bg-green-400' },
  unknown: { label: '—', text: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-700', dot: 'bg-gray-600' },
}

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
          <span className="text-gray-400 text-xs">📎</span>
          <button onClick={() => download(f)} className="text-xs text-blue-400 hover:text-blue-300 flex-1 text-left truncate">{f.name}</button>
          <span className="text-xs text-gray-600">{formatSize(f.size)}</span>
          <button onClick={() => onChange(files.filter((_, j) => j !== i))} className="text-gray-600 hover:text-red-400 text-xs">✕</button>
        </div>
      ))}
      <button onClick={() => inputRef.current.click()} className="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1">
        📎 Прикрепить файл (PDF, фото)
      </button>
      <input ref={inputRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" className="hidden" onChange={handleFiles} />
    </div>
  )
}

// --- Doc Form Modal ---
function DocModal({ initial, defaultCountry, defaultPerson, onClose, onSave }) {
  const [form, setForm] = useState(initial ?? {
    person: defaultPerson ?? FAMILY[0],
    country: defaultCountry ?? COUNTRIES[0],
    type: DOC_TYPES[0],
    number: '', issued: '', expires: '', note: '',
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6 space-y-3 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold">{initial ? 'Edit Document' : 'New Document'}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl">✕</button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-gray-500">Person</label>
            <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none" value={form.person} onChange={e => set('person', e.target.value)}>
              {FAMILY.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-500">Country</label>
            <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none" value={form.country} onChange={e => set('country', e.target.value)}>
              {COUNTRIES.map(c => <option key={c}>{COUNTRY_FLAGS[c]} {c}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-gray-500">Document type</label>
          <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none" value={form.type} onChange={e => set('type', e.target.value)}>
            {DOC_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-gray-500">Document number</label>
          <input className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-yellow-500/50 placeholder-gray-600" placeholder="FE123456" value={form.number} onChange={e => set('number', e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-gray-500">Issued</label>
            <input type="date" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-yellow-500/50" value={form.issued} onChange={e => set('issued', e.target.value)} />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-500">Expires</label>
            <input type="date" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-yellow-500/50" value={form.expires} onChange={e => set('expires', e.target.value)} />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-gray-500">Notes</label>
          <textarea className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-yellow-500/50 placeholder-gray-600 resize-none" rows={2} placeholder="Доп. информация, ссылки, особые условия..." value={form.note} onChange={e => set('note', e.target.value)} />
        </div>

        <button onClick={() => { if (!form.type) return; onSave(form); onClose() }} className="w-full py-2 rounded-lg bg-yellow-500/20 text-yellow-400 text-sm font-medium hover:bg-yellow-500/30 transition-colors">Save</button>
      </div>
    </div>
  )
}

// --- Doc Card ---
function DocCard({ doc, onEdit, onDelete, onFilesChange }) {
  const status = getExpiryStatus(doc.expires)
  const cfg = statusCfg[status]
  const days = doc.expires ? daysUntil(doc.expires) : null

  return (
    <div className={`p-4 rounded-xl bg-gray-900 border ${cfg.border}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${cfg.dot}`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-white font-medium">{doc.type}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1 flex items-center gap-2 flex-wrap">
              <span className="text-gray-300">{doc.person}</span>
              {doc.number && <><span>·</span><span>{doc.number}</span></>}
            </div>
            {doc.expires && (
              <div className={`text-xs mt-1 ${cfg.text}`}>
                {status === 'expired'
                  ? `Просрочен ${Math.abs(days)} дн. назад · ${doc.expires}`
                  : status === 'expiring'
                  ? `Истекает через ${days} дн. · ${doc.expires}`
                  : `Действует до ${doc.expires}`
                }
              </div>
            )}
            {doc.issued && <div className="text-xs text-gray-600 mt-0.5">Выдан: {doc.issued}</div>}
            {doc.note && <div className="text-xs text-gray-500 mt-1 italic">{doc.note}</div>}
          </div>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          <button onClick={onEdit} className="p-1.5 rounded-lg text-gray-600 hover:text-yellow-400 hover:bg-yellow-500/10 text-xs transition-colors">✎</button>
          <button onClick={onDelete} className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 text-xs transition-colors">✕</button>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-800">
        <FileAttachments files={doc.files ?? []} onChange={onFilesChange} />
      </div>
    </div>
  )
}

// --- Country Card (level 1) ---
function CountryCard({ country, docs, onClick }) {
  const expired = docs.filter(d => getExpiryStatus(d.expires) === 'expired').length
  const expiring = docs.filter(d => getExpiryStatus(d.expires) === 'expiring').length
  const people = [...new Set(docs.map(d => d.person))]

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
          <div className="text-lg font-bold text-white">{docs.length}</div>
          <div className="text-xs text-gray-600">документов</div>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {people.map(p => (
          <span key={p} className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">{p}</span>
        ))}
        {docs.length === 0 && <span className="text-xs text-gray-700">Нет документов</span>}
      </div>
      {(expired > 0 || expiring > 0) && (
        <div className="flex gap-2 mt-2">
          {expired > 0 && <span className="text-xs text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">⚠ {expired} просрочено</span>}
          {expiring > 0 && <span className="text-xs text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded-full">⏳ {expiring} истекает</span>}
        </div>
      )}
    </button>
  )
}

// --- Main ---
function load(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback } catch { return fallback }
}

function CountryDocs() {
  const [docs, setDocs] = useState(() => load('country-docs-v2', defaultDocs))
  const [view, setView] = useState('countries') // 'countries' | 'people'
  const [selectedCountry, setSelectedCountry] = useState(null) // null = show all countries
  const [selectedPerson, setSelectedPerson] = useState(null) // null = show all people
  const [filterPerson, setFilterPerson] = useState('all') // filter inside country view
  const [filterCountry, setFilterCountry] = useState('all') // filter inside person view
  const [modal, setModal] = useState(null)

  useEffect(() => { localStorage.setItem('country-docs-v2', JSON.stringify(docs)) }, [docs])

  function handleSave(form) {
    if (modal === 'new') {
      setDocs(prev => [{ ...form, id: Date.now(), files: [] }, ...prev])
    } else {
      setDocs(prev => prev.map(d => d.id === modal.id ? { ...modal, ...form } : d))
    }
  }

  function handleDelete(id) {
    if (window.confirm('Удалить документ?')) setDocs(prev => prev.filter(d => d.id !== id))
  }

  function updateFiles(id, files) {
    setDocs(prev => prev.map(d => d.id === id ? { ...d, files } : d))
  }

  const totalExpired = docs.filter(d => getExpiryStatus(d.expires) === 'expired').length
  const totalExpiring = docs.filter(d => getExpiryStatus(d.expires) === 'expiring').length

  // --- Country detail view ---
  if (selectedCountry) {
    const countryDocs = docs
      .filter(d => d.country === selectedCountry)
      .filter(d => filterPerson === 'all' || d.person === filterPerson)
      .sort((a, b) => {
        const order = { expired: 0, expiring: 1, valid: 2, unknown: 3 }
        return order[getExpiryStatus(a.expires)] - order[getExpiryStatus(b.expires)]
      })

    const peopleInCountry = [...new Set(docs.filter(d => d.country === selectedCountry).map(d => d.person))]

    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={() => { setSelectedCountry(null); setFilterPerson('all') }} className="text-gray-500 hover:text-white text-sm transition-colors">← Назад</button>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{COUNTRY_FLAGS[selectedCountry]}</span>
            <div>
              <h1 className="text-xl font-bold text-white">{COUNTRY_NAMES[selectedCountry]}</h1>
              <p className="text-xs text-gray-500">{selectedCountry}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex gap-2 flex-wrap">
            <select value={filterPerson} onChange={e => setFilterPerson(e.target.value)} className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white outline-none">
              <option value="all">Все люди</option>
              {peopleInCountry.map(p => <option key={p}>{p}</option>)}
              {FAMILY.filter(p => !peopleInCountry.includes(p)).map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <button onClick={() => setModal('new')} className="text-sm px-4 py-2 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors">
            + Добавить документ
          </button>
        </div>

        <div className="text-xs text-gray-600">{countryDocs.length} документов</div>

        <div className="space-y-3">
          {countryDocs.length === 0 && <div className="text-gray-600 text-sm py-8 text-center">Нет документов</div>}
          {countryDocs.map(doc => (
            <DocCard key={doc.id} doc={doc}
              onEdit={() => setModal(doc)}
              onDelete={() => handleDelete(doc.id)}
              onFilesChange={files => updateFiles(doc.id, files)}
            />
          ))}
        </div>

        {modal && (
          <DocModal
            initial={modal === 'new' ? null : modal}
            defaultCountry={selectedCountry}
            defaultPerson={filterPerson !== 'all' ? filterPerson : undefined}
            onClose={() => setModal(null)}
            onSave={handleSave}
          />
        )}
      </div>
    )
  }

  // --- Person detail view ---
  if (selectedPerson) {
    const personDocs = docs
      .filter(d => d.person === selectedPerson)
      .filter(d => filterCountry === 'all' || d.country === filterCountry)
      .sort((a, b) => {
        const order = { expired: 0, expiring: 1, valid: 2, unknown: 3 }
        return order[getExpiryStatus(a.expires)] - order[getExpiryStatus(b.expires)]
      })

    const countriesForPerson = [...new Set(docs.filter(d => d.person === selectedPerson).map(d => d.country))]

    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={() => { setSelectedPerson(null); setFilterCountry('all') }} className="text-gray-500 hover:text-white text-sm transition-colors">← Назад</button>
          <h1 className="text-xl font-bold text-white">{selectedPerson}</h1>
        </div>

        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex gap-2 flex-wrap">
            <select value={filterCountry} onChange={e => setFilterCountry(e.target.value)} className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white outline-none">
              <option value="all">Все страны</option>
              {countriesForPerson.map(c => <option key={c}>{COUNTRY_FLAGS[c]} {c}</option>)}
            </select>
          </div>
          <button onClick={() => setModal('new')} className="text-sm px-4 py-2 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors">
            + Добавить документ
          </button>
        </div>

        <div className="space-y-3">
          {personDocs.length === 0 && <div className="text-gray-600 text-sm py-8 text-center">Нет документов</div>}
          {personDocs.map(doc => (
            <DocCard key={doc.id} doc={doc}
              onEdit={() => setModal(doc)}
              onDelete={() => handleDelete(doc.id)}
              onFilesChange={files => updateFiles(doc.id, files)}
            />
          ))}
        </div>

        {modal && (
          <DocModal
            initial={modal === 'new' ? null : modal}
            defaultPerson={selectedPerson}
            onClose={() => setModal(null)}
            onSave={handleSave}
          />
        )}
      </div>
    )
  }

  // --- Top level view ---
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Country Docs</h1>
        <p className="text-gray-500 text-sm mt-1">Документы семьи по странам</p>
      </div>

      {(totalExpired > 0 || totalExpiring > 0) && (
        <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/20 text-sm flex items-center gap-3">
          <span className="text-red-400">⚠</span>
          <span>
            {totalExpired > 0 && <span className="text-red-300 font-medium">{totalExpired} просрочено</span>}
            {totalExpired > 0 && totalExpiring > 0 && <span className="text-gray-600"> · </span>}
            {totalExpiring > 0 && <span className="text-yellow-300 font-medium">{totalExpiring} истекает в течение 3 месяцев</span>}
          </span>
        </div>
      )}

      {/* View toggle */}
      <div className="flex gap-1 bg-gray-900 p-1 rounded-xl w-fit">
        <button onClick={() => setView('countries')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'countries' ? 'bg-yellow-500/10 text-yellow-400' : 'text-gray-500 hover:text-gray-300'}`}>
          🌍 По странам
        </button>
        <button onClick={() => setView('people')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'people' ? 'bg-yellow-500/10 text-yellow-400' : 'text-gray-500 hover:text-gray-300'}`}>
          👤 По людям
        </button>
      </div>

      {/* Countries view */}
      {view === 'countries' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {COUNTRIES.map(country => (
            <CountryCard
              key={country}
              country={country}
              docs={docs.filter(d => d.country === country)}
              onClick={() => setSelectedCountry(country)}
            />
          ))}
        </div>
      )}

      {/* People view */}
      {view === 'people' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {FAMILY.map(person => {
            const personDocs = docs.filter(d => d.person === person)
            const countries = [...new Set(personDocs.map(d => d.country))]
            const expired = personDocs.filter(d => getExpiryStatus(d.expires) === 'expired').length
            const expiring = personDocs.filter(d => getExpiryStatus(d.expires) === 'expiring').length
            return (
              <button key={person} onClick={() => setSelectedPerson(person)} className="p-4 rounded-xl bg-gray-900 border border-gray-800 hover:border-gray-600 transition-colors text-center">
                <div className="text-3xl mb-2">👤</div>
                <div className="text-sm font-medium text-white">{person}</div>
                <div className="text-xs text-gray-600 mt-1">{personDocs.length} документов</div>
                <div className="flex gap-1 justify-center mt-2 flex-wrap">
                  {countries.map(c => <span key={c} className="text-xs">{COUNTRY_FLAGS[c]}</span>)}
                </div>
                {(expired > 0 || expiring > 0) && (
                  <div className="mt-2 space-y-1">
                    {expired > 0 && <div className="text-xs text-red-400">⚠ {expired} просрочено</div>}
                    {expiring > 0 && <div className="text-xs text-yellow-400">⏳ {expiring} истекает</div>}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default CountryDocs
