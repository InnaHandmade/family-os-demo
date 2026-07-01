function Topbar({ onMenuToggle, onSearchOpen }) {
  return (
    <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800">
      <div className="text-yellow-500 text-sm font-bold tracking-widest uppercase">Family OS</div>
      <div className="flex items-center gap-2">
        {/* Search button */}
        <button
          onClick={onSearchOpen}
          className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 flex items-center gap-1.5"
          title="Поиск (⌘K)"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </button>
        {/* Burger */}
        <button onClick={onMenuToggle} className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      </div>
    </header>
  )
}
export default Topbar
