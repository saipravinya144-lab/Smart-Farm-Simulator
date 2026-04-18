import React, { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import './Compare.css'

export default function Compare({ simulations, onBack }) {
  const { t } = useLanguage()
  const [selectedA, setSelectedA] = useState(simulations[simulations.length - 1]?.id)
  const [selectedB, setSelectedB] = useState(simulations[simulations.length - 2]?.id)

  const simA = simulations.find((s) => s.id === selectedA)
  const simB = simulations.find((s) => s.id === selectedB)

  if (!simA || !simB) {
    return (
      <div className="compare-container">
        <div className="compare-message card">
          <h2>{t('notEnoughSimulationsTitle')}</h2>
          <p>{t('notEnoughSimulationsText')}</p>
          <button className="btn btn-primary" onClick={onBack}>
            {t('backToDashboard')}
          </button>
        </div>
      </div>
    )
  }

  const calcA = simA.calculations
  const calcB = simB.calculations
  const betterProfit = calcA.profit > calcB.profit ? 'A' : calcA.profit < calcB.profit ? 'B' : null

  return (
    <div className="compare-container">
      <div className="compare-header">
        <h1>{t('compareTitle')}</h1>
        <p>{t('compareSubtitle')}</p>
      </div>

      <div className="selector-grid">
        <div className="selector card">
          <label>{t('simulationALabel')}</label>
          <select value={selectedA} onChange={(e) => setSelectedA(Number(e.target.value))}>
            {simulations.map((sim) => (
              <option key={sim.id} value={sim.id}>
                {sim.crop} - {new Date(sim.id).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>

        <div className="selector card">
          <label>{t('simulationBLabel')}</label>
          <select value={selectedB} onChange={(e) => setSelectedB(Number(e.target.value))}>
            {simulations.map((sim) => (
              <option key={sim.id} value={sim.id}>
                {sim.crop} - {new Date(sim.id).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="comparison-cards">
        <div className={`comparison-card card ${betterProfit === 'A' ? 'highlighted' : ''}`}>
          <h2 className="crop-name-a">{t('simulationALabel')}</h2>
          <p className="date-a">{simA.crop} • {new Date(simA.id).toLocaleDateString()}</p>

          <div className="inputs-section">
            <h3>{t('inputsTitle')}</h3>
            <div className="input-list">
              <div className="input-row">
                <span>{t('soilType')}</span>
                <strong>{simA.soil}</strong>
              </div>
              <div className="input-row">
                <span>{t('waterFacility')}</span>
                <strong>{simA.water}</strong>
              </div>
              <div className="input-row">
                <span>{t('seedsLabel')}</span>
                <strong>{simA.seeds}</strong>
              </div>
              <div className="input-row">
                <span>{t('fertilizerLabel')}</span>
                <strong>{simA.fertilizer}</strong>
              </div>
              <div className="input-row">
                <span>{t('weedManagementLabel')}</span>
                <strong>{simA.weedManagement}</strong>
              </div>
            </div>
          </div>

          <div className="results-section">
            <h3>{t('resultsLabel')}</h3>
            <div className="result-item">
              <span>{t('expectedYieldTitle')}</span>
              <strong>{calcA.yield_kg.toLocaleString()} kg</strong>
            </div>
            <div className="result-item">
              <span>{t('totalCostTitle')}</span>
              <strong>₹{calcA.cost.toLocaleString()}</strong>
            </div>
            <div className="result-item">
              <span>{t('totalRevenueTitle')}</span>
              <strong>₹{calcA.revenue.toLocaleString()}</strong>
            </div>
            <div className="result-item">
              <span>{t('netProfitTitle')}</span>
              <strong className={calcA.profit > 0 ? 'positive' : 'negative'}>
                ₹{calcA.profit.toLocaleString()}
              </strong>
            </div>
            <div className="result-item">
              <span>{t('riskTitle')}</span>
              <strong>{calcA.riskLevel}</strong>
            </div>
          </div>

          {betterProfit === 'A' && (
            <div className="winner-badge">{t('winnerBadge')}</div>
          )}
        </div>

        <div className={`comparison-card card ${betterProfit === 'B' ? 'highlighted' : ''}`}>
          <h2 className="crop-name-b">{t('simulationBLabel')}</h2>
          <p className="date-b">{simB.crop} • {new Date(simB.id).toLocaleDateString()}</p>

          <div className="inputs-section">
            <h3>{t('inputsTitle')}</h3>
            <div className="input-list">
              <div className="input-row">
                <span>{t('soilType')}</span>
                <strong>{simB.soil}</strong>
              </div>
              <div className="input-row">
                <span>{t('waterFacility')}</span>
                <strong>{simB.water}</strong>
              </div>
              <div className="input-row">
                <span>{t('seedsLabel')}</span>
                <strong>{simB.seeds}</strong>
              </div>
              <div className="input-row">
                <span>{t('fertilizerLabel')}</span>
                <strong>{simB.fertilizer}</strong>
              </div>
              <div className="input-row">
                <span>{t('weedManagementLabel')}</span>
                <strong>{simB.weedManagement}</strong>
              </div>
            </div>
          </div>

          <div className="results-section">
            <h3>{t('resultsLabel')}</h3>
            <div className="result-item">
              <span>{t('expectedYieldTitle')}</span>
              <strong>{calcB.yield_kg.toLocaleString()} kg</strong>
            </div>
            <div className="result-item">
              <span>{t('totalCostTitle')}</span>
              <strong>₹{calcB.cost.toLocaleString()}</strong>
            </div>
            <div className="result-item">
              <span>{t('totalRevenueTitle')}</span>
              <strong>₹{calcB.revenue.toLocaleString()}</strong>
            </div>
            <div className="result-item">
              <span>{t('netProfitTitle')}</span>
              <strong className={calcB.profit > 0 ? 'positive' : 'negative'}>
                ₹{calcB.profit.toLocaleString()}</strong>
            </div>
            <div className="result-item">
              <span>{t('riskTitle')}</span>
              <strong>{calcB.riskLevel}</strong>
            </div>
          </div>

          {betterProfit === 'B' && (
            <div className="winner-badge">{t('winnerBadge')}</div>
          )}
        </div>
      </div>

      <div className="comparison-summary card">
        <h3>{t('summaryTitle') || 'Summary'}</h3>
        <div className="summary-row">
          <span>{t('yieldDifference')}</span>
          <strong>{Math.abs(calcA.yield_kg - calcB.yield_kg).toLocaleString()} kg ({
            calcA.yield_kg > calcB.yield_kg ? t('aheadLabelA') : t('aheadLabelB')
          })</strong>
        </div>
        <div className="summary-row">
          <span>{t('costDifference')}</span>
          <strong>₹{Math.abs(calcA.cost - calcB.cost).toLocaleString()} ({
            calcA.cost < calcB.cost ? t('cheaperLabelA') : t('cheaperLabelB')
          })</strong>
        </div>
        <div className="summary-row">
          <span>{t('revenueDifference')}</span>
          <strong>₹{Math.abs(calcA.revenue - calcB.revenue).toLocaleString()} ({
            calcA.revenue > calcB.revenue ? t('higherLabelA') : t('higherLabelB')
          })</strong>
        </div>
        <div className="summary-row">
          <span>{t('profitDifference')}</span>
          <strong>₹{Math.abs(calcA.profit - calcB.profit).toLocaleString()} ({
            calcA.profit > calcB.profit ? t('moreProfitableA') : t('moreProfitableB')
          })</strong>
        </div>
      </div>

      <div className="compare-actions">
        <button className="btn btn-secondary" onClick={onBack}>
          {t('backToDashboard')}
        </button>
      </div>
    </div>
  )
}
