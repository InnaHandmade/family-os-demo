import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import GlobalSearch from '../Search/GlobalSearch'

function Layout({ children, currentSection, onNavigate }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  // Cmd+K / Ctrl+K global shortcut
  useEffect(() => {
    function handleKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col lg:flex-row">
      <Topbar onMenuToggle={() => setSidebarOpen(true)} onSearchOpen={() => setSearchOpen(true)} />
      <Sidebar currentSection={currentSection} onNavigate={onNavigate} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onSearchOpen={() => setSearchOpen(true)} />
      <main className="flex-1 p-4 lg:p-6 overflow-auto">{children}</main>

      {searchOpen && (
        <GlobalSearch
          onNavigate={onNavigate}
          onClose={() => setSearchOpen(false)}
        />
      )}
    </div>
  )
}

export default Layout
