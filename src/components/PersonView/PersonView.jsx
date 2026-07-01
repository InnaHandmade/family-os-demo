import { useState } from 'react'
import { loadData, COUNTRY_FLAGS, COUNTRY_NAMES } from '../../lib/data'

// ─── helpers ─────────────────────────────────────────────────────────────────

function expiryStatus(expires) {
  if (!expires) return null
  const days = Math.floor((new Date(expires) - new Date()) / 86400000)
  if (days < 0)  return { label: `Просрочен ${Math.abs(days)} дн.`, color: 'text-red-400 bg-red-500/10 border-red-500/30' }
  if (days < 90) return { label: `Истекает через ${days} дн.`, color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' }
  return { label: `до ${expires}`, color: 'text-green-400 bg-green-500/10 border-green-500/30' }
}

const TYPE_ICONS = {
  'Doctor Visit': '🩺', 'Surgery/Procedure': '🏥', 'Vaccination': '💉',
  'Test/Analysis': '🔬', 'Diagnosis': '📋', 'Hospital Stay': '🛏',
  'Prescription': '💊', 'Insurance': '🛡', 'Screening': '📊', 'Other': '📁',
}

const EDU_STATUS = {
  'In Progress': 'text-blue-400 bg-blue-500/10',
  'Completed':   'text-green-400 bg-green-500/10',
  'On Hold':     'text-yellow-400 bg-yellow-500/10',
  'Dropped':     'text-gray-400 bg-gray-500/10',
}

// ─── sub-sections ─────────────────────────────────────────────────────────────

function DocCard({ doc }) {
  const status = expiryStatus(doc.expires)
  return (
    <div className="p-3 rounded-lg bg-gray-900 border border-gray-800 space-y-1">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-sm font-medium text-white">{doc.type}</span>
        <span className="text-xs text-gray-500">{COUNTRY_FLAGS[doc.country]} {COUNTRY_NAMES[doc.country] ?? doc.country}</span>
      </div>
      {doc.docNumber && <div className="text-xs text-gray-500">№ {doc.docNumber}</div>}
      {status && (
        <span className={`inline-block text-xs px-2 py-0.5 rounded border ${status.color}`}>{status.label}</span>
      )}
    </div>
  )
}

function MedCard({ rec }) {
  const icon = TYPE_ICONS[rec.type] ?? '📁'
  const [d, m, y] = rec.date ? rec.date.split('-').reverse() : ['—', '—', '—']
  return (
    <div className="p-3 rounded-lg bg-gray-900 border border-gray-800 flex gap-3">
      <div className="text-center min-w-[40px]">
        <div className="text-base font-bold text-white">{d}.{m}</div>
        <div className="text-xs text-gray-600">{y}</div>
      </div>
      <div className="flex-1 min-w-0 space-y-0.5">
        <div className="flex items-center gap-2">
          <span>{icon}</span>
          <span className="text-sm font-medium text-white truncate">{rec.title || rec.type}</span>
        </div>
        {rec.institution && <div className="text-xs text-gray-500">{rec.institution}</div>}
        {rec.country && <div className="text-xs text-gray-600">{COUNTRY_FLAGS[rec.country]} {COUNTRY_NAMES[rec.country] ?? rec.country}</div>}
        {rec.nextDate && (
          <div className="text-xs text-yellow-400">📅 Следующий приём: {rec.nextDate}</div>
        )}
      </div>
    </div>
  )
}

function EduCard({ rec }) {
  const statusClass = EDU_STATUS[rec.status] ?? 'text-gray-400 bg-gray-500/10'
  return (
    <div className="p-3 rounded-lg bg-gray-900 border border-gray-800 space-y-1">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-sm font-medium text-white">{rec.program || rec.type}</span>
        <span className={`text-xs px-2 py-0.5 rounded ${statusClass}`}>{rec.status}</span>
      </div>
      {rec.institution && <div className="text-xs text-gray-500">{rec.institution}</div>}
      <div className="flex items-center gap-3 text-xs text-gray-600">
        {rec.country && <span>{COUNTRY_FLAGS[rec.country]} {COUNTRY_NAMES[rec.country] ?? rec.country}</span>}
        {rec.dateFrom && <span>{rec.dateFrom}{rec.dateTo ? ` → ${rec.dateTo}` : ''}</span>}
      </div>
    </div>
  )
}

// ─── tab button ──────────────────────────────────────────────────────────────

function Tab({ label, count, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
        active
          ? 'bg-yellow-500/20 text-yellow-400'
          : 'text-gray-500 hover:text-gray-300'
      }`}
    >
      {label}
      {count > 0 && (
        <span className={`text-xs px-1.5 py-0.5 rounded-full ${active ? 'bg-yellow-500/20 text-yellow-300' : 'bg-gray-800 text-gray-500'}`}>
          {count}
        </span>
      )}
    </button>
  )
}

// ─── countries summary ────────────────────────────────────────────────────────

function CountriesSummary({ docs }) {
  const countryCounts = {}
  docs.forEach(d => {
    countryCounts[d.country] = (countryCounts[d.country] ?? 0) + 1
  })
  const entries = Object.entries(countryCounts)
  if (!entries.length) return null
  return (
    <div className="flex flex-wrap gap-2">
      {entries.map(([c, n]) => (
        <span key={c} className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-lg">
          {COUNTRY_FLAGS[c]} {COUNTRY_NAMES[c] ?? c} · {n} doc
        </span>
      ))}
    </div>
  )
}

// ─── main ─────────────────────────────────────────────────────────────────────

const EMOJI_BY_NAME = {
  Anna: '👩', Max: '👦', Leo: '👦', Helen: '👵', Mark: '👨',
}

export default function PersonView({ name, onBack }) {
  const [tab, setTab] = useState('docs')

  // load all data filtered by person name
  const allDocs  = loadData('country-docs-v2', []).filter(d => d.person === name)
  const allMed   = loadData('medical-v1',      []).filter(d => d.person === name)
  const allEdu   = loadData('education-v1',    []).filter(d => d.person === name)

  // sort medical by date desc
  const medSorted = [...allMed].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))

  // urgent docs
  const urgentDocs = allDocs.filter(d => {
    if (!d.expires) return false
    return Math.floor((new Date(d.expires) - new Date()) / 86400000) < 90
  })

  const emoji = EMOJI_BY_NAME[name] ?? '👤'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="text-gray-500 hover:text-gray-300 transition-colors text-sm flex items-center gap-1"
        >
          ← назад
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-5xl">{emoji}</div>
        <div>
          <h1 className="text-2xl font-bold text-white">{name}</h1>
          <div className="flex gap-4 text-sm text-gray-500 mt-1">
            <span>📄 {allDocs.length} документов</span>
            <span>🩺 {allMed.length} медзаписей</span>
            <span>🎓 {allEdu.length} образование</span>
          </div>
        </div>
      </div>

      {/* Alert if urgent docs */}
      {urgentDocs.length > 0 && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          ⚠ {urgentDocs.length} документ{urgentDocs.length > 1 ? 'а' : ''} требует внимания
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-800 pb-2 flex-wrap">
        <Tab label="Документы"    count={allDocs.length}  active={tab === 'docs'}    onClick={() => setTab('docs')} />
        <Tab label="Медицина"     count={allMed.length}   active={tab === 'medical'} onClick={() => setTab('medical')} />
        <Tab label="Образование"  count={allEdu.length}   active={tab === 'edu'}     onClick={() => setTab('edu')} />
      </div>

      {/* Tab content */}
      {tab === 'docs' && (
        <div className="space-y-4">
          {allDocs.length === 0 ? (
            <p className="text-gray-600 text-sm">Нет документов</p>
          ) : (
            <>
              <CountriesSummary docs={allDocs} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {allDocs.map((d, i) => <DocCard key={i} doc={d} />)}
              </div>
            </>
          )}
        </div>
      )}

      {tab === 'medical' && (
        <div className="space-y-3">
          {medSorted.length === 0 ? (
            <p className="text-gray-600 text-sm">Нет медицинских записей</p>
          ) : (
            medSorted.map((r, i) => <MedCard key={i} rec={r} />)
          )}
        </div>
      )}

      {tab === 'edu' && (
        <div className="space-y-3">
          {allEdu.length === 0 ? (
            <p className="text-gray-600 text-sm">Нет записей об образовании</p>
          ) : (
            allEdu.map((r, i) => <EduCard key={i} rec={r} />)
          )}
        </div>
      )}
    </div>
  )
}
