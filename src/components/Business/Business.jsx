import { useState, useEffect } from 'react'

const defaultCompanies = [
  { id: 1, name: 'Tech Solutions Ltd', country: 'UK', status: 'Active', type: 'LLC', since: '2021', iban: 'GB29NWBK60161331926819', swift: 'NWBKGB2L', bank: 'NatWest Bank', bankAddress: 'London, UK' },
  { id: 2, name: 'Anna Design Studio', country: 'PL', status: 'Active', type: 'Sole trader', since: '2019', iban: 'PL61109010140000071219812874', swift: 'WBKPPLPP', bank: 'PKO Bank Polski', bankAddress: 'Warsaw, Poland' },
  { id: 3, name: 'Creative Hub', country: 'UA', status: 'Inactive', type: 'LLC', since: '2017', iban: '', swift: '', bank: '', bankAddress: '' },
]

const defaultContracts = [
  { id: 1, client: 'GlobalCorp Inc', company: 'Tech Solutions Ltd', status: 'Active', amount: '£4,800/mo', until: 'Dec 2026' },
  { id: 2, client: 'Studio Bright', company: 'Anna Design Studio', status: 'Renewal', amount: '€2,200/mo', until: 'Aug 2026' },
  { id: 3, client: 'Startup XYZ', company: 'Tech Solutions Ltd', status: 'Active', amount: '£1,500/mo', until: 'Mar 2027' },
  { id: 4, client: 'OldClient Co', company: 'Creative Hub', status: 'Expired', amount: '₴45,000/mo', until: 'Jan 2024' },
]

const defaultInvoices = [
  {
    id: 'INV-2026-041', client: 'GlobalCorp Inc', clientAddress: '1 Example Street, London, EC1A 1BB', clientReg: '09876543',
    company: 'Tech Solutions Ltd', currency: 'GBP', amount: '4800.00',
    dateFrom: '2026-06-01', dateTo: '2026-06-30', date: '2026-06-30',
    description: 'Payment for provision of IT services, agreement №01/01-26 dd 01.01.2026', status: 'Paid',
  },
  {
    id: 'INV-2026-040', client: 'Studio Bright', clientAddress: 'ul. Marszałkowska 10, 00-001 Warsaw, Poland', clientReg: 'PL5213012345',
    company: 'Anna Design Studio', currency: 'EUR', amount: '2200.00',
    dateFrom: '2026-06-01', dateTo: '2026-06-30', date: '2026-06-30',
    description: 'Payment for design services, agreement №02/03-25 dd 01.03.2025', status: 'Pending',
  },
  {
    id: 'INV-2026-039', client: 'Startup XYZ', clientAddress: '5 Tech Park, Manchester, M1 1AE', clientReg: '11223344',
    company: 'Tech Solutions Ltd', currency: 'GBP', amount: '1500.00',
    dateFrom: '2026-06-01', dateTo: '2026-06-30', date: '2026-06-30',
    description: 'Payment for development services, agreement №03/06-25 dd 01.06.2025', status: 'Paid',
  },
  {
    id: 'INV-2026-037', client: 'Studio Bright', clientAddress: 'ul. Marszałkowska 10, 00-001 Warsaw, Poland', clientReg: 'PL5213012345',
    company: 'Anna Design Studio', currency: 'EUR', amount: '2200.00',
    dateFrom: '2026-05-01', dateTo: '2026-05-31', date: '2026-05-31',
    description: 'Payment for design services, agreement №02/03-25 dd 01.03.2025', status: 'Overdue',
  },
]

const statusColors = {
  Active: 'text-green-400 bg-green-500/10',
  Inactive: 'text-gray-400 bg-gray-500/10',
  Renewal: 'text-yellow-400 bg-yellow-500/10',
  Expired: 'text-red-400 bg-red-500/10',
  Paid: 'text-green-400 bg-green-500/10',
  Pending: 'text-yellow-400 bg-yellow-500/10',
  Overdue: 'text-red-400 bg-red-500/10',
}

const currencySymbols = { GBP: '£', EUR: '€', USD: '$', UAH: '₴', PLN: 'zł' }

