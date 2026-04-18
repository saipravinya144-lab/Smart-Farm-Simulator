import { useState } from 'react'
import Dashboard from './components/Dashboard'
import SimulationForm from './components/SimulationForm'
import Results from './components/Results'
import Compare from './components/Compare'
import Recommendations from './components/Recommendations'
import EnhancedSidebar from './components/EnhancedSidebar'
import Chatbot from './components/Chatbot'
import AISuggestions from './components/AISuggestions'
import { LanguageProvider } from './contexts/LanguageContext'
import { translate } from './utils/translations'
import './App.css'

export default function App() {
  const [language, setLanguage] = useState('en')
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [simulations, setSimulations] = useState([])
  const [currentSimulation, setCurrentSimulation] = useState(null)
  const [lastSimulation, setLastSimulation] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleStartSimulation = () => {
    setCurrentPage('simulation')
    setCurrentSimulation(null)
  }

  const handleRunSimulation = (formData) => {
    const simulation = {
      id: Date.now(),
      ...formData
    }

    setSimulations((prevSimulations) => [...prevSimulations, simulation])
    setCurrentSimulation(simulation)
    setLastSimulation(simulation)
    setCurrentPage('results')
  }

  const handleViewComparison = () => {
    setCurrentPage('compare')
  }

  const handleNavigate = (page) => {
    setCurrentPage(page)
  }

  return (
    <LanguageProvider language={language} setLanguage={setLanguage}>
      <div className="app-layout">
        <EnhancedSidebar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />
        <div className="app-content">
          <div className="app-header">
            <div></div>
            <div></div>
          </div>
          {currentPage === 'dashboard' && (
            <Dashboard
              onStartSimulation={handleStartSimulation}
              lastSimulation={lastSimulation}
            />
          )}
          {currentPage === 'simulation' && (
            <SimulationForm
              onRunSimulation={handleRunSimulation}
              onBack={() => setCurrentPage('dashboard')}
            />
          )}
          {currentPage === 'results' && (
            <Results
              simulation={currentSimulation}
              onCompare={handleViewComparison}
              onBack={() => setCurrentPage('dashboard')}
              simulations={simulations}
              lastSimulation={lastSimulation}
            />
          )}
          {currentPage === 'compare' && (
            <Compare
              simulations={simulations}
              onBack={() => setCurrentPage('dashboard')}
            />
          )}
          {currentPage === 'recommendations' && (
            <Recommendations
              simulation={currentSimulation}
              onBack={() => setCurrentPage('dashboard')}
            />
          )}
          {currentPage === 'chatbot' && <Chatbot />}
          {currentPage === 'suggestions' && (
            <AISuggestions lastSimulation={lastSimulation} />
          )}
        </div>
      </div>
    </LanguageProvider>
  )
}
