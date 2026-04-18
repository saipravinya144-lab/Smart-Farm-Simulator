# Smart Farm Simulator

A comprehensive web-based farming simulation application built with React and Vite. Users can simulate farming decisions with realistic yield, cost, revenue, and profit predictions based on comprehensive input parameters.

## Features

- **Smart Dashboard**: Welcome page with last simulation summary
- **Advanced Simulation Form**: Create farming scenarios with 6 comprehensive input categories
- **Real-time Results**: Detailed analysis with yield, cost, revenue, profit, and risk assessment
- **Performance Charts**: Visual comparison of yield, cost, and revenue metrics
- **Comparison Tool**: Side-by-side analysis of multiple simulations
- **Smart Recommendations**: Personalized optimization suggestions based on inputs
- **Sidebar Navigation**: Three-section navigation (Analyze, Optimize, Track) with logout
- **Dark Theme**: Agriculture-themed dark interface with green highlights
- **Fully Responsive**: Mobile-friendly design
- **Authentication**: Login/logout functionality

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173`

### Build

Create a production build:

```bash
npm run build
```

### Preview

Preview the production build:

```bash
npm run preview
```

## Simulation Logic

### Input Fields
- **Soil Type**: Alluvial, Black, Red, Laterite, Sandy
- **Water Facility**: Well/Borewell, River/Canal, Rainwater/Monsoon, Tube Well, Pond/Tank
- **Crop**: Rice, Wheat, Maize, Sugarcane, Cotton, Vegetables
- **Seeds**: Hybrid, Local, High-yield
- **Fertilizer**: Artificial, Natural, Mixed
- **Weed Management**: No Control, Basic Control, Advanced Control

### Yield Calculation Formula
```
Final Yield = Base Crop Yield × 
              Soil Factor × 
              Water Factor × 
              Seed Factor × 
              Fertilizer Factor × 
              Weed Management Factor
```

Base yields: Rice 2200kg, Wheat 1800kg, Maize 2000kg, Sugarcane 4000kg, Cotton 1500kg, Vegetables 2500kg

### Cost Calculation (₹ per acre)
- Base cost: ₹12,000
- Seeds: Local 0, Hybrid +₹2000, High-yield +₹3500
- Fertilizer: Natural +₹1500, Artificial +₹3000, Mixed +₹3500
- Water: Rainwater +₹500, Pond/Tank +₹1000, Tube Well +₹2000, Well/Borewell +₹2500, River/Canal +₹3000
- Weed Management: No Control 0, Basic +₹1000, Advanced +₹2500

### Revenue & Profit Calculation
- Market Price varies by crop: Rice ₹12/kg, Wheat ₹10/kg, Maize ₹11/kg, Sugarcane ₹8/kg, Cotton ₹15/kg, Vegetables ₹20/kg
- Revenue = Yield × Market Price
- Profit = Revenue - Total Cost

### Risk Assessment
- **High Risk**: Rainwater/Monsoon water facility OR (Local seeds + No weed control)
- **Medium Risk**: Sandy or Laterite soil
- **Low Risk**: All other conditions

## Project Structure

```
src/
├── components/
│   ├── Dashboard.jsx   # Home page
│   ├── SimulationForm.jsx  # Form for creating simulations
│   ├── Results.jsx     # Results display page with 6 metrics
│   ├── SimpleChart.jsx # Performance chart component
│   ├── Compare.jsx     # Comparison page
│   ├── Recommendations.jsx  # Optimization suggestions
│   └── Sidebar.jsx     # Navigation sidebar
├── utils/
│   └── calculations.js # Smart Farm simulation logic
├── App.jsx            # Main app with sidebar layout
├── App.css            # App styles
└── index.css          # Global styles
```

## Technologies Used

- React 18
- Vite
- CSS3 (with custom properties and animations)
- JavaScript ES6+
- Local State Management

## License

MIT
