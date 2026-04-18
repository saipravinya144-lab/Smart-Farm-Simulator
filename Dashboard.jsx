import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import './Dashboard.css'

export default function Dashboard({ onStartSimulation, lastSimulation }) {
  const { t, language, setLanguage, languageOptions } = useLanguage()

  const getRiskLabel = (riskLevel) => {
    if (riskLevel === 'Low Risk') return t('riskLow') || riskLevel
    if (riskLevel === 'Medium Risk') return t('riskMedium') || riskLevel
    return t('riskHigh') || riskLevel
  }

  return (
    <div className="dashboard-container">
      <div className="language-selector">
        <label htmlFor="language-select">{t('selectLanguage')}:</label>
        <select
          id="language-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="language-select"
        >
          {languageOptions.map((opt) => (
            <option key={opt.code} value={opt.code}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="dashboard-content">
        <div className="welcome-section">
          <h1>{t('dashboardTitle')}</h1>
          <p>{t('dashboardSubtitle')}</p>
        </div>

        <button className="btn btn-primary btn-large" onClick={onStartSimulation}>
          {t('startNewSimulation')}
        </button>

        {lastSimulation && (
          <div className="last-simulation card">
            <h2>{t('lastSimulationSummary')}</h2>
            <div className="summary-grid">
              <div className="summary-item">
                <label>{t('labelCrop')}</label>
                <p>{lastSimulation.crop}</p>
              </div>
              <div className="summary-item">
                <label>{t('labelExpectedYield')}</label>
                <p>{lastSimulation.calculations.yield_kg.toLocaleString()} kg</p>
              </div>
              <div className="summary-item">
                <label>{t('labelRevenue')}</label>
                <p className="positive">
                  ₹{lastSimulation.calculations.revenue.toLocaleString()}
                </p>
              </div>
              <div className="summary-item">
                <label>{t('labelProfit')}</label>
                <p className={lastSimulation.calculations.profit > 0 ? 'positive' : 'negative'}>
                  ₹{lastSimulation.calculations.profit.toLocaleString()}
                </p>
              </div>
              <div className="summary-item">
                <label>{t('labelRiskLevel')}</label>
                <span className={`badge badge-${
                  lastSimulation.calculations.riskLevel === 'Low Risk' ? 'success' :
                  lastSimulation.calculations.riskLevel === 'Medium Risk' ? 'warning' : 'danger'
                }`}>
                  {getRiskLabel(lastSimulation.calculations.riskLevel)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
