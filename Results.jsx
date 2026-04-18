import React, { useState, useEffect } from 'react'
import SimpleChart from './SimpleChart'
import { getAISuggestions } from '../utils/aiService'
import { useLanguage } from '../contexts/LanguageContext'
import './Results.css'

export default function Results({ simulation, onCompare, onBack, simulations }) {
  const { t, language } = useLanguage()
  const [aiSuggestions, setAiSuggestions] = useState('')
  const [suggestionsLoading, setSuggestionsLoading] = useState(false)
  const [suggestionsError, setSuggestionsError] = useState(null)

  const getLanguageCode = () => {
    const langMap = {
      en: 'en-US',
      hi: 'hi-IN',
      te: 'te-IN',
      ta: 'ta-IN',
      ml: 'ml-IN',
      pa: 'pa-IN'
    }
    return langMap[language] || 'en-US'
  }

  const speakText = (text) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = getLanguageCode()
    window.speechSynthesis.speak(utterance)
  }

  useEffect(() => {
    if (!simulation || simulation.voiceMode !== 'voice') return

    const { crop, soil, water, seeds, fertilizer, weedManagement, calculations } = simulation
    const { yield_kg, cost, revenue, profit, riskLevel } = calculations
    const summary = `${t('resultsTitle')} for ${crop}. ${t('expectedYieldTitle')} is ${yield_kg.toLocaleString()} kilograms. ${t('totalCostTitle')} is ₹${cost.toLocaleString()}. ${t('totalRevenueTitle')} is ₹${revenue.toLocaleString()}. ${t('netProfitTitle')} is ₹${profit.toLocaleString()}. ${t('riskTitle')} is ${t(riskLevel === 'Low Risk' ? 'riskLow' : riskLevel === 'Medium Risk' ? 'riskMedium' : 'riskHigh')}.`
    speakText(summary)
  }, [simulation, language, t])

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!simulation) return

      setSuggestionsLoading(true)
      try {
        const result = await getAISuggestions(simulation)
        if (result.success) {
          setAiSuggestions(result.suggestions)
        } else {
          setSuggestionsError(result.error || t('suggestionsError'))
        }
      } catch (err) {
        console.error('Error fetching AI suggestions:', err)
        setSuggestionsError(t('suggestionsError'))
      } finally {
        setSuggestionsLoading(false)
      }
    }

    fetchSuggestions()
  }, [simulation, t])

  if (!simulation) {
    return <div>{t('loading') || 'Loading...'}</div>
  }

  const { crop, soil, water, seeds, fertilizer, weedManagement, calculations } = simulation
  const { yield_kg, cost, revenue, profit, riskLevel, marketPrice } = calculations

  const maxYield = 5000
  const yieldPercentage = (yield_kg / maxYield) * 100

  const getRiskBadgeClass = () => {
    if (riskLevel === 'Low Risk') return 'badge-success'
    if (riskLevel === 'Medium Risk') return 'badge-warning'
    return 'badge-danger'
  }

  const renderRiskReason = () => {
    if (riskLevel === 'High Risk' && water === 'Rainwater/Monsoon') {
      return t('riskDependMonsoon')
    }
    if (riskLevel === 'Medium Risk') {
      return t('riskSoilCare', { soil })
    }
    return t('riskOptimal')
  }

  const getRiskLabel = () => {
    if (riskLevel === 'Low Risk') return t('riskLow') || riskLevel
    if (riskLevel === 'Medium Risk') return t('riskMedium') || riskLevel
    return t('riskHigh') || riskLevel
  }

  return (
    <div className="results-container">
      <div className="results-header">
        <h1>{t('resultsTitle')}</h1>
        <p className="crop-subtitle">{t('resultsSubtitle', { crop })}</p>
      </div>

      <div className="results-grid">
        <div className="result-card card">
          <h3>{t('expectedYieldTitle')}</h3>
          <div className="result-value">{yield_kg.toLocaleString()} kg</div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${Math.min(yieldPercentage, 100)}%` }}
            ></div>
          </div>
          <small>{t('perAcre')}</small>
        </div>

        <div className="result-card card">
          <h3>{t('totalCostTitle')}</h3>
          <div className="result-value">₹{cost.toLocaleString()}</div>
          <div className="cost-breakdown">
            <div>{t('costBase')}</div>
            <div className="text-sm">{t('costAdditional', { amount: (cost - 12000).toLocaleString() })}</div>
          </div>
        </div>

        <div className="result-card card">
          <h3>{t('totalRevenueTitle')}</h3>
          <div className="result-value" style={{ color: '#22a361' }}>
            ₹{revenue.toLocaleString()}
          </div>
          <div className="revenue-breakdown">
            <div>{t('revenueBreakdown', { price: marketPrice, yield: yield_kg.toLocaleString() })}</div>
          </div>
        </div>

        <div className="result-card card">
          <h3>{t('netProfitTitle')}</h3>
          <div className={`result-value ${profit > 0 ? 'positive' : 'negative'}`}>
            ₹{profit.toLocaleString()}
          </div>
          <div className={`profit-label ${profit > 0 ? 'positive' : 'negative'}`}>
            {profit > 0 ? t('profitableLabel') : t('lossLabel')}
          </div>
        </div>

        <div className="result-card card">
          <h3>{t('riskTitle')}</h3>
          <div className="risk-display">
            <span className={`badge ${getRiskBadgeClass()}`}>{getRiskLabel()}</span>
          </div>
          <div className="risk-reason">{renderRiskReason()}</div>
        </div>

        <div className="result-card card">
          <h3>{t('marginTitle')}</h3>
          <div className="result-value">
            {profit > 0 ? ((profit / revenue * 100).toFixed(1)) : '0'}%
          </div>
          <div className="text-sm">{t('profitMarginNote')}</div>
        </div>
      </div>

      <div className="comparison-section">
        <SimpleChart simulation={simulation} />
      </div>

      <div className="input-summary card">
        <h3>{t('inputSummaryTitle')}</h3>
        <div className="input-grid">
          <div className="input-item">
            <label>{t('labelCrop')}</label>
            <p>{crop}</p>
          </div>
          <div className="input-item">
            <label>{t('labelSoilType')}</label>
            <p>{soil}</p>
          </div>
          <div className="input-item">
            <label>{t('labelWaterFacility')}</label>
            <p>{water}</p>
          </div>
          <div className="input-item">
            <label>{t('labelSeedsType')}</label>
            <p>{seeds}</p>
          </div>
          <div className="input-item">
            <label>{t('labelFertilizerType')}</label>
            <p>{fertilizer}</p>
          </div>
          <div className="input-item">
            <label>{t('labelWeedManagement')}</label>
            <p>{weedManagement}</p>
          </div>
        </div>
      </div>

      {suggestionsError && (
        <div className="ai-suggestions-error card">
          <p>⚠️ {suggestionsError}</p>
          <small>{t('errorBannerHelp')}</small>
        </div>
      )}

      {suggestionsLoading && (
        <div className="ai-suggestions-loading card">
          <div className="spinner"></div>
          <p>{t('suggestionsLoading')}</p>
        </div>
      )}

      {aiSuggestions && !suggestionsLoading && (
        <div className="ai-suggestions card">
          <h3>{t('aiSuggestionsHeading')}</h3>
          <div className="suggestions-content">
            {aiSuggestions.split('\n').map((line, idx) => {
              if (line.match(/^\d+\./)) {
                return (
                  <div key={idx} className="suggestion-item">
                    {line}
                  </div>
                )
              }
              if (line.match(/^\*/)) {
                return (
                  <div key={idx} className="suggestion-bullet">
                    {line.replace(/^\*\s?/, '')}
                  </div>
                )
              }
              if (line.trim()) {
                return (
                  <p key={idx} className="suggestion-text">
                    {line}
                  </p>
                )
              }
              return null
            })}
          </div>
        </div>
      )}

      <div className="results-actions">
        {simulations && simulations.length > 1 && (
          <button className="btn btn-secondary" onClick={onCompare}>
            {t('compareTitle')}
          </button>
        )}
        <button className="btn btn-primary" onClick={onBack}>
          {t('backToDashboard')}
        </button>
      </div>
    </div>
  )
}
