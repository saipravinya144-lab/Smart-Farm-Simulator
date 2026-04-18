// Detailed information for each dropdown option
export const dropdownDetails = {
  soil: {
    Alluvial: {
      pH: '6.5 - 7.5',
      fertility: 'High',
      waterRetention: 'Moderate',
      drainage: 'Good',
      benefits: 'Most fertile, ideal for most crops'
    },
    Black: {
      pH: '7.5 - 8.5',
      fertility: 'High',
      waterRetention: 'High',
      drainage: 'Poor',
      benefits: 'Rich in iron & magnesium, retains moisture'
    },
    Red: {
      pH: '5.5 - 7.0',
      fertility: 'Moderate',
      waterRetention: 'Moderate',
      drainage: 'Good',
      benefits: 'Acidic, suitable for cereals & legumes'
    },
    Laterite: {
      pH: '5.0 - 6.5',
      fertility: 'Low-Moderate',
      waterRetention: 'High',
      drainage: 'Poor',
      benefits: 'Iron oxide rich, needs fertilizer amendments'
    },
    Sandy: {
      pH: '6.0 - 7.0',
      fertility: 'Low',
      waterRetention: 'Low',
      drainage: 'Excellent',
      benefits: 'Quick drainage, needs frequent irrigation & fertilization'
    }
  },

  water: {
    'Well/Borewell': {
      availability: 'Year-round',
      reliability: 'High',
      costFactor: 'High',
      depthRange: '15-40m',
      sustainable: 'Medium'
    },
    'River/Canal': {
      availability: 'Seasonal',
      reliability: 'Very High',
      costFactor: 'Moderate',
      depthRange: 'Surface',
      sustainable: 'High'
    },
    'Rainwater/Monsoon': {
      availability: 'Seasonal',
      reliability: 'Low-Medium',
      costFactor: 'Low',
      depthRange: 'Direct collection',
      sustainable: 'Very High'
    },
    'Tube Well': {
      availability: 'Year-round',
      reliability: 'High',
      costFactor: 'Very High',
      depthRange: '30-150m',
      sustainable: 'Low'
    },
    'Pond/Tank': {
      availability: 'Seasonal',
      reliability: 'Medium',
      costFactor: 'Low',
      depthRange: 'Surface storage',
      sustainable: 'High'
    }
  },

  crop: {
    Rice: {
      profitability: '₹40,000-50,000/acre',
      daysToGrow: '120-150 days',
      waterNeeded: '1000-1500mm',
      riskLevel: 'Medium',
      sustainability: 'Moderate',
      bestSoil: 'Alluvial/Black'
    },
    Wheat: {
      profitability: '₹30,000-40,000/acre',
      daysToGrow: '120-140 days',
      waterNeeded: '400-500mm',
      riskLevel: 'Low',
      sustainability: 'High',
      bestSoil: 'Black/Alluvial'
    },
    Maize: {
      profitability: '₹35,000-45,000/acre',
      daysToGrow: '110-130 days',
      waterNeeded: '500-700mm',
      riskLevel: 'Low-Medium',
      sustainability: 'High',
      bestSoil: 'Alluvial/Red'
    },
    Sugarcane: {
      profitability: '₹60,000-80,000/acre',
      daysToGrow: '300-360 days',
      waterNeeded: '1500-2250mm',
      riskLevel: 'Medium',
      sustainability: 'Low-Medium',
      bestSoil: 'Alluvial/Black'
    },
    Cotton: {
      profitability: '₹45,000-60,000/acre',
      daysToGrow: '160-180 days',
      waterNeeded: '600-900mm',
      riskLevel: 'High',
      sustainability: 'Medium',
      bestSoil: 'Black/Red'
    },
    Vegetables: {
      profitability: '₹80,000-150,000/acre',
      daysToGrow: '60-90 days',
      waterNeeded: '400-600mm',
      riskLevel: 'Medium-High',
      sustainability: 'High',
      bestSoil: 'Alluvial'
    }
  },

  seeds: {
    Local: {
      yieldIncrease: 'Base (1x)',
      cost: 'Low',
      adaptation: 'Excellent',
      riskFactor: 'Low',
      sustainability: 'High'
    },
    Hybrid: {
      yieldIncrease: '20% higher',
      cost: 'Medium',
      adaptation: 'Good',
      riskFactor: 'Medium',
      sustainability: 'Medium'
    },
    'High-yield': {
      yieldIncrease: '30% higher',
      cost: 'High',
      adaptation: 'Good',
      riskFactor: 'Medium',
      sustainability: 'Low-Medium'
    }
  },

  fertilizer: {
    Natural: {
      cost: 'Low-Medium',
      yieldBoost: '5%',
      sustainability: 'Very High',
      soilHealth: 'Improves',
      timeToEffect: 'Slow'
    },
    Artificial: {
      cost: 'Medium-High',
      yieldBoost: '15%',
      sustainability: 'Low',
      soilHealth: 'Degrades over time',
      timeToEffect: 'Fast'
    },
    Mixed: {
      cost: 'Medium',
      yieldBoost: '20%',
      sustainability: 'High',
      soilHealth: 'Maintains',
      timeToEffect: 'Moderate'
    }
  },

  weedManagement: {
    'No Control': {
      costSavings: 'High',
      yieldLoss: '30-40%',
      laborRequired: 'None',
      sustainability: 'Negative',
      effectiveness: 'None'
    },
    'Basic Control': {
      costSavings: 'Medium',
      yieldLoss: '5-10%',
      laborRequired: 'Low',
      sustainability: 'Medium',
      effectiveness: 'Moderate'
    },
    'Advanced Control': {
      costSavings: 'Low',
      yieldLoss: '0-2%',
      laborRequired: 'High',
      sustainability: 'High',
      effectiveness: 'Excellent'
    }
  }
}
