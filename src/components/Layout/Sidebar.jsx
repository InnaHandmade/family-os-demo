import { useAuth } from '../../contexts/AuthContext'

const navItems = [
  { id: 'dashboard',   label: 'Dashboard',   icon: '⊞' },
  { id: 'business',    label: 'Business',     icon: '◈' },
  { id: 'medical',     label: 'Medical',      icon: '♡' },
  { id: 'education',   label: 'Education',    icon: '◎' },
  { id: 'country-docs', label: 'Country Docs', icon: '⊙' },
]

const ROLE_BADGE = {
  Admin:      'text-yellow-400 bg-yellow-500/10',
  Member:     'text-gray-400 bg-gray-700',
  Accountant: 'text-blue-400 bg-blue-500/10',
}

function Sidebar({ currentSection, onNavigate, isOpen, onClose, onSearchOpen }) {
  const { currentUser, family, switchUser } = useAuth()

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={onClose} />}
      <aside className={`fixed top-0 left-0 h-full w-60 bg-gray-900 border-r border-gray-800 z-30 transition-transform duration-200 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static flex flex-col`}>

        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <div className="text-yellow-500 text-xs font-bold tracking-widest uppercase">Family OS</div>
          <div className="text-gray-500 text-xs mt-1">Demo</div>
        </div>

        {/* Current user switcher */}
        {currentUser && (
          <div className="px-3 pt-3">
            <div className="rounded-lg bg-gray-800 border border-gray-700 p-2.5 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-lg">{currentUser.emoji ?? '👤'}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-white truncate">{currentUser.name}</div>
                  <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${ROLE_BADGE[currentUser.role] ?? ROLE_BADGE.Member}`}>
                    {currentUser.role}
                  </span>
                </div>
              </div>
              <select
                value={currentUser.id}
                onChange={e => switchUser(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs text-gray-400 outline-none"
              >
                {family.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.emoji} {p.name} — {p.role}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="px-3 pt-2">
          <button
            onClick={onSearchOpen}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 text-gray-500 hover:text-gray-300 transition-colors text-sm border border-gray-700"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <span className="flex-1 text-left">Поиск...</span>
            <kbd className="text-xs bg-gray-700 px-1 rounded">⌘K</kbd>
          </button>
        </div>

        {/* Nav */}
        <nav className="p-3 space-y-1 flex-1">
          {navItems
            .filter(item => currentUser?.role !== 'Accountant' || item.id === 'business')
            .map(item => (
              <button key={item.id} onClick={() => { onNavigate(item.id); onClose() }}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 transition-colors ${currentSection === item.id ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
                <span>{item.icon}</span>{item.label}
              </button>
            ))
          }
        </nav>
      </aside>
    </>
  )
}

export default Sidebar
