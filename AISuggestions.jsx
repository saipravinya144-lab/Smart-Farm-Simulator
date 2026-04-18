import React, { useState, useEffect } from 'react'
import { getAIPoweredTips, getAISuggestions } from '../utils/aiService'
import { useLanguage } from '../contexts/LanguageContext'
import './AISuggestions.css'

export default function AISuggestions({ lastSimulation }) {
  const { t } = useLanguage()
  const [tips, setTips] = useState('')
  const [suggestions, setSuggestions] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('tips')

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true)
      try {
        const tipsResult = await getAIPoweredTips()
        if (tipsResult.success) {
          setTips(tipsResult.tips)
        } else {
          setError(tipsResult.error || t('suggestionsError'))
        }

        if (lastSimulation) {
          const suggestionsResult = await getAISuggestions(lastSimulation)
          if (suggestionsResult.success) {
            setSuggestions(suggestionsResult.suggestions)
          }
        }
      } catch (err) {
        console.error('Error fetching AI content:', err)
        setError(t('errorBannerHelp'))
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [lastSimulation, t])

  const renderFormattedContent = (text) => {
    if (!text) return null

    return text.split('\n').map((line, idx) => {
      if (line.match(/^\d+\./)) {
        return (
          <div key={idx} className="numbered-item">
            {line}
          </div>
        )
      }
      if (line.match(/^\*/)) {
        return (
          <div key={idx} className="bullet-item">
            {line.replace(/^\*\s?/, '')}
          </div>
        )
      }
      if (line.match(/^\*\*/) || line.match(/^##/)) {
        return (
          <h3 key={idx} className="content-subheading">
            {line.replace(/^\*\*|\*\*|^##\s?/g, '')}
          </h3>
        )
      }
      if (line.trim()) {
        return (
          <p key={idx} className="content-paragraph">
            {line}
          </p>
        )
      }
      return null
    })
  }

  return (
    <div className="ai-suggestions-container">
      <div className="ai-header">
        <h1>{t('aiPanelTitle')}</h1>
        <p>{t('aiPanelSubtitle')}</p>
      </div>

      {error && (
        <div className="error-banner">
          <span>⚠️</span>
          <p>{error}</p>
          <small>{t('errorBannerHelp')}</small>
        </div>
      )}

      <div className="tabs-container">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'tips' ? 'active' : ''}`}
            onClick={() => setActiveTab('tips')}
          >
            <span className="tab-icon">💡</span>
            <span>{t('generalTipsTab')}</span>
          </button>
          {lastSimulation && (
            <button
              className={`tab ${activeTab === 'suggestions' ? 'active' : ''}`}
              onClick={() => setActiveTab('suggestions')}
            >
              <span className="tab-icon">🎯</span>
              <span>{t('personalizedSuggestionsTab')}</span>
            </button>
          )}
        </div>

        <div className="tab-content">
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>{t('loadingInsights')}</p>
            </div>
          ) : (
            <>
              {activeTab === 'tips' && (
                <div className="tips-section card">
                  <h2>🌾 {t('generalTipsTab')}</h2>
                  <div className="content">
                    {tips ? (
                      renderFormattedContent(tips)
                    ) : (
                      <p>{t('noTipsAvailable')}</p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'suggestions' && lastSimulation && (
                <div className="suggestions-section card">
                  <h2>🎯 {t('personalizedSuggestionsTab')} {lastSimulation.crop}</h2>
                  <div className="simulation-info">
                    <div className="info-item">
                      <span className="label">{t('currentSetupLabel')}</span>
                      <span className="value">{lastSimulation.soil} soil, {lastSimulation.water}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">{t('resultSummaryLabel')}</span>
                      <span className="value">
                        {lastSimulation.calculations.yield_kg} kg, ₹{lastSimulation.calculations.profit} profit
                      </span>
                    </div>
                  </div>
                  <div className="content">
                    {suggestions ? (
                      renderFormattedContent(suggestions)
                    ) : (
                      <p>{t('noSuggestionsAvailable')}</p>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
