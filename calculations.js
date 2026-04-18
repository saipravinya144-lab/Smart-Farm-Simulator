export function calculateSimulation(formData) {
  const { soil, water, crop, seeds, fertilizer, weedManagement } = formData

  // Base yield by crop (kg per acre)
  const baseYields = {
    Rice: 2200,
    Wheat: 1800,
    Maize: 2000,
    Sugarcane: 4000,
    Cotton: 1500,
    Vegetables: 2500
  }

  // Soil factors
  const soilFactors = {
    Alluvial: 1.25,
    Black: 1.20,
    Red: 1.00,
    Laterite: 0.90,
    Sandy: 0.80
  }

  // Water factors
  const waterFactors = {
    'River/Canal': 1.25,
    'Well/Borewell': 1.15,
    'Tube Well': 1.10,
    'Pond/Tank': 1.05,
    'Rainwater/Monsoon': 0.85
  }

  // Seed factors
  const seedFactors = {
    'High-yield': 1.30,
    Hybrid: 1.20,
    Local: 1.00
  }

  // Fertilizer factors
  const fertilizerFactors = {
    Mixed: 1.20,
    Artificial: 1.15,
    Natural: 1.05
  }

  // Weed management factors
  const weedFactors = {
    'Advanced Control': 1.15,
    'Basic Control': 1.05,
    'No Control': 0.85
  }

  // Market prices (₹ per kg)
  const marketPrices = {
    Rice: 12,
    Wheat: 10,
    Maize: 11,
    Sugarcane: 8,
    Cotton: 15,
    Vegetables: 20
  }

  // Calculate yield
  const baseYield = baseYields[crop] || 2200
  const yield_kg = baseYield * 
    soilFactors[soil] * 
    waterFactors[water] * 
    seedFactors[seeds] * 
    fertilizerFactors[fertilizer] * 
    weedFactors[weedManagement]

  // Calculate cost
  let cost = 12000

  // Seeds cost
  if (seeds === 'Hybrid') cost += 2000
  if (seeds === 'High-yield') cost += 3500

  // Fertilizer cost
  if (fertilizer === 'Natural') cost += 1500
  if (fertilizer === 'Artificial') cost += 3000
  if (fertilizer === 'Mixed') cost += 3500

  // Water facility cost
  if (water === 'Rainwater/Monsoon') cost += 500
  if (water === 'Pond/Tank') cost += 1000
  if (water === 'Tube Well') cost += 2000
  if (water === 'Well/Borewell') cost += 2500
  if (water === 'River/Canal') cost += 3000

  // Weed management cost
  if (weedManagement === 'Basic Control') cost += 1000
  if (weedManagement === 'Advanced Control') cost += 2500

  // Calculate revenue and profit
  const price = marketPrices[crop] || 10
  const revenue = Math.round(yield_kg * price)
  const profit = revenue - cost

  // Determine risk level
  let riskLevel = 'Low Risk'
  if (water === 'Rainwater/Monsoon') {
    riskLevel = 'High Risk'
  } else if (soil === 'Sandy' || soil === 'Laterite') {
    riskLevel = 'Medium Risk'
  } else if (seeds === 'Local' && weedManagement === 'No Control') {
    riskLevel = 'High Risk'
  }

  return {
    yield_kg: Math.round(yield_kg),
    cost: Math.round(cost),
    revenue: Math.round(revenue),
    profit: Math.round(profit),
    riskLevel,
    marketPrice: price
  }
}

export function getRecommendations(formData) {
  const recommendations = []

  if (formData.seeds === 'Local') {
    recommendations.push({
      type: 'Seeds',
      current: 'Local',
      suggestion: 'Hybrid',
      benefit: '+20% yield improvement'
    })
  }

  if (formData.weedManagement === 'No Control') {
    recommendations.push({
      type: 'Weed Management',
      current: 'No Control',
      suggestion: 'Advanced Control',
      benefit: '+15% yield and reduced pest damage'
    })
  }

  if (formData.soil === 'Sandy' || formData.soil === 'Laterite') {
    recommendations.push({
      type: 'Fertilizer',
      current: formData.fertilizer,
      suggestion: 'Mixed Fertilizer',
      benefit: 'Better nutrient balance for ' + formData.soil + ' soil'
    })
  }

  if (formData.water === 'Rainwater/Monsoon') {
    recommendations.push({
      type: 'Water Management',
      current: 'Rainwater/Monsoon',
      suggestion: 'Well/Borewell or River/Canal',
      benefit: 'Reliable water supply reduces high risk'
    })
  }

  return recommendations
}
