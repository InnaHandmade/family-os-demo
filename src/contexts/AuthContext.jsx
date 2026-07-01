import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { loadData, saveData, getFamily } from '../lib/data'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [family, setFamily] = useState(() => getFamily())

  const [currentUser, setCurrentUser] = useState(() => {
    const fam = getFamily()
    const saved = loadData('current-user', null)
    if (saved && fam.find(p => p.id === saved.id)) return saved
    return fam.find(p => p.role === 'Admin') ?? fam[0] ?? null
  })

  useEffect(() => {
    saveData('current-user', currentUser)
  }, [currentUser])

  // Call this after seed/import to re-sync family list in sidebar
  const refreshFamily = useCallback(() => {
    const updated = getFamily()
    setFamily(updated)
    // If current user no longer exists in new family, reset to first Admin
    setCurrentUser(prev => {
      const still = updated.find(p => p.id === prev?.id)
      return still ?? updated.find(p => p.role === 'Admin') ?? updated[0] ?? null
    })
  }, [])

  function switchUser(id) {
    const person = getFamily().find(p => p.id === id)
    if (person) setCurrentUser(person)
  }

  const isAdmin      = currentUser?.role === 'Admin'
  const isAccountant = currentUser?.role === 'Accountant'
  const canEdit      = isAdmin || currentUser?.role === 'Member'

  return (
    <AuthContext.Provider value={{ currentUser, family, isAdmin, isAccountant, canEdit, switchUser, refreshFamily }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
