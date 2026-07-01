import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'

/**
 * Two-step inline delete. Visible only to Admin.
 * First click → "Удалить? / Нет"
 * Second click → calls onDelete()
 * Auto-resets after 3s.
 */
export default function DeleteButton({ onDelete }) {
  const { isAdmin } = useAuth()
  const [confirming, setConfirming] = useState(false)

  useEffect(() => {
    if (!confirming) return
    const t = setTimeout(() => setConfirming(false), 3000)
    return () => clearTimeout(t)
  }, [confirming])

  // Non-admins see nothing
  if (!isAdmin) return null

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={e => { e.stopPropagation(); onDelete() }}
          className="text-xs px-2 py-1 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors font-medium whitespace-nowrap"
        >
          Удалить
        </button>
        <button
          onClick={e => { e.stopPropagation(); setConfirming(false) }}
          className="text-xs px-2 py-1 rounded-lg bg-gray-800 text-gray-500 hover:text-gray-300 transition-colors"
        >
          Нет
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={e => { e.stopPropagation(); setConfirming(true) }}
      className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-colors text-xs"
      title="Удалить"
    >
      ✕
    </button>
  )
}
