import { createContext, useContext, useState, useEffect } from 'react'
import { loadData, saveData, getFamily } from '../lib/data'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const family = getFamily()

  // Current user stored in localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = loadData('current-user', null)
    // Validate saved user still exists in family
    if (saved && family.find(p => p.id === saved.id)) return saved
    // Default: first Admin, or first member
    return family.find(p => p.role === 'Admin') ?? family[0] ?? null
  })

  useEffect(() => {
    saveData('current-user', currentUser)
  }, [currentUser])

  const isAdmin      = currentUser?.role === 'Admin'
  const isAccountant = currentUser?.role === 'Accountant'
  const canEdit      = isAdmin || currentUser?.role === 'Member'

  function switchUser(id) {
    const person = getFamily().find(p => p.id === id)
    if (person) setCurrentUser(person)
  }

  return (
    <AuthContext.Provider value={{ currentUser, isAdmin, isAccountant, canEdit, switchUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
