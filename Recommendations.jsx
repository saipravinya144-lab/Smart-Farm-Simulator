import React from 'react'
import { getRecommendations } from '../utils/calculations'
import { useLanguage } from '../contexts/LanguageContext'
import './Recommendations.css'

export default function Recommendations({ simulation, onBack }) {
  const { t } = useLanguage()

  if (!simulation) {
    return <div>{t('loading') || 'Loading...'}</div>
  }

  const recommendations = getRecommendations(simulation)

  return (
    <div className="recommendations-container">
      <div className="recommendations-header">
        <h1>{t('recommendationsTitle')}</h1>
        <p>{t('recommendationsSubtitle')}</p>
      </div>

      {recommendations.length > 0 ? (
        <div className="recommendations-list">
          {recommendations.map((rec, idx) => (
            <div key={idx} className="recommendation-card card">
              <div className="rec-header">
                <h3>{rec.type}</h3>
                <span className="badge badge-info">{t('suggestionBadge')}</span>
              </div>

              <div className="rec-content">
                <div className="rec-row">
                  <span className="rec-label">{t('currentLabel')}</span>
                  <span className="rec-current">{rec.current}</span>
                </div>

                <div className="rec-arrow">→</div>

                <div className="rec-row">
                  <span className="rec-label">{t('recommendedLabel')}</span>
                  <span className="rec-suggestion">{rec.suggestion}</span>
                </div>
              </div>

              <div className="rec-benefit">
                <span className="benefit-icon">💡</span>
                <span>{rec.benefit}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-recommendations card">
          <h3>{t('noRecommendationsTitle')}</h3>
          <p>{t('noRecommendationsText')}</p>
        </div>
      )}

      <div className="recommendation-tips card">
        <h3>{t('generalGuidelinesTitle')}</h3>
        <ul>
          <li>{t('guideline1')}</li>
          <li>{t('guideline2')}</li>
          <li>{t('guideline3')}</li>
          <li>{t('guideline4')}</li>
          <li>{t('guideline5')}</li>
          <li>{t('guideline6')}</li>
        </ul>
      </div>

      <div className="recommendations-actions">
        <button className="btn btn-secondary" onClick={onBack}>
          {t('backToDashboard')}
        </button>
      </div>
    </div>
  )
}
