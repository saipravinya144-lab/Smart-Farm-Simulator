# MongoDB Integration - File Summary

## 📁 New Files Created

### Backend Structure
```
backend/
├── server.js                    # Main Express server with MongoDB connection
├── package.json                 # Backend dependencies (Express, Mongoose, etc.)
├── .env                         # Environment configuration
├── .gitignore                   # Git ignore patterns
├── README.md                    # Backend-specific setup guide
├── models/
│   ├── User.js                  # User schema (email, password, preferences)
│   └── Simulation.js            # Simulation schema (inputs, results, metadata)
├── routes/
│   ├── auth.js                  # POST /register, /login endpoints
│   └── simulations.js           # CRUD operations for simulations
└── middleware/
    └── auth.js                  # JWT token verification middleware
```

### Frontend Updates
```
src/
├── utils/
│   └── apiService.js            # API client library (NEW)
├── components/
│   └── Auth.jsx                 # UPDATED: Now calls backend API
└── App.jsx                      # UPDATED: Saves simulations to DB
```

### Root Level
```
.env                             # UPDATED: Added REACT_APP_API_URL
README-MONGODB.md                # Complete setup and integration guide
setup.sh                         # Bash script for macOS/Linux setup
setup.bat                        # Batch script for Windows setup
```

## 🔄 Modified Files

### 1. `backend/server.js` (NEW)
**Purpose:** Main Express server
**Key Features:**
- MongoDB connection with Mongoose
- CORS configuration
- Routes mounting (auth and simulations)
- Error handling
- Graceful shutdown

```javascript
// Connects to MongoDB
mongoose.connect(MONGODB_URI)

// Handles all /api/auth/* routes
app.use('/api/auth', authRoutes)

// Handles all /api/simulations/* routes
app.use('/api/simulations', simulationRoutes)
```

---

### 2. `backend/models/User.js` (NEW)
**Purpose:** Defines MongoDB User schema
**Schema:**
- `email` - Unique, validated
- `password` - Hashed with bcryptjs
- `name` - User's full name
- `preferredLanguage` - Default 'en'
- `createdAt` - Registration timestamp
- `lastLogin` - Track user activity
- `timestamps` - Auto-added updatedAt

---

### 3. `backend/models/Simulation.js` (NEW)
**Purpose:** Defines MongoDB Simulation schema
**Schema:**
- `userId` - Reference to User (ObjectId)
- `inputs` - Form inputs (soil, water, crop, etc.)
- `results` - Calculation outputs (yield, cost, profit, etc.)
- `aiSuggestions` - Optional AI recommendations
- `language` - Which language was selected
- `voiceMode` - Whether voice input was used
- `timestamps` - Auto-added createdAt/updatedAt

---

### 4. `backend/routes/auth.js` (NEW)
**Purpose:** Authentication endpoints
**Endpoints:**
- `POST /register` - Create new user
  - Validates input
  - Hashes password
  - Returns JWT token
- `POST /login` - User login
  - Verifies credentials
  - Updates lastLogin
  - Returns JWT token

---

### 5. `backend/routes/simulations.js` (NEW)
**Purpose:** Simulation CRUD operations
**Endpoints:**
- `POST /save` - Save new simulation
- `GET /history` - Get user's simulations (paginated)
- `GET /:simulationId` - Get specific simulation
- `DELETE /:simulationId` - Delete simulation
- `GET /stats/overview` - Get user statistics

---

### 6. `backend/middleware/auth.js` (NEW)
**Purpose:** JWT verification middleware
**Function:**
- Extracts token from Authorization header
- Verifies token signature
- Attaches userId to request
- Returns 401 if token invalid/expired

```javascript
// Usage in routes
router.post('/save', authMiddleware, (req, res) => {
  // req.userId is available here
})
```

---

### 7. `src/utils/apiService.js` (NEW)
**Purpose:** Frontend API client library
**Methods:**

**Auth API:**
```javascript
authAPI.register(email, password, name)
authAPI.login(email, password)
authAPI.logout()
```

**Simulation API:**
```javascript
simulationAPI.saveSimulation(inputs, results, suggestions, language, voiceMode)
simulationAPI.getHistory(limit, skip)
simulationAPI.getSimulation(simulationId)
simulationAPI.deleteSimulation(simulationId)
simulationAPI.getStats()
```

**Token Management:**
```javascript
setAuthToken(token)          // Save token to localStorage + send in headers
getAuthToken()               // Retrieve token from localStorage
```

---

### 8. `src/components/Auth.jsx` (UPDATED)
**Changes:**
- Import `authAPI` and `setAuthToken`
- Replace setTimeout mock with actual API calls
- Add error handling for API responses
- Display API errors in UI

**Before:**
```javascript
// Mock API with timeout
setTimeout(() => {
  onLogin(userData)
}, 1500)
```

**After:**
```javascript
// Real API call
const result = await authAPI.register(email, password, name)
if (result.token) {
  setAuthToken(result.token)
  onLogin(result.user)
}
```

---

### 9. `src/App.jsx` (UPDATED)
**Changes:**
- Import `simulationAPI` and `getAuthToken`
- Check for existing auth token on app load
- Save simulations to database in `handleRunSimulation()`
- Persist user data in localStorage
- Clear data on logout

**Key Addition:**
```javascript
const handleRunSimulation = async (formData) => {
  // Save to local state
  setCurrentSimulation(simulation)
  
  // Save to database
  await simulationAPI.saveSimulation(
    formData.inputs,
    formData.calculations?.results,
    '',
    language,
    formData.voiceMode
  )
}
```

---

### 10. `.env` (UPDATED)
**Changes:**
- Added backend API URL

