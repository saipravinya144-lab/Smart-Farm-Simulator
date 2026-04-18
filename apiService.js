const API_URL = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:5000/api'

let authToken = localStorage.getItem('authToken')

// Set auth token
export const setAuthToken = (token) => {
  authToken = token
  if (token) {
    localStorage.setItem('authToken', token)
  } else {
    localStorage.removeItem('authToken')
  }
}

// Get auth token
export const getAuthToken = () => {
  return authToken || localStorage.getItem('authToken')
}

// Make API request with auth header
const apiCall = async (endpoint, method = 'GET', data = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  }

  const token = getAuthToken()
  if (token) {
    options.headers.Authorization = `Bearer ${token}`
  }

  if (data) {
    options.body = JSON.stringify(data)
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options)
    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'API request failed')
    }

    return result
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

// Auth APIs
export const authAPI = {
  register: async (email, password, name) => {
    const result = await apiCall('/auth/register', 'POST', { email, password, name })
    if (result.token) {
      setAuthToken(result.token)
    }
    return result
  },

  login: async (email, password) => {
    const result = await apiCall('/auth/login', 'POST', { email, password })
    if (result.token) {
      setAuthToken(result.token)
    }
    return result
  },

  logout: () => {
    setAuthToken(null)
  }
}

// Simulation APIs
export const simulationAPI = {
  saveSimulation: async (inputs, results, aiSuggestions, language, voiceMode) => {
    return await apiCall('/simulations/save', 'POST', {
      inputs,
      results,
      aiSuggestions,
      language,
      voiceMode
    })
  },

  getHistory: async (limit = 10, skip = 0) => {
    return await apiCall(`/simulations/history?limit=${limit}&skip=${skip}`)
  },

  getSimulation: async (simulationId) => {
    return await apiCall(`/simulations/${simulationId}`)
  },

  deleteSimulation: async (simulationId) => {
    return await apiCall(`/simulations/${simulationId}`, 'DELETE')
  },

  getStats: async () => {
    return await apiCall('/simulations/stats/overview')
  }
}

export default {
  authAPI,
  simulationAPI,
  setAuthToken,
  getAuthToken
}
