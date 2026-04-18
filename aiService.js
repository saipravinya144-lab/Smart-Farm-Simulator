import { translateAi } from './translations'

const DEFAULT_FARMING_TIPS = `1. Practice crop rotation to maintain soil health and reduce pests naturally.
2. Use organic compost and green manure to improve soil fertility without expensive chemicals.
3. Monitor soil moisture daily and irrigate only when soil is dry to save water and reduce costs.
4. Use certified seeds and proper spacing for better plant health and significantly higher yields.
5. Apply fertilizer based on crop growth stage and soil tests, focusing on NPK balance for best results.
6. Scout fields weekly for pests and diseases, and use integrated pest management to reduce losses.
7. Use mulching to retain soil moisture, suppress weeds, and regulate soil temperature naturally.
8. Harvest crops at optimal maturity to maximize quality, protect revenue, and reduce post-harvest loss.
9. Maintain clean equipment to prevent disease spread between fields and maintain soil health.
10. Keep detailed records of inputs, costs, yields, and weather to improve decisions year after year.`

function buildSuggestionText(simulationData) {
  const crop = simulationData.crop
  const soil = simulationData.soil.toLowerCase()
  const water = simulationData.water.toLowerCase()
  const weed = simulationData.weedManagement.toLowerCase()

  return `1. Yield Improvement: For ${crop}, improve ${soil} soil by adding organic matter and ensuring balanced nutrient levels. Consider soil testing and applying fertilizer according to crop stage.

2. Cost Reduction: Optimize ${water} use with controlled irrigation and avoid excess fertilizer by applying only what the crop needs. Reduce wastage by timing inputs properly.

3. Risk Management: Maintain good field hygiene and scout for pests frequently. Combine your ${weed} weed control plan with crop rotation to reduce disease and pest pressure.

4. Alternative Strategy: Consider diversifying with a compatible secondary crop or cover crop to improve soil health and spread financial risk. Small changes in seed quality and fertilizer timing can boost returns.`
}

export async function getAISuggestions(simulationData) {
  try {
    const suggestions = buildSuggestionText(simulationData)
    return {
      suggestions,
      success: true
    }
  } catch (error) {
    console.error('Local AI Suggestions Error:', error)
    return {
      suggestions: buildSuggestionText(simulationData),
      error: error.message,
      success: true,
      fallback: true
    }
  }
}

function normalizeText(text) {
  return (text || '').toLowerCase().replace(/[.,!?]/g, '')
}

function extractEntity(text, list) {
  return list.find((item) => text.includes(item))
}

const KNOWN_CROPS = ['rice', 'wheat', 'sugarcane', 'cotton', 'potato', 'tomato', 'maize', 'corn', 'soybean', 'barley']
const KNOWN_SOILS = ['loamy', 'sandy', 'clay', 'alluvial', 'laterite', 'black', 'red', 'silty', 'chalky']
const KNOWN_WATER = ['drip', 'sprinkler', 'rainwater', 'canal', 'well', 'borewell', 'monsoon']

function buildChatResponse(conversationHistory) {
  const allUserText = conversationHistory
    .filter((msg) => msg.role === 'user')
    .map((msg) => msg.content)
    .join(' ')

  const normalized = normalizeText(allUserText)
  const lastUser = normalizeText(conversationHistory.slice().reverse().find((msg) => msg.role === 'user')?.content || '')
  const crop = extractEntity(normalized, KNOWN_CROPS)
  const soil = extractEntity(normalized, KNOWN_SOILS)
  const water = extractEntity(normalized, KNOWN_WATER)

  const replyBlocks = []

  if (lastUser.includes('yield')) {
    replyBlocks.push({ key: 'aiResponseYield', params: { crop: crop || 'your crop' } })
  }

  if (lastUser.includes('cost') || lastUser.includes('expense') || lastUser.includes('budget')) {
    replyBlocks.push({ key: 'aiResponseCost' })
  }

  if (lastUser.includes('soil') || soil) {
    replyBlocks.push({ key: 'aiResponseSoil', params: { soil: soil || 'soil' } })
  }

  if (lastUser.includes('water') || lastUser.includes('irrig')) {
    replyBlocks.push({ key: 'aiResponseWater' })
  }

  if (lastUser.includes('fertilizer') || lastUser.includes('nutrient')) {
    replyBlocks.push({ key: 'aiResponseFertilizer' })
  }

  if (lastUser.includes('pest') || lastUser.includes('disease')) {
    replyBlocks.push({ key: 'aiResponsePest' })
  }

  if (lastUser.includes('seed') || lastUser.includes('variety')) {
    replyBlocks.push({ key: 'aiResponseSeed' })
  }

  if (lastUser.includes('risk') || lastUser.includes('weather') || lastUser.includes('monsoon')) {
    replyBlocks.push({ key: 'aiResponseRisk' })
  }

  if (replyBlocks.length === 0) {
    return {
      introKey: 'aiResponseFallback',
      introParams: {},
      replies: []
    }
  }

  return {
    introKey: crop ? 'aiResponseIntroCrop' : 'aiResponseIntroGeneric',
    introParams: { crop: crop || 'your crop' },
    replies: replyBlocks
  }
}

function localizeResponse(responseData, language) {
  const intro = translateAi(language, responseData.introKey, responseData.introParams)
  const replies = responseData.replies.map((item) => translateAi(language, item.key, item.params || {}))
  return `${intro} ${replies.join(' ')}`.trim()
}

export async function chatWithAI(conversationHistory, language = 'en') {
  try {
    const responseData = buildChatResponse(conversationHistory)
    const response = localizeResponse(responseData, language)
    return {
      response,
      success: true
    }
  } catch (error) {
    console.error('Local chat error:', error)
    return {
      response: translateAi(language, 'aiResponseFallback'),
      error: error.message,
      success: false
    }
  }
}

export async function getAIPoweredTips() {
  try {
    return {
      tips: DEFAULT_FARMING_TIPS,
      success: true
    }
  } catch (error) {
    console.error('Local tips error:', error)
    return {
      tips: DEFAULT_FARMING_TIPS,
      error: error.message,
      success: true,
      fallback: true
    }
  }
}
