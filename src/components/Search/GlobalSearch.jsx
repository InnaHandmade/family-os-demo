import { useState, useEffect, useRef, useCallback } from 'react'
import { loadData, COUNTRY_FLAGS } from '../../lib/data'

// ─── index all data ────────────────────────────────────────────────────────────

function buildIndex() {
  const results = []

  // Country Docs
  loadData('country-docs-v2', []).forEach((d, i) => {
    results.push({
      id: `docs-${i}`,
      module: 'country-docs',
      icon: '📄',
      title: d.type,
      sub: [d.person, COUNTRY_FLAGS[d.country], d.country, d.docNumber].filter(Boolean).join(' · '),
      search: [d.type, d.person, d.country, d.docNumber, d.note].join(' ').toLowerCase(),
    })
  })

  // Medical
  loadData('medical-v1', []).forEach((d, i) => {
    results.push({
      id: `med-${i}`,
      module: 'medical',
      icon: '🩺',
      title: d.title || d.type,
      sub: [d.person, d.institution, d.doctor, COUNTRY_FLAGS[d.country]].filter(Boolean).join(' · '),
      search: [d.title, d.type, d.person, d.institution, d.doctor, d.country, d.description].join(' ').toLowerCase(),
    })
  })

  // Education
  loadData('education-v1', []).forEach((d, i) => {
    results.push({
      id: `edu-${i}`,
      module: 'education',
      icon: '🎓',
      title: d.program || d.type,
      sub: [d.person, d.institution, COUNTRY_FLAGS[d.country], d.status].filter(Boolean).join(' · '),
      search: [d.program, d.type, d.person, d.institution, d.country, d.status].join(' ').toLowerCase(),
    })
  })

  // Business — Companies
  loadData('biz-companies', []).forEach((d, i) => {
    results.push({
      id: `biz-co-${i}`,
      module: 'business',
      icon: '◈',
      title: d.name,
      sub: [d.type, d.country, d.status].filter(Boolean).join(' · '),
      search: [d.name, d.type, d.country, d.status, d.note].join(' ').toLowerCase(),
    })
  })

  // Business — Contracts
  loadData('biz-contracts', []).forEach((d, i) => {
    results.push({
      id: `biz-ct-${i}`,
      module: 'business',
      icon: '📝',
      title: `Контракт · ${d.client || ''}`,
      sub: [d.company, d.type, d.status].filter(Boolean).join(' · '),
      search: [d.client, d.company, d.type, d.status, d.note].join(' ').toLowerCase(),
    })
  })

  // Business — Invoices
  loadData('biz-invoices', []).forEach((d, i) => {
    results.push({
      id: `biz-inv-${i}`,
      module: 'business',
      icon: '💳',
      title: `${d.id || 'Invoice'} · ${d.client || ''}`,
      sub: [d.company, d.status, d.amount ? `${d.amount} ${d.currency ?? ''}` : null].filter(Boolean).join(' · '),
      search: [d.id, d.client, d.company, d.description, d.status].join(' ').toLowerCase(),
    })
  })

  return results
}

const MODULE_LABELS = {
  'country-docs': 'Country Docs',
  medical: 'Medical',
  education: 'Education',
  business: 'Business',
}

// ─── component ────────────────────────────────────────────────────────────────

export default function GlobalSearch({ onNavigate, onClose }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [selected, setSelected] = useState(0)
  const inputRef = useRef(null)
  const indexRef = useRef(null)

  // build index once on open
  useEffect(() => {
    indexRef.current = buildIndex()
    inputRef.current?.focus()
  }, [])

  // filter on query change
  useEffect(() => {
    if (!query.trim()) { setResults([]); setSelected(0); return }
    const q = query.toLowerCase().trim()
    const filtered = (indexRef.current ?? [])
      .filter(r => r.search.includes(q))
      .slice(0, 12)
    setResults(filtered)
    setSelected(0)
  }, [query])

  function handleSelect(result) {
    onNavigate(result.module)
    onClose()
  }

  // keyboard navigation
  function handleKeyDown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelected(s => Math.min(s + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelected(s => Math.max(s - 1, 0))
    } else if (e.key === 'Enter' && results[selected]) {
      handleSelect(results[selected])
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  // Group results by module
  const grouped = {}
  results.forEach(r => {
    if (!grouped[r.module]) grouped[r.module] = []
    grouped[r.module].push(r)
  })

  let flatIndex = 0

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative w-full max-w-xl bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800">
          <svg className="text-gray-500 flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Поиск по всему..."
            className="flex-1 bg-transparent text-white placeholder-gray-600 outline-none text-sm"
          />
          <kbd className="text-xs text-gray-600 bg-gray-800 px-1.5 py-0.5 rounded">esc</kbd>
        </div>

        {/* Results */}
        {query.trim() === '' ? (
          <div className="px-4 py-8 text-center text-gray-600 text-sm">
            Начни вводить для поиска по документам, медицине, образованию, бизнесу
          </div>
        ) : results.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-600 text-sm">Ничего не найдено</div>
        ) : (
          <div className="overflow-y-auto max-h-[60vh] py-2">
            {Object.entries(grouped).map(([module, items]) => (
              <div key={module}>
                <div className="px-4 py-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {MODULE_LABELS[module] ?? module}
                </div>
                {items.map(item => {
                  const idx = flatIndex++
                  const isActive = idx === selected
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelected(idx)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                        isActive ? 'bg-yellow-500/10' : 'hover:bg-gray-800/60'
                      }`}
                    >
                      <span className="text-lg flex-shrink-0">{item.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium truncate ${isActive ? 'text-yellow-400' : 'text-white'}`}>
                          {item.title}
                        </div>
                        {item.sub && (
                          <div className="text-xs text-gray-500 truncate">{item.sub}</div>
                        )}
                      </div>
                      {isActive && (
                        <kbd className="text-xs text-gray-600 bg-gray-800 px-1.5 py-0.5 rounded flex-shrink-0">↵</kbd>
                      )}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        {results.length > 0 && (
          <div className="px-4 py-2 border-t border-gray-800 flex gap-4 text-xs text-gray-600">
            <span>↑↓ навигация</span>
            <span>↵ открыть</span>
            <span>esc закрыть</span>
          </div>
        )}
      </div>
    </div>
  )
}
