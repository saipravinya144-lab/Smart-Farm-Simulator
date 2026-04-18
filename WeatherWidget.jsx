import React, { useState, useEffect } from 'react'
import { farmingLocations, fetchWeather } from '../utils/weatherService'
import './WeatherWidget.css'

export default function WeatherWidget() {
  const [selectedLocation, setSelectedLocation] = useState(farmingLocations[0])
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  useEffect(() => {
    const loadWeather = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchWeather(selectedLocation.lat, selectedLocation.lon)
        if (data) {
          setWeather(data)
          setLastUpdated(new Date())
        } else {
          setError('Unable to fetch weather data. Check console for details.')
        }
      } catch (err) {
        console.error('Weather widget error:', err)
        setError('Failed to load weather data')
      }
      setLoading(false)
    }

    loadWeather()
    // Refresh weather every 5 minutes
    const interval = setInterval(loadWeather, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [selectedLocation])

  const handleLocationChange = (e) => {
    const location = farmingLocations.find(loc => loc.id === parseInt(e.target.value))
    setSelectedLocation(location)
  }

  const formatTime = (date) => {
    if (!date) return ''
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="weather-widget card">
      <div className="weather-header">
        <h3>🌡️ Live Weather</h3>
        <select
          value={selectedLocation.id}
          onChange={handleLocationChange}
          className="location-select"
        >
          {farmingLocations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="weather-loading">
          <div className="spinner-small"></div>
          <p>Loading weather...</p>
        </div>
      ) : error ? (
        <div className="weather-error">
          <p>⚠️ {error}</p>
          <button 
            className="retry-btn"
            onClick={() => {
              const loadWeather = async () => {
                setLoading(true)
                const data = await fetchWeather(selectedLocation.lat, selectedLocation.lon)
                if (data) {
                  setWeather(data)
                  setLastUpdated(new Date())
                  setError(null)
                } else {
                  setError('Failed to fetch weather data')
                }
                setLoading(false)
              }
              loadWeather()
            }}
          >
            Retry
          </button>
        </div>
      ) : weather ? (
        <div className="weather-content">
          <div className="weather-main">
            <div className="weather-icon">{weather.weatherIcon}</div>
            <div className="weather-info">
              <div className="temperature">
                <span className="temp-value">{weather.temperature}</span>
                <span className="temp-unit">°C</span>
              </div>
              <div className="weather-description">{weather.weatherDescription}</div>
            </div>
          </div>

          <div className="weather-details">
            <div className="detail-item">
              <span className="detail-label">💧 Humidity</span>
              <span className="detail-value">{weather.humidity}%</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">💨 Wind</span>
              <span className="detail-value">{weather.windSpeed} km/h</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">🌧️ Rainfall</span>
              <span className="detail-value">{weather.precipitation} mm</span>
            </div>
          </div>

          <div className="weather-location">
            <p className="location-info">📍 {selectedLocation.state} • {selectedLocation.region}</p>
            <p className="update-time">Updated: {formatTime(lastUpdated)}</p>
          </div>
        </div>
      ) : null}
    </div>
  )
}
