function Topbar({ onMenuToggle }) {
  return (
    <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800">
      <div className="text-yellow-500 text-sm font-bold tracking-widest uppercase">Family OS</div>
      <button onClick={onMenuToggle} className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
    </header>
  )
}
export default Topbar
