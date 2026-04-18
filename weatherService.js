// Dummy farming locations with their coordinates
export const farmingLocations = [
  {
    id: 1,
    name: 'Punjab, India',
    state: 'Punjab',
    lat: 31.5204,
    lon: 74.3587,
    region: 'North India'
  },
  {
    id: 2,
    name: 'Maharashtra, India',
    state: 'Maharashtra',
    lat: 19.7515,
    lon: 75.7139,
    region: 'Central India'
  },
  {
    id: 3,
    name: 'Haryana, India',
    state: 'Haryana',
    lat: 29.0588,
    lon: 77.0745,
    region: 'North India'
  },
  {
    id: 4,
    name: 'Karnataka, India',
    state: 'Karnataka',
    lat: 15.3173,
    lon: 75.7139,
    region: 'South India'
  },
  {
    id: 5,
    name: 'Tamil Nadu, India',
    state: 'Tamil Nadu',
    lat: 11.1271,
    lon: 79.2805,
    region: 'South India'
  },
  {
    id: 6,
    name: 'Uttar Pradesh, India',
    state: 'Uttar Pradesh',
    lat: 26.8467,
    lon: 80.9462,
    region: 'North India'
  }
]

// Fetch real weather data using Open-Meteo API (free, no authentication needed)
export async function fetchWeather(latitude, longitude) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,humidity,wind_speed,precipitation&timezone=auto`
    
    console.log('Fetching weather from:', url)
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    if (!data.current) {
      throw new Error('No current weather data in response')
    }

    const current = data.current

    return {
      temperature: Math.round(current.temperature_2m),
      humidity: current.humidity,
      windSpeed: Math.round(current.wind_speed * 10) / 10,
      weatherCode: current.weather_code,
      precipitation: current.precipitation || 0,
      weatherDescription: getWeatherDescription(current.weather_code),
      weatherIcon: getWeatherIcon(current.weather_code),
      timestamp: new Date().toLocaleTimeString()
    }
  } catch (error) {
    console.error('Error fetching weather:', error.message || error)
    return null
  }
}

// Map WMO weather codes to descriptions
function getWeatherDescription(code) {
  const weatherCodes = {
    0: 'Clear Sky',
    1: 'Mainly Clear',
    2: 'Partly Cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Foggy with rime',
    51: 'Light Drizzle',
    53: 'Moderate Drizzle',
    55: 'Dense Drizzle',
    61: 'Slight Rain',
    63: 'Moderate Rain',
    65: 'Heavy Rain',
    71: 'Slight Snow',
    73: 'Moderate Snow',
    75: 'Heavy Snow',
    80: 'Slight Rain Showers',
    81: 'Moderate Rain Showers',
    82: 'Violent Rain Showers',
    85: 'Slight Snow Showers',
    86: 'Heavy Snow Showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with Hail',
    99: 'Thunderstorm with Heavy Hail'
  }
  return weatherCodes[code] || 'Unknown'
}

// Map weather codes to emoji icons
function getWeatherIcon(code) {
  if (code === 0) return '☀️'
  if (code === 1 || code === 2) return '🌤️'
  if (code === 3) return '☁️'
  if (code === 45 || code === 48) return '🌫️'
  if (code >= 51 && code <= 55) return '🌦️'
  if (code >= 61 && code <= 65) return '🌧️'
  if (code >= 71 && code <= 77) return '❄️'
  if (code >= 80 && code <= 82) return '⛈️'
  if (code >= 95 && code <= 99) return '⛈️'
  return '🌡️'
}
