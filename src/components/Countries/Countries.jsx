import { useMemo } from 'react'
import { COUNTRIES, COUNTRY_NAMES, COUNTRY_FLAGS, loadData, getFamily } from '../../lib/data'

// ─── helpers ──────────────────────────────────────────────────────────────────

function expiryBucket(expires) {
  if (!expires) return null
  const days = Math.floor((new Date(expires) - new Date()) / 86400000)
  if (days < 0)  return 'expired'
  if (days < 90) return 'soon'
  return 'ok'
}

function buildCountryStats() {
  const docs    = loadData('country-docs-v2', [])
  const medical = loadData('medical-v1',      [])
  const edu     = loadData('education-v1',    [])
  const family  = getFamily()

  const stats = {}

  COUNTRIES.forEach(c => {
    stats[c] = {
      code: c,
      flag: COUNTRY_FLAGS[c],
      name: COUNTRY_NAMES[c],
      people: [],
      docs:    { total: 0, expired: 0, soon: 0 },
      medical: 0,
      edu:     0,
    }
  })

  // People per country (from family.countries array)
  family.forEach(person => {
    (person.countries ?? []).forEach(c => {
      if (stats[c]) {
        if (!stats[c].people.find(p => p.id === person.id)) {
          stats[c].people.push(person)
        }
      }
    })
  })

  // Docs
  docs.forEach(d => {
    if (!stats[d.country]) return
    stats[d.country].docs.total++
    const bucket = expiryBucket(d.expires)
    if (bucket === 'expired') stats[d.country].docs.expired++
    if (bucket === 'soon')    stats[d.country].docs.soon++
    // Also count person as present in country via docs
    const person = family.find(p => p.name === d.person)
    if (person && !stats[d.country].people.find(p => p.id === person.id)) {
      stats[d.country].people.push(person)
    }
  })

  // Medical
  medical.forEach(r => {
    if (stats[r.country]) stats[r.country].medical++
  })

  // Education
  edu.forEach(r => {
    if (stats[r.country]) stats[r.country].edu++
  })

  // Return only countries that have any data
  return Object.values(stats).filter(s =>
    s.people.length > 0 || s.docs.total > 0 || s.medical > 0 || s.edu > 0
  )
}

// ─── stat pill ────────────────────────────────────────────────────────────────

function StatPill({ icon, count, label, color = 'text-gray-500' }) {
  if (!count) return null
  return (
    <div className="flex items-center gap-1">
      <span className="text-xs">{icon}</span>
      <span className={`text-xs font-medium ${color}`}>{count}</span>
      <span className="text-xs text-gray-600">{label}</span>
    </div>
  )
}

// ─── country card ─────────────────────────────────────────────────────────────

function CountryCard({ stat }) {
  const hasAlert = stat.docs.expired > 0 || stat.docs.soon > 0

  return (
    <div className={`p-5 rounded-2xl bg-gray-900 border transition-colors ${
      stat.docs.expired > 0 ? 'border-red-500/30' :
      stat.docs.soon > 0   ? 'border-yellow-500/30' :
      'border-gray-800'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{stat.flag}</span>
          <div>
            <h3 className="text-white font-semibold text-base leading-tight">{stat.name}</h3>
            <span className="text-xs text-gray-600 font-mono">{stat.code}</span>
          </div>
        </div>
        {hasAlert && (
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            {stat.docs.expired > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                {stat.docs.expired} просрочен{stat.docs.expired > 1 ? 'о' : ''}
              </span>
            )}
            {stat.docs.soon > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                {stat.docs.soon} истекает
              </span>
            )}
          </div>
        )}
      </div>

      {/* People */}
      {stat.people.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {stat.people.map(p => (
            <span key={p.id} className="flex items-center gap-1 text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-lg">
              <span>{p.emoji}</span>
              <span>{p.name}</span>
            </span>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="flex flex-wrap gap-3 pt-3 border-t border-gray-800">
        <StatPill icon="📄" count={stat.docs.total}  label="docs"    color={stat.docs.expired > 0 ? 'text-red-400' : stat.docs.soon > 0 ? 'text-yellow-400' : 'text-gray-300'} />
        <StatPill icon="🩺" count={stat.medical}      label="medical" color="text-gray-300" />
        <StatPill icon="🎓" count={stat.edu}           label="edu"     color="text-gray-300" />
        {stat.docs.total === 0 && stat.medical === 0 && stat.edu === 0 && (
          <span className="text-xs text-gray-700">нет записей</span>
        )}
      </div>
    </div>
  )
}

// ─── summary bar ──────────────────────────────────────────────────────────────

function SummaryBar({ stats }) {
  const totalCountries = stats.length
  const totalPeople    = [...new Map(stats.flatMap(s => s.people).map(p => [p.id, p])).values()].length
  const totalDocs      = stats.reduce((a, s) => a + s.docs.total, 0)
  const totalExpired   = stats.reduce((a, s) => a + s.docs.expired, 0)
  const totalSoon      = stats.reduce((a, s) => a + s.docs.soon, 0)

  return (
    <div className="flex flex-wrap gap-4 text-sm">
      <span className="text-gray-400"><span className="text-white font-bold">{totalCountries}</span> стран</span>
      <span className="text-gray-400"><span className="text-white font-bold">{totalPeople}</span> людей</span>
      <span className="text-gray-400"><span className="text-white font-bold">{totalDocs}</span> документов</span>
      {totalExpired > 0 && (
        <span className="text-red-400 font-medium">⚠ {totalExpired} просрочен{totalExpired > 1 ? 'о' : ''}</span>
      )}
      {totalSoon > 0 && (
        <span className="text-yellow-400 font-medium">⏳ {totalSoon} скоро истекает</span>
      )}
    </div>
  )
}

// ─── main ─────────────────────────────────────────────────────────────────────

export default function Countries() {
  const stats = useMemo(() => buildCountryStats(), [])

  if (stats.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-white">Countries</h1>
        <p className="text-gray-600 text-sm">Нет данных. Загрузи демо-данные на Dashboard.</p>
      </div>
    )
  }

  // Sort: countries with alerts first, then by people count
  const sorted = [...stats].sort((a, b) => {
    const aAlert = a.docs.expired * 2 + a.docs.soon
    const bAlert = b.docs.expired * 2 + b.docs.soon
    if (bAlert !== aAlert) return bAlert - aAlert
    return b.people.length - a.people.length
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Countries</h1>
        <p className="text-gray-500 text-sm mt-1">Обзор по странам присутствия</p>
      </div>

      <SummaryBar stats={stats} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.map(s => <CountryCard key={s.code} stat={s} />)}
      </div>
    </div>
  )
}
