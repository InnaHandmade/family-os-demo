import { useState, useEffect } from 'react'
import { DEFAULT_FAMILY, loadData, saveData } from '../../lib/data'

const colorMap = {
  yellow: 'text-yellow-400 bg-yellow-500/10 border border-yellow-500/20',
  red: 'text-red-400 bg-red-500/10 border border-red-500/20',
  blue: 'text-blue-400 bg-blue-500/10 border border-blue-500/20',
  green: 'text-green-400 bg-green-500/10 border border-green-500/20',
}

// --- Compute urgent items from real data ---
function getUrgentItems() {
  const items = []
  const now = new Date()

  // Country Docs — expiring within 90 days or expired
  const docs = loadData('country-docs-v2', [])
  docs.forEach(doc => {
    if (!doc.expires) return
    const days = Math.floor((new Date(doc.expires) - now) / 86400000)
    if (days < 90) {
      items.push({
        who: doc.person,
        what: `${doc.type} · ${doc.country}`,
        detail: days < 0
          ? `Просрочен ${Math.abs(days)} дн. назад`
          : `Истекает через ${days} дн. · ${doc.expires}`,
        type: 'warning',
        module: 'country-docs',
        priority: days < 0 ? -1 : days,
      })
    }
  })

  // Medical — upcoming appointments within 60 days
  const medRecords = loadData('medical-v1', [])
  medRecords.forEach(rec => {
    if (!rec.nextDate) return
    const days = Math.floor((new Date(rec.nextDate) - now) / 86400000)
    if (days >= 0 && days <= 60) {
      items.push({
        who: rec.person,
        what: rec.title || rec.type,
        detail: `Запланировано: ${rec.nextDate}`,
        type: 'info',
        module: 'medical',
        priority: days + 1000,
      })
    }
  })

  // Business — contracts on renewal
  const contracts = loadData('biz-contracts', [])
  contracts.forEach(c => {
    if (c.status === 'Renewal') {
      items.push({
        who: c.company,
        what: `Контракт · ${c.client}`,
        detail: `Renewal до ${c.until}`,
        type: 'warning',
        module: 'business',
        priority: 500,
      })
    }
  })

  // Business — overdue invoices
  const invoices = loadData('biz-invoices', [])
  invoices.forEach(inv => {
    if (inv.status === 'Overdue') {
      items.push({
        who: inv.client,
        what: `Инвойс ${inv.id}`,
        detail: `Просрочен · ${inv.amount} ${inv.currency ?? ''}`,
        type: 'warning',
        module: 'business',
        priority: -2,
      })
    }
  })

  // Sort: most urgent first
  return items.sort((a, b) => a.priority - b.priority).slice(0, 8)
}

// --- Module cards with real counts ---
function getModuleCards() {
  const docs = loadData('country-docs-v2', [])
  const medRecords = loadData('medical-v1', [])
  const eduRecords = loadData('education-v1', [])
  const companies = loadData('biz-companies', [])

  return [
    { id: 'business', label: 'Business', icon: '◈', count: companies.length, unit: 'компании', color: 'yellow' },
    { id: 'medical', label: 'Medical', icon: '♡', count: medRecords.length, unit: 'записей', color: 'red' },
    { id: 'education', label: 'Education', icon: '◎', count: eduRecords.length, unit: 'записей', color: 'blue' },
    { id: 'country-docs', label: 'Country Docs', icon: '⊙', count: docs.length, unit: 'документов', color: 'green' },
  ]
}

// --- Family cards ---
function FamilyCard({ person, onNameChange, onOpen }) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(person.name)

  function handleBlur() {
    setEditing(false)
    if (value.trim()) onNameChange(person.id, value.trim())
    else setValue(person.name)
  }

  function handleEditClick(e) {
    e.stopPropagation()
    setEditing(true)
  }

  return (
    <div
      onClick={() => !editing && onOpen(person.name)}
      className="p-4 rounded-xl bg-gray-900 border border-gray-800 text-center cursor-pointer hover:border-yellow-500/40 hover:bg-gray-800/60 transition-all group"
    >
      <div className="text-3xl mb-2">{person.emoji}</div>
      {editing ? (
        <input autoFocus value={value} onChange={e => setValue(e.target.value)}
          onBlur={handleBlur} onKeyDown={e => e.key === 'Enter' && handleBlur()}
          onClick={e => e.stopPropagation()}
          className="bg-gray-800 text-white text-sm font-medium text-center rounded px-2 py-0.5 w-full outline-none border border-yellow-500/50"
        />
      ) : (
        <div className="flex items-center justify-center gap-1">
          <span className="text-sm font-medium text-white group-hover:text-yellow-400 transition-colors">
            {person.name}
          </span>
          <button
            onClick={handleEditClick}
            title="Переименовать"
            className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-gray-400 transition-all text-xs leading-none"
          >
            ✎
          </button>
        </div>
      )}
      <div className="text-xs text-gray-600 mt-1">{person.role}</div>
      <div className="flex gap-1 justify-center mt-2 flex-wrap">
        {(person.countries ?? []).map(c => (
          <span key={c} className="text-xs bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded">{c}</span>
        ))}
      </div>
    </div>
  )
}

