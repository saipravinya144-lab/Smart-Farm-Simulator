import React, { useState, useEffect, useRef } from 'react'
import { calculateSimulation } from '../utils/calculations'
import { useLanguage } from '../contexts/LanguageContext'
import SelectWithTooltip from './SelectWithTooltip'
import { dropdownDetails } from '../utils/dropdownDetails'
import './SimulationForm.css'

export default function SimulationForm({ onRunSimulation, onBack }) {
  const { t, language } = useLanguage()
  const [formData, setFormData] = useState({
    soil: 'Alluvial',
    water: 'River/Canal',
    crop: 'Rice',
    seeds: 'Hybrid',
    fertilizer: 'Mixed',
    weedManagement: 'Advanced Control'
  })
  const [voiceMode, setVoiceMode] = useState('none')
  const [listening, setListening] = useState(false)
  const [voiceStatus, setVoiceStatus] = useState('')
  const [voiceError, setVoiceError] = useState('')
  const [currentVoiceField, setCurrentVoiceField] = useState(null)
  const recognitionRef = useRef(null)

  const fieldOptions = {
    soil: ['Alluvial', 'Black', 'Red', 'Laterite', 'Sandy'],
    water: ['Well/Borewell', 'River/Canal', 'Rainwater/Monsoon', 'Tube Well', 'Pond/Tank'],
    crop: ['Rice', 'Wheat', 'Maize', 'Sugarcane', 'Cotton', 'Vegetables'],
    seeds: ['Local', 'Hybrid', 'High-yield'],
    fertilizer: ['Natural', 'Artificial', 'Mixed'],
    weedManagement: ['No Control', 'Basic Control', 'Advanced Control']
  }

  const fieldOrder = ['soil', 'water', 'crop', 'seeds', 'fertilizer', 'weedManagement']

  const fieldLabels = {
    soil: t('soilType'),
    water: t('waterFacility'),
    crop: t('cropLabel'),
    seeds: t('seedsLabel'),
    fertilizer: t('fertilizerLabel'),
    weedManagement: t('weedManagementLabel')
  }

  const getTranslatedOption = (field, value) => {
    const optionKeyMap = {
      soil: {
        'Alluvial': 'soilAlluvial',
        'Black': 'soilBlack',
        'Red': 'soilRed',
        'Laterite': 'soilLaterite',
        'Sandy': 'soilSandy'
      },
      water: {
        'Well/Borewell': 'waterWellBorewell',
        'River/Canal': 'waterRiverCanal',
        'Rainwater/Monsoon': 'waterRainwaterMonsoon',
        'Tube Well': 'waterTubeWell',
        'Pond/Tank': 'waterPondTank'
      },
      crop: {
        'Rice': 'cropRice',
        'Wheat': 'cropWheat',
        'Maize': 'cropMaize',
        'Sugarcane': 'cropSugarcane',
        'Cotton': 'cropCotton',
        'Vegetables': 'cropVegetables'
      },
      seeds: {
        'Local': 'seedsLocal',
        'Hybrid': 'seedsHybrid',
        'High-yield': 'seedsHighYield'
      },
      fertilizer: {
        'Natural': 'fertilizerNatural',
        'Artificial': 'fertilizerArtificial',
        'Mixed': 'fertilizerMixed'
      },
      weedManagement: {
        'No Control': 'weedManagementNoControl',
        'Basic Control': 'weedManagementBasicControl',
        'Advanced Control': 'weedManagementAdvancedControl'
      }
    }
    return t(optionKeyMap[field]?.[value] || value)
  }

  const isSpeechRecognitionSupported = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)
  const isSpeechSynthesisSupported = typeof window !== 'undefined' && 'speechSynthesis' in window

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
    if (!isSpeechSynthesisSupported) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = getLanguageCode()
    window.speechSynthesis.speak(utterance)
  }

  const normalizeText = (text) => text.trim().toLowerCase().replace(/[^\w\s]/g, '')

  const calculateSimilarity = (str1, str2) => {
    const s1 = str1.toLowerCase()
    const s2 = str2.toLowerCase()
    const longer = s1.length > s2.length ? s1 : s2
    const shorter = s1.length > s2.length ? s2 : s1
    if (longer.length === 0) return 1.0
    const editDistance = levenshteinDistance(longer, shorter)
    return (longer.length - editDistance) / longer.length
  }

  const levenshteinDistance = (s1, s2) => {
    const costs = []
    for (let i = 0; i <= s1.length; i++) {
      let lastValue = i
      for (let j = 0; j <= s2.length; j++) {
        if (i === 0) {
          costs[j] = j
        } else if (j > 0) {
          let newValue = costs[j - 1]
          if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1
          }
          costs[j - 1] = lastValue
          lastValue = newValue
        }
      }
      if (i > 0) costs[s2.length] = lastValue
    }
    return costs[s2.length]
  }

  const findMatchingOption = (field, transcript) => {
    const normalizedTranscript = normalizeText(transcript)
    
    // Try exact match first
    const exactMatch = fieldOptions[field].find((option) => {
      const normalizedOption = normalizeText(option)
      return normalizedOption === normalizedTranscript
    })
    if (exactMatch) return exactMatch

    // Try substring match
    const substringMatch = fieldOptions[field].find((option) => {
      const normalizedOption = normalizeText(option)
      return (
        normalizedOption.includes(normalizedTranscript) ||
        normalizedTranscript.includes(normalizedOption)
      )
    })
    if (substringMatch) return substringMatch

    // Try fuzzy match with similarity scoring
    const wordMatches = fieldOptions[field].map((option) => {
      const normalizedOption = normalizeText(option)
      const words1 = normalizedTranscript.split(/\s+/)
      const words2 = normalizedOption.split(/\s+/)
      
      // Check if any words match substantially
      const matchingWords = words1.filter(w1 =>
        words2.some(w2 => calculateSimilarity(w1, w2) > 0.75)
      )
      
      return {
        option,
        score: matchingWords.length > 0 ? calculateSimilarity(normalizedTranscript, normalizedOption) : 0
      }
    })

    const bestMatch = wordMatches.reduce((best, current) =>
      current.score > best.score ? current : best,
      { option: null, score: 0 }
    )

    return bestMatch.score > 0.6 ? bestMatch.option : null
  }

  const speakAndStartRecognition = (questionText) => {
    if (!isSpeechSynthesisSupported || !isSpeechRecognitionSupported) return
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(questionText)
    utterance.lang = getLanguageCode()
    utterance.onend = () => {
      if (!recognitionRef.current) {
        recognitionRef.current = createRecognition()
      }
      if (recognitionRef.current) {
        setVoiceStatus(t('voiceListening'))
        setListening(true)
        recognitionRef.current.start()
      }
    }
    window.speechSynthesis.speak(utterance)
  }

  const createRecognition = () => {
    if (!isSpeechRecognitionSupported) {
      setVoiceError(t('voiceNotSupported'))
      return null
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = getLanguageCode()
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setListening(true)
      setVoiceStatus(t('voiceListening'))
    }

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setVoiceStatus(t('voiceHeardText', { text: transcript }))
      handleVoiceResult(transcript)
    }

    recognition.onerror = (event) => {
      setVoiceError(t('voiceRecognitionError'))
      setListening(false)
      if (event.error === 'no-speech') {
        setVoiceStatus(t('voiceNoSpeech'))
      }
    }

    recognition.onend = () => {
      setListening(false)
      if (currentVoiceField && !voiceError && !window.speechSynthesis.speaking) {
        setVoiceStatus(t('voiceWaiting'))
      }
    }

    return recognition
  }

  const askVoiceQuestion = (index) => {
    const field = fieldOrder[index]
    const label = fieldLabels[field]
    const options = fieldOptions[field].join(', ')
    setCurrentVoiceField(field)
    setVoiceError('')
    setVoiceStatus(t('voiceAskQuestion', { question: label }))

    const prompt = `${t('voiceSayQuestion', { question: label })} ${t('voiceOptions', { options })}`
    speakAndStartRecognition(prompt)
  }

  const stopVoice = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    setListening(false)
    setCurrentVoiceField(null)
    setVoiceStatus(t('voiceStopped'))
  }

  const handleVoiceResult = (transcript) => {
    if (!currentVoiceField) return

    const match = findMatchingOption(currentVoiceField, transcript)
    if (match) {
      const currentField = currentVoiceField
      setFormData((prev) => ({
        ...prev,
        [currentField]: match
      }))
      setVoiceError('')
      const confirmationMsg = t('voiceSelectedOption', {
        question: fieldLabels[currentField],
        answer: match
      })
      setVoiceStatus(confirmationMsg)
      setCurrentVoiceField(null)
      
      // Speak the confirmation
      speakText(confirmationMsg)
      
      const nextIndex = fieldOrder.indexOf(currentField) + 1
      if (nextIndex < fieldOrder.length) {
        // Reset recognition reference and ask next question after confirmation is spoken
        recognitionRef.current = null
        setTimeout(() => {
          askVoiceQuestion(nextIndex)
        }, 1000)
      } else {
        recognitionRef.current = null
        stopVoice()
        setTimeout(() => {
          const finalMsg = t('voiceAllInputsCollected')
          speakText(finalMsg)
          setTimeout(() => {
            handleSubmit()
          }, 500)
        }, 500)
      }
    } else {
      setVoiceError(t('voiceOptionNotRecognized', {
        question: fieldLabels[currentVoiceField],
        value: transcript
      }))
      const retryMsg = t('voiceTryAgain', { question: fieldLabels[currentVoiceField] })
      speakText(retryMsg)
      recognitionRef.current = null
      setListening(false)
      // Give user time to hear the retry message and prepare to speak again
      setTimeout(() => {
        askVoiceQuestion(fieldOrder.indexOf(currentVoiceField))
      }, 1800)
    }
  }

  useEffect(() => {
    if (voiceMode === 'voice') {
      if (!isSpeechRecognitionSupported || !isSpeechSynthesisSupported) {
        setVoiceError(t('voiceNotSupported'))
      } else {
        setVoiceError('')
        setVoiceStatus(t('voiceReady'))
        speakText(t('voiceEnabledInstructions'))
      }
    } else {
      stopVoice()
    }
  }, [voiceMode, language])

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
        recognitionRef.current = null
      }
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    if (e) e.preventDefault()
    const calculations = calculateSimulation(formData)
    onRunSimulation({
      ...formData,
      voiceMode,
      calculations
    })
  }

  return (
    <div className="simulation-form-container">
      <div className="form-header">
        <h1>{t('simulationHeader')}</h1>
        <p>{t('simulationSubtitle')}</p>
      </div>

      <div className="voice-mode-card card">
        <div className="voice-mode-row">
          <label>{t('voiceModeLabel')}</label>
          <div className="voice-options">
            <label>
              <input
                type="radio"
                name="voiceMode"
                value="none"
                checked={voiceMode === 'none'}
                onChange={() => setVoiceMode('none')}
              />
              {t('voiceModeWithoutVoice')}
            </label>
            <label>
              <input
                type="radio"
                name="voiceMode"
                value="voice"
                checked={voiceMode === 'voice'}
                onChange={() => setVoiceMode('voice')}
              />
              {t('voiceModeWithVoice')}
            </label>
          </div>
        </div>

        {voiceMode === 'voice' && (
          <div className="voice-controls">
            <div className="voice-buttons">
              <button
                type="button"
                className={`btn ${listening ? 'listening' : ''}`}
                onClick={() => askVoiceQuestion(0)}
                disabled={!isSpeechRecognitionSupported || !isSpeechSynthesisSupported || listening}
              >
                {t('startVoiceInput')}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={stopVoice}
                disabled={!listening}
              >
                {t('stopVoiceInput')}
              </button>
            </div>
            <div className="voice-status-row">
              {voiceError ? (
                <div className="voice-error">{voiceError}</div>
              ) : (
                <div className="voice-status">{voiceStatus}</div>
              )}
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="simulation-form card">
        <div className="form-grid">
          <SelectWithTooltip
            id="soil"
            name="soil"
            value={formData.soil}
            onChange={handleChange}
            label={t('soilType')}
            options={['Alluvial', 'Black', 'Red', 'Laterite', 'Sandy']}
            displayMap={{
              'Alluvial': getTranslatedOption('soil', 'Alluvial'),
              'Black': getTranslatedOption('soil', 'Black'),
              'Red': getTranslatedOption('soil', 'Red'),
              'Laterite': getTranslatedOption('soil', 'Laterite'),
              'Sandy': getTranslatedOption('soil', 'Sandy')
            }}
            details={dropdownDetails.soil}
          />

          <SelectWithTooltip
            id="water"
            name="water"
            value={formData.water}
            onChange={handleChange}
            label={t('waterFacility')}
            options={['Well/Borewell', 'River/Canal', 'Rainwater/Monsoon', 'Tube Well', 'Pond/Tank']}
            displayMap={{
              'Well/Borewell': getTranslatedOption('water', 'Well/Borewell'),
              'River/Canal': getTranslatedOption('water', 'River/Canal'),
              'Rainwater/Monsoon': getTranslatedOption('water', 'Rainwater/Monsoon'),
              'Tube Well': getTranslatedOption('water', 'Tube Well'),
              'Pond/Tank': getTranslatedOption('water', 'Pond/Tank')
            }}
            details={dropdownDetails.water}
          />

          <SelectWithTooltip
            id="crop"
            name="crop"
            value={formData.crop}
            onChange={handleChange}
            label={t('cropLabel')}
            options={['Rice', 'Wheat', 'Maize', 'Sugarcane', 'Cotton', 'Vegetables']}
            displayMap={{
              'Rice': getTranslatedOption('crop', 'Rice'),
              'Wheat': getTranslatedOption('crop', 'Wheat'),
              'Maize': getTranslatedOption('crop', 'Maize'),
              'Sugarcane': getTranslatedOption('crop', 'Sugarcane'),
              'Cotton': getTranslatedOption('crop', 'Cotton'),
              'Vegetables': getTranslatedOption('crop', 'Vegetables')
            }}
            details={dropdownDetails.crop}
          />

          <SelectWithTooltip
            id="seeds"
            name="seeds"
            value={formData.seeds}
            onChange={handleChange}
            label={t('seedsLabel')}
            options={['Local', 'Hybrid', 'High-yield']}
            displayMap={{
              'Local': getTranslatedOption('seeds', 'Local'),
              'Hybrid': getTranslatedOption('seeds', 'Hybrid'),
              'High-yield': getTranslatedOption('seeds', 'High-yield')
            }}
            details={dropdownDetails.seeds}
          />

          <SelectWithTooltip
            id="fertilizer"
            name="fertilizer"
            value={formData.fertilizer}
            onChange={handleChange}
            label={t('fertilizerLabel')}
            options={['Natural', 'Artificial', 'Mixed']}
            displayMap={{
              'Natural': getTranslatedOption('fertilizer', 'Natural'),
              'Artificial': getTranslatedOption('fertilizer', 'Artificial'),
              'Mixed': getTranslatedOption('fertilizer', 'Mixed')
            }}
            details={dropdownDetails.fertilizer}
          />

          <SelectWithTooltip
            id="weedManagement"
            name="weedManagement"
            value={formData.weedManagement}
            onChange={handleChange}
            label={t('weedManagementLabel')}
            options={['No Control', 'Basic Control', 'Advanced Control']}
            displayMap={{
              'No Control': getTranslatedOption('weedManagement', 'No Control'),
              'Basic Control': getTranslatedOption('weedManagement', 'Basic Control'),
              'Advanced Control': getTranslatedOption('weedManagement', 'Advanced Control')
            }}
            details={dropdownDetails.weedManagement}
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onBack}>
            {t('cancelButton')}
          </button>
          <button type="submit" className="btn btn-primary">
            {t('runSimulationButton')}
          </button>
        </div>
      </form>

      <div className="form-tips card">
        <h3>{t('proTipsTitle')}</h3>
        <ul>
          <li>{t('proTip1')}</li>
          <li>{t('proTip2')}</li>
          <li>{t('proTip3')}</li>
          <li>{t('proTip4')}</li>
          <li>{t('proTip5')}</li>
        </ul>
      </div>
    </div>
  )
}