function Badge({ status }) {
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[status] ?? 'text-gray-400 bg-gray-500/10'}`}>
      {status}
    </span>
  )
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg p-6 space-y-3 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl leading-none">✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-gray-500 font-medium">{label}</label>
      {children}
    </div>
  )
}

const inputClass = "w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-yellow-500/50 placeholder-gray-600"
const selectClass = "w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-yellow-500/50"

// --- Companies ---
function NewCompanyModal({ onClose, onSave }) {
  const [form, setForm] = useState({ name: '', country: '', type: 'LLC', since: '', iban: '', swift: '', bank: '', bankAddress: '' })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  function handleSave() {
    if (!form.name || !form.country) return
    onSave({ ...form, id: Date.now(), status: 'Active' })
    onClose()
  }

  return (
    <Modal title="New Company" onClose={onClose}>
      <Field label="Company name"><input className={inputClass} placeholder="Tech Solutions Ltd" value={form.name} onChange={e => set('name', e.target.value)} /></Field>
      <Field label="Country"><input className={inputClass} placeholder="UK" value={form.country} onChange={e => set('country', e.target.value)} /></Field>
      <Field label="Type">
        <select className={selectClass} value={form.type} onChange={e => set('type', e.target.value)}>
          <option>LLC</option><option>Sole trader</option><option>JSC</option><option>Other</option>
        </select>
      </Field>
      <Field label="Founded"><input className={inputClass} placeholder="2021" value={form.since} onChange={e => set('since', e.target.value)} /></Field>
      <div className="border-t border-gray-800 pt-2">
        <p className="text-xs text-gray-600 mb-2">Bank details (для инвойсов)</p>
        <div className="space-y-3">
          <Field label="IBAN"><input className={inputClass} placeholder="GB29NWBK..." value={form.iban} onChange={e => set('iban', e.target.value)} /></Field>
          <Field label="SWIFT"><input className={inputClass} placeholder="NWBKGB2L" value={form.swift} onChange={e => set('swift', e.target.value)} /></Field>
          <Field label="Bank name"><input className={inputClass} placeholder="NatWest Bank" value={form.bank} onChange={e => set('bank', e.target.value)} /></Field>
          <Field label="Bank address"><input className={inputClass} placeholder="London, UK" value={form.bankAddress} onChange={e => set('bankAddress', e.target.value)} /></Field>
        </div>
      </div>
      <button onClick={handleSave} className="w-full py-2 rounded-lg bg-yellow-500/20 text-yellow-400 text-sm font-medium hover:bg-yellow-500/30 transition-colors">Save</button>
    </Modal>
  )
}

function CompaniesTab({ companies, setCompanies }) {
  const [showModal, setShowModal] = useState(false)
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button onClick={() => setShowModal(true)} className="text-sm px-4 py-2 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors">
          + New Company
        </button>
      </div>
      {companies.map(c => (
        <div key={c.id} className="p-4 rounded-xl bg-gray-900 border border-gray-800">
          <div className="flex items-center justify-between gap-4">
            <div className="text-white font-medium">{c.name}</div>
            <Badge status={c.status} />
          </div>
          <div className="text-xs text-gray-500 mt-1">{c.type} · {c.country} · с {c.since}</div>
          {c.iban && <div className="text-xs text-gray-600 mt-1">IBAN: {c.iban} · {c.bank}</div>}
        </div>
      ))}
      {showModal && <NewCompanyModal onClose={() => setShowModal(false)} onSave={c => setCompanies(prev => [c, ...prev])} />}
    </div>
  )
}

// --- Contracts ---
function NewContractModal({ companies, onClose, onSave }) {
  const [form, setForm] = useState({ client: '', company: companies[0]?.name ?? '', amount: '', until: '', status: 'Active' })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  function handleSave() {
    if (!form.client || !form.company) return
    onSave({ ...form, id: Date.now() })
    onClose()
  }

  return (
    <Modal title="New Contract" onClose={onClose}>
      <Field label="Client name"><input className={inputClass} placeholder="GlobalCorp Inc" value={form.client} onChange={e => set('client', e.target.value)} /></Field>
      <Field label="Company">
        <select className={selectClass} value={form.company} onChange={e => set('company', e.target.value)}>
          {companies.map(c => <option key={c.id}>{c.name}</option>)}
        </select>
      </Field>
      <Field label="Amount / month"><input className={inputClass} placeholder="£4,800/mo" value={form.amount} onChange={e => set('amount', e.target.value)} /></Field>
      <Field label="Valid until"><input className={inputClass} placeholder="Dec 2026" value={form.until} onChange={e => set('until', e.target.value)} /></Field>
      <Field label="Status">
        <select className={selectClass} value={form.status} onChange={e => set('status', e.target.value)}>
          <option>Active</option><option>Renewal</option><option>Expired</option>
        </select>
      </Field>
      <button onClick={handleSave} className="w-full py-2 rounded-lg bg-yellow-500/20 text-yellow-400 text-sm font-medium hover:bg-yellow-500/30 transition-colors">Save</button>
    </Modal>
  )
}

function ContractsTab({ contracts, setContracts, companies }) {
  const [showModal, setShowModal] = useState(false)
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button onClick={() => setShowModal(true)} className="text-sm px-4 py-2 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors">
          + New Contract
        </button>
      </div>
      {contracts.map(c => (
        <div key={c.id} className="p-4 rounded-xl bg-gray-900 border border-gray-800">
          <div className="flex items-center justify-between gap-4">
            <div className="font-medium text-white">{c.client}</div>
            <Badge status={c.status} />
          </div>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <span>{c.company}</span><span>·</span>
            <span>{c.amount}</span><span>·</span>
            <span>до {c.until}</span>
          </div>
        </div>
      ))}
      {showModal && <NewContractModal companies={companies} onClose={() => setShowModal(false)} onSave={c => setContracts(prev => [c, ...prev])} />}
    </div>
  )
}

// --- Invoices ---
function NewInvoiceModal({ companies, onClose, onSave, nextId }) {
  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({
    id: nextId, client: '', clientAddress: '', clientReg: '',
    company: companies[0]?.name ?? '', currency: 'EUR', amount: '',
    dateFrom: '', dateTo: '', date: today,
    description: '', status: 'Pending',
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  function handleSave() {
    if (!form.id || !form.client || !form.amount) return
    onSave(form)
    onClose()
  }

  return (
    <Modal title="New Invoice" onClose={onClose}>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Invoice number"><input className={inputClass} placeholder="INV-2026-042" value={form.id} onChange={e => set('id', e.target.value)} /></Field>
        <Field label="Invoice date"><input type="date" className={inputClass} value={form.date} onChange={e => set('date', e.target.value)} /></Field>
      </div>

      <Field label="Company (from)">
        <select className={selectClass} value={form.company} onChange={e => set('company', e.target.value)}>
          {companies.map(c => <option key={c.id}>{c.name}</option>)}
        </select>
      </Field>

      <div className="border-t border-gray-800 pt-2 space-y-3">
        <p className="text-xs text-gray-600">Client (to)</p>
        <Field label="Client name"><input className={inputClass} placeholder="GlobalCorp Inc" value={form.client} onChange={e => set('client', e.target.value)} /></Field>
        <Field label="Client address"><input className={inputClass} placeholder="1 Example Street, London" value={form.clientAddress} onChange={e => set('clientAddress', e.target.value)} /></Field>
        <Field label="Reg number"><input className={inputClass} placeholder="09876543" value={form.clientReg} onChange={e => set('clientReg', e.target.value)} /></Field>
      </div>

      <div className="border-t border-gray-800 pt-2 space-y-3">
        <p className="text-xs text-gray-600">Service</p>
        <Field label="Description"><input className={inputClass} placeholder="Payment for IT services, agreement №..." value={form.description} onChange={e => set('description', e.target.value)} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Period from"><input type="date" className={inputClass} value={form.dateFrom} onChange={e => set('dateFrom', e.target.value)} /></Field>
          <Field label="Period to"><input type="date" className={inputClass} value={form.dateTo} onChange={e => set('dateTo', e.target.value)} /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Currency">
            <select className={selectClass} value={form.currency} onChange={e => set('currency', e.target.value)}>
              <option>EUR</option><option>GBP</option><option>USD</option><option>UAH</option><option>PLN</option>
            </select>
          </Field>
          <Field label="Amount"><input className={inputClass} placeholder="1750.00" value={form.amount} onChange={e => set('amount', e.target.value)} /></Field>
        </div>
      </div>

      <Field label="Status">
        <select className={selectClass} value={form.status} onChange={e => set('status', e.target.value)}>
          <option>Pending</option><option>Paid</option><option>Overdue</option>
        </select>
      </Field>

      <button onClick={handleSave} className="w-full py-2 rounded-lg bg-yellow-500/20 text-yellow-400 text-sm font-medium hover:bg-yellow-500/30 transition-colors">Save</button>
    </Modal>
  )
}

function InvoicesTab({ invoices, setInvoices, companies }) {
  const [showModal, setShowModal] = useState(false)

  function getNextId(invoices) {
    const year = new Date().getFullYear()
    const nums = invoices.map(i => parseInt(i.id.split('-')[2])).filter(Boolean)
    const next = nums.length ? Math.max(...nums) + 1 : 1
    return `INV-${year}-${String(next).padStart(3, '0')}`
  }

  function formatAmount(inv) {
    if (!inv.amount) return '—'
    if (!inv.currency) return String(inv.amount)
    const sym = currencySymbols[inv.currency] ?? inv.currency + ' '
    const num = parseFloat(String(inv.amount).replace(/[^0-9.]/g, ''))
    if (isNaN(num)) return String(inv.amount)
    return `${sym}${num.toLocaleString('en-GB', { minimumFractionDigits: 2 })}`
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button onClick={() => setShowModal(true)} className="text-sm px-4 py-2 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors">
          + New Invoice
        </button>
      </div>
      {invoices.map(inv => (
        <div key={inv.id} className="p-4 rounded-xl bg-gray-900 border border-gray-800">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-white font-medium">{inv.id}</span>
              <Badge status={inv.status} />
            </div>
            <span className="text-sm font-semibold text-white">{formatAmount(inv)}</span>
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 flex-wrap">
            <span>{inv.client}</span><span>·</span>
            <span className="text-gray-600">{inv.company}</span><span>·</span>
            <span className="text-gray-400">{inv.dateFrom} — {inv.dateTo}</span>
          </div>
          {inv.description && (
            <div className="text-xs text-gray-600 mt-1 truncate">{inv.description}</div>
          )}
        </div>
      ))}
      {showModal && (
        <NewInvoiceModal
          companies={companies}
          nextId={getNextId(invoices)}
          onClose={() => setShowModal(false)}
          onSave={inv => setInvoices(prev => [inv, ...prev])}
        />
      )}
    </div>
  )
}

// --- Reports ---
function ReportsTab({ invoices }) {
  const years = [...new Set(invoices.map(i => i.date?.slice(0, 4)).filter(Boolean))].sort().reverse()
  const currentYear = new Date().getFullYear().toString()

  const [year, setYear] = useState(years[0] ?? currentYear)
  const [month, setMonth] = useState('all')

  const months = [
    { value: 'all', label: 'Весь год' },
    { value: '01', label: 'January' }, { value: '02', label: 'February' },
    { value: '03', label: 'March' }, { value: '04', label: 'April' },
    { value: '05', label: 'May' }, { value: '06', label: 'June' },
    { value: '07', label: 'July' }, { value: '08', label: 'August' },
    { value: '09', label: 'September' }, { value: '10', label: 'October' },
    { value: '11', label: 'November' }, { value: '12', label: 'December' },
  ]

  const filtered = invoices.filter(inv => {
    if (!inv.date) return false
    if (!inv.date.startsWith(year)) return false
    if (month !== 'all' && inv.date.slice(5, 7) !== month) return false
    return true
  })

  // Sum by currency
  function sumByCurrency(invList) {
    const result = {}
    invList.forEach(inv => {
      const cur = inv.currency ?? '?'
      const num = parseFloat(String(inv.amount ?? '0').replace(/[^0-9.]/g, '')) || 0
      result[cur] = (result[cur] ?? 0) + num
    })
    return result
  }

  const paid = filtered.filter(i => i.status === 'Paid')
  const pending = filtered.filter(i => i.status === 'Pending')
  const overdue = filtered.filter(i => i.status === 'Overdue')

  function formatSum(cur, val) {
    const sym = currencySymbols[cur] ?? cur + ' '
    return `${sym}${val.toLocaleString('en-GB', { minimumFractionDigits: 2 })}`
  }

  function SumBlock({ label, color, sums }) {
    const entries = Object.entries(sums)
    return (
      <div className={`p-4 rounded-xl bg-gray-900 border ${color}`}>
        <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">{label}</div>
        {entries.length === 0
          ? <div className="text-gray-600 text-sm">—</div>
          : entries.map(([cur, val]) => (
            <div key={cur} className="text-lg font-bold text-white">{formatSum(cur, val)}</div>
          ))
        }
      </div>
    )
  }

  function exportCSV() {
    const headers = ['Invoice', 'Client', 'Company', 'Amount', 'Currency', 'Date', 'Period From', 'Period To', 'Status', 'Description']
    const rows = filtered.map(inv => [
      inv.id, inv.client, inv.company, inv.amount, inv.currency,
      inv.date, inv.dateFrom ?? '', inv.dateTo ?? '', inv.status,
      (inv.description ?? '').replace(/,/g, ';')
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `invoices-${year}${month !== 'all' ? '-' + month : ''}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-3 flex-wrap items-center justify-between">
        <div className="flex gap-2">
          <select value={year} onChange={e => setYear(e.target.value)} className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white outline-none">
            {years.map(y => <option key={y}>{y}</option>)}
            {!years.includes(currentYear) && <option>{currentYear}</option>}
          </select>
          <select value={month} onChange={e => setMonth(e.target.value)} className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white outline-none">
            {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </div>
        <button onClick={exportCSV} className="text-sm px-4 py-2 rounded-lg bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700 transition-colors flex items-center gap-2">
          ↓ Export CSV
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <SumBlock label="✓ Paid" color="border-green-500/20" sums={sumByCurrency(paid)} />
        <SumBlock label="⏳ Pending" color="border-yellow-500/20" sums={sumByCurrency(pending)} />
        <SumBlock label="⚠ Overdue" color="border-red-500/20" sums={sumByCurrency(overdue)} />
      </div>

      {/* Invoice list */}
      <div className="space-y-2">
        <div className="text-xs text-gray-600 uppercase tracking-wider">{filtered.length} инвойсов</div>
        {filtered.length === 0 && <div className="text-gray-600 text-sm py-4">Нет инвойсов за выбранный период</div>}
        {filtered.map(inv => (
          <div key={inv.id} className="p-3 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-between gap-4">
            <div>
              <div className="text-sm text-white font-medium">{inv.id}</div>
              <div className="text-xs text-gray-500">{inv.client} · {inv.date}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">
                {currencySymbols[inv.currency] ?? ''}{inv.amount}
              </span>
              <Badge status={inv.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// --- Main ---
const tabs = [
  { id: 'companies', label: 'Companies' },
  { id: 'contracts', label: 'Contracts' },
  { id: 'invoices', label: 'Invoices' },
  { id: 'reports', label: 'Reports' },
]

function load(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch { return fallback }
}

function Business() {
  const [activeTab, setActiveTab] = useState('companies')
  const [companies, setCompanies] = useState(() => load('biz-companies', defaultCompanies))
  const [contracts, setContracts] = useState(() => load('biz-contracts', defaultContracts))
  const [invoices, setInvoices] = useState(() => load('biz-invoices', defaultInvoices))

  useEffect(() => { localStorage.setItem('biz-companies', JSON.stringify(companies)) }, [companies])
  useEffect(() => { localStorage.setItem('biz-contracts', JSON.stringify(contracts)) }, [contracts])
  useEffect(() => { localStorage.setItem('biz-invoices', JSON.stringify(invoices)) }, [invoices])

  const counts = { companies: companies.length, contracts: contracts.length, invoices: invoices.length, reports: null }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Business</h1>
        <p className="text-gray-500 text-sm mt-1">Компании, контракты, инвойсы</p>
      </div>

      <div className="flex gap-1 bg-gray-900 p-1 rounded-xl w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === tab.id ? 'bg-yellow-500/10 text-yellow-400' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab.label}
            {counts[tab.id] !== null && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === tab.id ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-800 text-gray-600'
              }`}>
                {counts[tab.id]}
              </span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'companies' && <CompaniesTab companies={companies} setCompanies={setCompanies} />}
      {activeTab === 'contracts' && <ContractsTab contracts={contracts} setContracts={setContracts} companies={companies} />}
      {activeTab === 'invoices' && <InvoicesTab invoices={invoices} setInvoices={setInvoices} companies={companies} />}
      {activeTab === 'reports' && <ReportsTab invoices={invoices} />}
    </div>
  )
}

export default Business
