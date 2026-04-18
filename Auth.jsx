import React, { useState } from 'react'
import { authAPI, setAuthToken } from '../utils/apiService'
import './Auth.css'

export default function Auth({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    farmLocation: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (isSignUp) {
      if (!formData.fullName) {
        newErrors.fullName = 'Full name is required'
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password'
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }

      if (!formData.farmLocation) {
        newErrors.farmLocation = 'Farm location is required'
      }
    }

    return newErrors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    setApiError('')
    
    try {
      let result
      
      if (isSignUp) {
        // Call register API
        result = await authAPI.register(
          formData.email,
          formData.password,
          formData.fullName
        )
      } else {
        // Call login API
        result = await authAPI.login(
          formData.email,
          formData.password
        )
      }

      // Set auth token
      if (result.token) {
        setAuthToken(result.token)
      }

      setIsLoading(false)
      
      // Call onLogin callback with user data
      onLogin({
        email: result.user.email,
        fullName: result.user.name,
        userId: result.user.id,
        preferredLanguage: result.user.preferredLanguage
      })
    } catch (error) {
      setIsLoading(false)
      setApiError(error.message || 'An error occurred. Please try again.')
      console.error('Auth error:', error)
    }
  }

  const handleToggleMode = () => {
    setIsSignUp(!isSignUp)
    setErrors({})
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      farmLocation: ''
    })
  }

  return (
    <div className="auth-page">
      <div className="auth-background">
        <div className="auth-blob blob-1"></div>
        <div className="auth-blob blob-2"></div>
      </div>

      <div className="auth-container">
        <div className="auth-card">
          {/* Header */}
          <div className="auth-header">
            <div className="auth-logo">🌾</div>
            <h1 className="auth-title">
              {isSignUp ? 'Start Farming Smart' : 'Welcome Back'}
            </h1>
            <p className="auth-subtitle">
              {isSignUp
                ? 'Join thousands of farmers optimizing their crops'
                : 'Your AI-powered farming companion'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            {apiError && (
              <div className="error-banner" style={{
                background: '#ffe3e3',
                color: '#c92a2a',
                padding: '12px',
                borderRadius: '5px',
                marginBottom: '15px',
                fontSize: '13px'
              }}>
                ✗ {apiError}
              </div>
            )}

            {isSignUp && (
              <>
                <div className="form-group">
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={errors.fullName ? 'error' : ''}
                  />
                  {errors.fullName && (
                    <span className="error-message">{errors.fullName}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="farmLocation">Farm Location</label>
                  <input
                    type="text"
                    id="farmLocation"
                    name="farmLocation"
                    value={formData.farmLocation}
                    onChange={handleChange}
                    placeholder="e.g., Punjab, India"
                    className={errors.farmLocation ? 'error' : ''}
                  />
                  {errors.farmLocation && (
                    <span className="error-message">{errors.farmLocation}</span>
                  )}
                </div>
              </>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={errors.email ? 'error' : ''}
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={errors.password ? 'error' : ''}
              />
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>

            {isSignUp && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={errors.confirmPassword ? 'error' : ''}
                />
                {errors.confirmPassword && (
                  <span className="error-message">{errors.confirmPassword}</span>
                )}
              </div>
            )}

            <button
              type="submit"
              className="btn-auth-submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  {'Signing In...'}
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Toggle */}
          <div className="auth-toggle">
            <p>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <button
                type="button"
                className="auth-toggle-btn"
                onClick={handleToggleMode}
              >
                {isSignUp ? 'Login' : 'Sign Up'}
              </button>
            </p>
          </div>

          {/* Demo Info */}
          <div className="auth-demo-info">
            <p className="demo-label">Demo Credentials:</p>
            <p className="demo-email">Email: demo@farm.com</p>
            <p className="demo-password">Password: demo123</p>
          </div>
        </div>

      </div>
    </div>
  )
}