function AddFamilyCard({ onAdd }) {
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')

  function handleAdd() {
    if (name.trim()) { onAdd(name.trim()); setName(''); setAdding(false) }
  }

  if (adding) {
    return (
      <div className="p-4 rounded-xl bg-gray-900 border border-yellow-500/30 text-center">
        <div className="text-3xl mb-2">👤</div>
        <input autoFocus value={name} onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()} placeholder="Имя"
          className="bg-gray-800 text-white text-sm text-center rounded px-2 py-0.5 w-full outline-none border border-yellow-500/50 placeholder-gray-600"
        />
        <div className="flex gap-2 mt-3">
          <button onClick={handleAdd} className="flex-1 text-xs bg-yellow-500/20 text-yellow-400 rounded py-1 hover:bg-yellow-500/30">OK</button>
          <button onClick={() => { setAdding(false); setName('') }} className="flex-1 text-xs bg-gray-800 text-gray-500 rounded py-1 hover:bg-gray-700">✕</button>
        </div>
      </div>
    )
  }

  return (
    <button onClick={() => setAdding(true)}
      className="p-4 rounded-xl bg-gray-900 border border-dashed border-gray-700 text-center hover:border-yellow-500/40 transition-colors w-full">
      <div className="text-3xl mb-2 text-gray-600">+</div>
      <div className="text-sm text-gray-600">Добавить</div>
    </button>
  )
}

// --- Dashboard ---
function Dashboard({ onNavigate }) {
  const [family, setFamily] = useState(() => loadData('family-members', DEFAULT_FAMILY))
  const [urgent, setUrgent] = useState([])
  const [moduleCards, setModuleCards] = useState([])

  // Refresh real data on mount
  useEffect(() => {
    setUrgent(getUrgentItems())
    setModuleCards(getModuleCards())
  }, [])

  useEffect(() => { saveData('family-members', family) }, [family])

  function handleNameChange(id, newName) {
    setFamily(prev => prev.map(p => p.id === id ? { ...p, name: newName } : p))
  }

  function handleAdd(name) {
    setFamily(prev => [...prev, { id: `person-${Date.now()}`, name, role: 'Member', emoji: '👤', countries: [] }])
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Обзор Family OS</p>
      </div>

      {/* Module cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {moduleCards.map(m => (
          <button key={m.id} onClick={() => onNavigate(m.id)}
            className={`p-4 rounded-xl text-left transition-opacity hover:opacity-80 ${colorMap[m.color]}`}>
            <div className="text-2xl mb-2">{m.icon}</div>
            <div className="text-xs font-semibold uppercase tracking-wider opacity-70">{m.label}</div>
            <div className="text-2xl font-bold mt-1">{m.count}</div>
            <div className="text-xs opacity-60">{m.unit}</div>
          </button>
        ))}
      </div>

      {/* Urgent */}
      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">⚠ Требует внимания</h2>
        {urgent.length === 0 ? (
          <div className="text-gray-600 text-sm py-4">Всё в порядке 🎉</div>
        ) : (
          <div className="space-y-2">
            {urgent.map((item, i) => (
              <button key={i} onClick={() => onNavigate(item.module)}
                className="w-full flex items-center gap-4 p-3 rounded-lg bg-gray-900 border border-gray-800 hover:border-gray-700 transition-colors text-left">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${item.type === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white font-medium">{item.what}</div>
                  <div className="text-xs text-gray-500">{item.detail}</div>
                </div>
                <span className="text-xs text-gray-600 flex-shrink-0">{item.who}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Family members */}
      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">👨‍👩‍👧‍👦 Семья</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {family.map(person => (
            <FamilyCard key={person.id} person={person} onNameChange={handleNameChange} onOpen={name => onNavigate('person:' + name)} />
          ))}
          <AddFamilyCard onAdd={handleAdd} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
