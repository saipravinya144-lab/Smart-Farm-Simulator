import React from 'react'
import './SimpleChart.css'

export default function SimpleChart({ simulation }) {
  const { yield_kg, cost, revenue, profit } = simulation.calculations

  // Normalize values for visualization
  const maxValue = Math.max(yield_kg, cost, revenue, Math.abs(profit)) * 1.2
  const yieldPercent = (yield_kg / maxValue) * 100
  const costPercent = (cost / maxValue) * 100
  const revenuePercent = (revenue / maxValue) * 100
  const profitPercent = (profit / maxValue) * 100

  return (
    <div className="chart-container card">
      <h3>💹 Performance Chart</h3>
      
      <div className="chart">
        <div className="chart-row">
          <div className="chart-label">
            <span>Yield (kg)</span>
          </div>
          <div className="chart-bar-wrapper">
            <div className="chart-bar" style={{ width: `${yieldPercent}%` }}>
              <span className="bar-value">{yield_kg.toLocaleString()} kg</span>
            </div>
          </div>
        </div>

        <div className="chart-row">
          <div className="chart-label">
            <span>Cost (₹)</span>
          </div>
          <div className="chart-bar-wrapper">
            <div className="chart-bar warning" style={{ width: `${costPercent}%` }}>
              <span className="bar-value">₹{cost.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="chart-row">
          <div className="chart-label">
            <span>Revenue (₹)</span>
          </div>
          <div className="chart-bar-wrapper">
            <div className="chart-bar info" style={{ width: `${revenuePercent}%` }}>
              <span className="bar-value">₹{revenue.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="chart-row">
          <div className="chart-label">
            <span>Profit (₹)</span>
          </div>
          <div className="chart-bar-wrapper">
            <div 
              className={`chart-bar ${profit > 0 ? 'success' : 'danger'}`}
              style={{ width: `${profitPercent}%` }}
            >
              <span className="bar-value">₹{profit.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="chart-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ background: 'linear-gradient(135deg, #22a361 0%, #7ed321 100%)' }}></div>
          <span>Yield - Higher is better</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)' }}></div>
          <span>Cost - Lower is better</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)' }}></div>
          <span>Profit - Higher is better</span>
        </div>
      </div>
    </div>
  )
}
