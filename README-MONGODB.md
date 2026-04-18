# 🌾 Smart Farm Simulator - MongoDB Integration Complete

## What's New

Your application now has:
- ✅ **User Authentication** (Register/Login)
- ✅ **MongoDB Database** integration
- ✅ **Simulation History** storage
- ✅ **User Session** management
- ✅ **JWT Tokens** for secure API access
- ✅ **API Backend** (Node.js/Express)

## Complete Project Structure

```
Hackathon2/
├── backend/                          # Backend Server (NEW)
│   ├── server.js                    # Main server file
│   ├── package.json                 # Backend dependencies
│   ├── .env                         # Backend configuration
│   ├── README.md                    # Backend setup guide
│   ├── models/
│   │   ├── User.js                  # User MongoDB schema
│   │   └── Simulation.js            # Simulation MongoDB schema
│   ├── routes/
│   │   ├── auth.js                  # Login/Register endpoints
│   │   └── simulations.js           # Simulation CRUD endpoints
│   └── middleware/
│       └── auth.js                  # JWT authentication
│
├── src/                             # Frontend (React)
│   ├── components/
│   │   ├── Auth.jsx                 # UPDATED: MongoDB integration
│   │   ├── SimulationForm.jsx       # Voice input & form
│   │   ├── Results.jsx              # Results display
│   │   └── ...
│   ├── utils/
│   │   ├── apiService.js            # NEW: API client
│   │   ├── translations.js          # Multi-language
│   │   └── ...
│   └── ...
├── .env                             # UPDATED: Backend URL
├── package.json                     # Frontend dependencies
└── README-MONGODB.md                # This file
```

## Quick Start Guide

### 1️⃣ Setup MongoDB

**Option A: Local MongoDB (Recommended for Development)**

**macOS:**
```bash
# Install with Homebrew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Verify it's running
mongosh
```

**Windows:**
```bash
# Download from: https://www.mongodb.com/try/download/community
# Install the MSI file
# MongoDB service will start automatically

# Verify it's running
mongosh
```

**Linux (Ubuntu/Debian):**
```bash
# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify it's running
mongosh
```

**Option B: MongoDB Atlas (Cloud - No Installation Needed)**

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster (choose M0 free tier)
4. Get connection string from "Connect" button
5. Copy to `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/farming-simulator
   ```

### 2️⃣ Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure MongoDB connection
# Edit .env file - update MONGODB_URI if needed
# Default: mongodb://localhost:27017/farming-simulator

# Start backend server
npm run dev
```

You should see:
```
✓ Connected to MongoDB
╔════════════════════════════════════════╗
║  Smart Farm Simulator Backend Started  ║
╠════════════════════════════════════════╣
║  Server: http://localhost:5000         ║
║  Database: MongoDB                     ║
║  Frontend: http://localhost:5173       ║
╚════════════════════════════════════════╝
```

### 3️⃣ Setup Frontend

```bash
# In a new terminal (from project root)
npm run dev
```

Visit: http://localhost:5173

### 4️⃣ Test the Integration

1. **Register Account**
   - Click "Create Account" in auth page
   - Fill in email, password, name
   - New user saved to MongoDB

2. **Login**
   - Use registered credentials
   - JWT token issued and stored

3. **Run Simulation**
   - Select options (soil, water, crop, etc.)
   - Or use voice input 🎤
   - Results saved to MongoDB with timestamp

4. **View History**
   - Dashboard shows last simulation
   - All simulations stored in database
   - Can compare past results

## API Reference

### User Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "farmer@example.com",
    "password": "password123",
    "name": "John Farmer"
  }'
```

### User Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "farmer@example.com",
    "password": "password123"
  }'
```

### Save Simulation
```bash
curl -X POST http://localhost:5000/api/simulations/save \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "inputs": {
      "soil": "Alluvial",
      "water": "River/Canal",
      "crop": "Rice",
      "seeds": "Hybrid",
      "fertilizer": "Mixed",
      "weedManagement": "Advanced Control"
    },
    "results": {
      "expectedYield": 50,
      "totalCost": 15000,
      "totalRevenue": 75000,
      "netProfit": 60000,
      "riskLevel": "Low"
    },
    "language": "en",
    "voiceMode": false
  }'
