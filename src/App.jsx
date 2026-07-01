import { useState } from 'react'
import Layout from './components/Layout/Layout'
import Dashboard from './components/Dashboard/Dashboard'
import Business from './components/Business/Business'
import CountryDocs from './components/CountryDocs/CountryDocs'
import Education from './components/Education/Education'
import Medical from './components/Medical/Medical'
import PersonView from './components/PersonView/PersonView'
import { AuthProvider } from './contexts/AuthContext'

function AppInner() {
  const [currentSection, setCurrentSection] = useState('dashboard')

  function renderSection() {
    if (currentSection === 'dashboard') return <Dashboard onNavigate={setCurrentSection} />
    if (currentSection === 'business') return <Business />
    if (currentSection === 'country-docs') return <CountryDocs />
    if (currentSection === 'education') return <Education />
    if (currentSection === 'medical') return <Medical />

    // Person view: e.g. "person:Anna"
    if (currentSection.startsWith('person:')) {
      const name = currentSection.slice(7)
      return <PersonView name={name} onBack={() => setCurrentSection('dashboard')} />
    }

    return (
      <div className="py-10">
        <h1 className="text-2xl font-bold text-yellow-400 mb-2 capitalize">{currentSection}</h1>
        <p className="text-gray-500">Coming soon...</p>
      </div>
    )
  }

  return (
    <Layout currentSection={currentSection} onNavigate={setCurrentSection}>
      {renderSection()}
    </Layout>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  )
}

export default App
