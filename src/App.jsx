import { useState } from 'react'
import Layout from './components/Layout/Layout'
function App() {
  const [currentSection, setCurrentSection] = useState('dashboard')
  return (
    <Layout currentSection={currentSection} onNavigate={setCurrentSection}>
      <div className="py-10">
        <h1 className="text-2xl font-bold text-yellow-400 mb-2 capitalize">{currentSection}</h1>
        <p className="text-gray-500">Inna Coming soon...</p>
      </div>
    </Layout>
  )
}
export default App
