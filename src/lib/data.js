// Central data store — single source of truth for family and countries

export const DEFAULT_FAMILY = [
  { id: 'anna',    name: 'Anna',   role: 'Admin',  emoji: '👩', countries: ['UA', 'PL'] },
  { id: 'max',     name: 'Max',    role: 'Member', emoji: '👦', countries: ['UA', 'UK'] },
  { id: 'leo',     name: 'Leo',    role: 'Member', emoji: '👦', countries: ['UA', 'TR'] },
  { id: 'helen',   name: 'Helen',  role: 'Member', emoji: '👵', countries: ['UA', 'UZ'] },
  { id: 'mark',    name: 'Mark',   role: 'Member', emoji: '👨', countries: ['PL', 'UK'] },
]

export const COUNTRIES = ['UA', 'PL', 'UK', 'TR', 'UZ', 'GE']

export const COUNTRY_NAMES = {
  UA: 'Ukraine', PL: 'Poland', UK: 'United Kingdom',
  TR: 'Turkey', UZ: 'Uzbekistan', GE: 'Georgia'
}

export const COUNTRY_FLAGS = {
  UA: '🇺🇦', PL: '🇵🇱', UK: '🇬🇧', TR: '🇹🇷', UZ: '🇺🇿', GE: '🇬🇪'
}

// Read/write helpers
export function loadData(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch {
    return fallback
  }
}

export function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

// Get current family members from localStorage
export function getFamily() {
  return loadData('family-members', DEFAULT_FAMILY)
}

// Get just names (used in dropdowns)
export function getFamilyNames() {
  return getFamily().map(p => p.name)
}
