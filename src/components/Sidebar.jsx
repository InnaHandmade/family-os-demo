const navItems = [
    { id: 'dashboard', label: 'Home', icon: '⊞' },
    { id: 'business', label: 'Business', icon: '◈' },
    { id: 'medical', label: 'Medical', icon: '♡' },
    { id: 'education', label: 'Education', icon: '◎' },
    { id: 'country-docs', label: 'Country Docs', icon: '⊙' },
]

function Sidebar({ currentSection, onNavigate, isOpen, onClose }) {
    return (
        <>
            {/* Затемнение фона на мобиле когда сайдбар открыт */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Сам сайдбар */}
            <aside className={`
        fixed top-0 left-0 h-full w-60 bg-gray-900 border-r border-gray-800 z-30
        transition-transform duration-200
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static
      `}>
                {/* Логотип */}
                <div className="p-6 border-b border-gray-800">
                    <div className="text-yellow-500 text-xs font-bold tracking-widest uppercase">Family OS</div>
                    <div className="text-gray-500 text-xs mt-1">Demo</div>
                </div>

                {/* Навигация */}
                <nav className="p-3 space-y-1">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => { onNavigate(item.id); onClose(); }}
                            className={`
                w-full text-left px-4 py-3 rounded-lg text-sm font-medium
                flex items-center gap-3 transition-colors
                ${currentSection === item.id
                                    ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800'}
              `}
                        >
                            <span className="text-base">{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </nav>
            </aside>
        </>
    )
}

export default Sidebar