```

### Get Simulation History
```bash
curl -X GET "http://localhost:5000/api/simulations/history?limit=10&skip=0" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get User Statistics
```bash
curl -X GET http://localhost:5000/api/simulations/stats/overview \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId("..."),
  email: "farmer@example.com",
  password: "$2a$10$...", // bcrypt hashed
  name: "John Farmer",
  preferredLanguage: "en",
  createdAt: ISODate("2024-01-15T10:30:00.000Z"),
  lastLogin: ISODate("2024-01-15T11:45:00.000Z"),
  updatedAt: ISODate("2024-01-15T11:45:00.000Z")
}
```

### Simulations Collection
```javascript
{
  _id: ObjectId("..."),
  userId: ObjectId("..."), // References Users collection
  inputs: {
    soil: "Alluvial",
    water: "River/Canal",
    crop: "Rice",
    seeds: "Hybrid",
    fertilizer: "Mixed",
    weedManagement: "Advanced Control"
  },
  results: {
    expectedYield: 50,
    totalCost: 15000,
    totalRevenue: 75000,
    netProfit: 60000,
    riskLevel: "Low",
    profitMargin: 80
  },
  aiSuggestions: "Use hybrid seeds for better yield...",
  language: "en",
  voiceMode: false,
  createdAt: ISODate("2024-01-15T10:35:00.000Z"),
  updatedAt: ISODate("2024-01-15T10:35:00.000Z")
}
```

## Frontend Usage

The frontend automatically connects using the `apiService`:

```javascript
import { authAPI, simulationAPI } from './utils/apiService'

// Register
await authAPI.register('email@example.com', 'password', 'Name')

// Login
await authAPI.login('email@example.com', 'password')

// Save simulation
await simulationAPI.saveSimulation(inputs, results, suggestions, language, voiceMode)

// Get history
const { simulations } = await simulationAPI.getHistory(limit, skip)

// Get statistics
const { stats } = await simulationAPI.getStats()

// Logout
authAPI.logout()
```

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/farming-simulator
JWT_SECRET=your-super-secret-key-change-in-production
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Running Both Frontend & Backend

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Both will start on their respective ports:
- Backend: http://localhost:5000
- Frontend: http://localhost:5173

## Security Best Practices

✅ **Implemented:**
- Password hashing with bcryptjs
- JWT token authentication
- CORS protection
- Input validation
- Environment variables for secrets
- HttpOnly cookies support (can be added)

⚠️ **For Production:**
1. Change `JWT_SECRET` to a strong random string
2. Use HTTPS instead of HTTP
3. Enable MongoDB authentication
4. Set proper CORS origins
5. Use environment-specific .env files
6. Enable rate limiting on API endpoints
7. Add request logging
8. Set up database backups

## Troubleshooting

### MongoDB Connection Failed
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:**
- Check MongoDB is running: `mongosh`
- Verify MONGODB_URI in .env
- Restart MongoDB service

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:**
- Check FRONTEND_URL in backend .env
- For localhost development: `http://localhost:5173`
- Ensure backend is running

### Token Expired
```
401 Unauthorized - Invalid or expired token
```
**Solution:**
- Login again (new token generated)
- Tokens expire in 7 days
- Can extend expiry in auth.js

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:**
```bash
# Kill process on port 5000
lsof -ti :5000 | xargs kill -9
```

## Next Steps

1. ✅ Run backend and frontend
2. ✅ Create test account
3. ✅ Run a simulation
4. ✅ Check MongoDB for stored data
5. **Consider deploying to production:**
   - Backend: Heroku, Railway, DigitalOcean
   - Frontend: Vercel, Netlify
   - Database: MongoDB Atlas

## Viewing Stored Data

### Using MongoDB Compass (GUI)
1. Download: https://www.mongodb.com/products/compass
2. Connect to `mongodb://localhost:27017`
3. Browse `farming-simulator` database

### Using mongosh (CLI)
```bash
mongosh

# Show databases
show databases

# Use farming-simulator database
use farming-simulator

# Show collections
show collections

# View users
db.users.find().pretty()

# View simulations
db.simulations.find().pretty()

# Count simulations for a user
db.simulations.countDocuments({ userId: ObjectId("...") })

# Find user's simulations
db.simulations.find({ userId: ObjectId("...") }).pretty()
```

## Support

For issues or questions:
1. Check backend README: `backend/README.md`
2. Review error logs in terminal
3. Verify MongoDB is running
4. Check API endpoint response in browser console
5. Review database schema above

---

**Status:** ✅ MongoDB integration complete and ready to use!