```env
# Old
VITE_OLLAMA_URL=http://localhost:11434

# New
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🚀 How It Works Together

```
┌─────────────────────────────────────────────────────────────┐
│                     USER INTERACTION                        │
└──────────┬──────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────┐
│              REACT FRONTEND (port 5173)                     │
├─────────────────────────────────────────────────────────────┤
│  Auth.jsx          - Login/Register form                    │
│  SimulationForm.jsx - Collects inputs                       │
│  Results.jsx       - Shows outputs                          │
│  apiService.js     - Makes HTTP requests                    │
└──────────┬──────────────────────────────────────────────────┘
           │
           │ HTTP Requests (with JWT token)
           │
           ▼
┌─────────────────────────────────────────────────────────────┐
│             EXPRESS BACKEND (port 5000)                     │
├─────────────────────────────────────────────────────────────┤
│  server.js                                                  │
│  ├─ Auth Routes (register, login)                           │
│  │  ├─ Hash password with bcryptjs                          │
│  │  ├─ Save/validate in User collection                     │
│  │  └─ Issue JWT token                                      │
│  │                                                          │
│  └─ Simulation Routes (save, get, delete)                   │
│     ├─ Verify JWT token                                     │
│     ├─ Save/retrieve from Simulations collection            │
│     └─ Ensure user can only access own data                 │
└──────────┬──────────────────────────────────────────────────┘
           │
           │ CRUD Operations (MongoDB driver)
           │
           ▼
┌─────────────────────────────────────────────────────────────┐
│              MONGODB DATABASE                               │
├─────────────────────────────────────────────────────────────┤
│  farming-simulator (database)                               │
│  ├─ users                                                   │
│  │  ├─ email (indexed)                                      │
│  │  ├─ password (hashed)                                    │
│  │  ├─ name                                                 │
│  │  └─ preferences                                          │
│  │                                                          │
│  └─ simulations                                             │
│     ├─ userId (indexed)                                     │
│     ├─ inputs                                               │
│     ├─ results                                              │
│     └─ createdAt (indexed for sorting)                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Security Implementation

### Password Security
- **Backend:** `bcryptjs` hashes passwords with salt rounds
- Users never see their plain password
- On login, entered password is hashed and compared

### Session Security
- **JWT Tokens:** Stateless authentication
- Expires in 7 days
- Embedded in Authorization header
- Verified on every protected endpoint

### Data Privacy
- Users can only access their own simulations
- `userId` field ensures data isolation
- All queries filtered by authenticated user

### Input Validation
- Email format validation
- Password length check (minimum 6 chars)
- CORS restricts requests to frontend origin

---

## 📊 API Response Examples

### Register Success
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "farmer@example.com",
    "name": "John Farmer",
    "preferredLanguage": "en"
  }
}
```

### Save Simulation Success
```json
{
  "message": "Simulation saved successfully",
  "simulation": {
    "id": "507f191e810c19729de860ea",
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
    "createdAt": "2024-01-15T10:35:00.000Z"
  }
}
```

### Get History Success
```json
{
  "message": "Simulations retrieved successfully",
  "simulations": [
    { /* simulation object */ },
    { /* simulation object */ }
  ],
  "pagination": {
    "total": 25,
    "limit": 10,
    "skip": 0,
    "hasMore": true
  }
}
```

---

## 🔧 Environment Variables

### Backend (.env)
| Variable | Purpose | Default |
|----------|---------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | Database connection | mongodb://localhost:27017/farming-simulator |
| JWT_SECRET | Token signing key | Must change in production |
| NODE_ENV | Environment mode | development |
| FRONTEND_URL | CORS origin | http://localhost:5173 |

### Frontend (.env)
| Variable | Purpose | Default |
|----------|---------|---------|
| REACT_APP_API_URL | Backend API URL | http://localhost:5000/api |

---

## 📚 Database Indexes

**Created Automatically:**

```javascript
// User collection
db.users.createIndex({ email: 1 })    // For unique constraint and quick lookup

// Simulation collection
db.simulations.createIndex({ userId: 1 })        // Find simulations by user
db.simulations.createIndex({ createdAt: -1 })    // Sort by date
```

---

## ✅ Testing the Integration

1. **Register New User**
   - Visit http://localhost:5173
   - Click "Create Account"
   - Fill form and submit
   - Check MongoDB: `db.users.find()`

2. **Login**
   - Use registered credentials
   - JWT token stored in localStorage
   - Visible in browser DevTools: Application → Storage → Local Storage

3. **Run Simulation**
   - Fill simulation form
   - Click "Run Simulation"
   - Check MongoDB: `db.simulations.find()`

4. **View History**
   - Simulations appear on dashboard
   - All data persisted across page refreshes
   - Data belongs only to logged-in user

---

## 🐛 Debugging Tips

### Check Backend Logs
```
[timestamp] ✓ Connected to MongoDB
[timestamp] POST /api/auth/login 200
[timestamp] POST /api/simulations/save 201
```

### Check Frontend Console
```
F12 → Console tab
- API call logs
- Token storage
- Error messages
```

### View Database Directly
```bash
mongosh
use farming-simulator
db.users.findOne()
db.simulations.findOne()
```

### Check Network Requests
```
F12 → Network tab
- Click button
- Watch requests to http://localhost:5000/api/*
- View request/response headers and body
```

---

## 📞 Support Resources

- Backend Setup: `backend/README.md`
- Full Integration Guide: `README-MONGODB.md`
- Express Docs: https://expressjs.com/
- Mongoose Docs: https://mongoosejs.com/
- MongoDB Docs: https://docs.mongodb.com/
- JWT Docs: https://jwt.io/

---

**Integration Status:** ✅ Complete and Ready for Development
