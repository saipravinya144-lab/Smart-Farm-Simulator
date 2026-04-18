import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import './EnhancedSidebar.css'

export default function EnhancedSidebar({ currentPage, onNavigate, onLogout, isOpen, setIsOpen }) {
  const { t } = useLanguage()

  const menuItems = [
    { id: 'dashboard', label: t('sidebarDashboard'), icon: '🏠' },
    { id: 'simulation', label: t('sidebarSimulation'), icon: '📝' },
    { id: 'compare', label: t('sidebarCompare'), icon: '⚖️' },
    { id: 'chatbot', label: t('sidebarChatbot'), icon: '💬' },
    { id: 'suggestions', label: t('sidebarSuggestions'), icon: '✨' },
  ]

  const handleNavigation = (page) => {
    onNavigate(page)
  }

  return (
    <>
      <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : '☰'}
      </button>

      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />}

      <div className={`enhanced-sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-logo">
          <h2>🌾 {t('dashboardTitle')}</h2>
          <button
            className="close-btn"
            onClick={() => setIsOpen(false)}
            aria-label={t('sidebarLogout')}
          >
            ✕
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => handleNavigation(item.id)}
              title={item.label}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="optimize-section">
          <div className="section-title">
            <span className="icon">⚙️</span>
            <span>{t('sidebarOptimize')}</span>
          </div>
          <p className="section-desc">{t('sidebarOptimizeDesc')}</p>
        </div>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={onLogout}>
            <span>🚪</span>
            <span className="logout-label">{t('sidebarLogout')}</span>
          </button>
        </div>
      </div>
    </>
  )
}
