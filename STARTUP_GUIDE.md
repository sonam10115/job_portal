# Job Portal - Startup Guide

## Prerequisites
- Node.js installed
- MongoDB Atlas account with active cluster
- Two terminal windows/tabs

## Quick Start

### 1. Start Backend Server
```powershell
cd "e:\job portal\backend"
npm install
npm run dev
```

Expected output:
```
✅ Server running on http://localhost:8001
📊 Health check: http://localhost:8001/api/health
✅ MongoDB connected successfully
```

### 2. Start Frontend Server (in another terminal)
```powershell
cd "e:\job portal\frontend"
npm install
npm run dev
```

Expected output:
```
VITE v7.2.2  ready in XXX ms

➜  Local:   http://localhost:5173/
```

### 3. Test the Connection
- Open browser and go to `http://localhost:5173/`
- Try registering a new account
- If you see the registration success toast, everything is working!

## Troubleshooting

### Error: "Network Error: ERR_CONNECTION_REFUSED"
- **Cause**: Backend server is not running
- **Fix**: Make sure you ran `npm run dev` in the backend folder and see the "Server running" message

### Error: "MongoDB connection error"
- **Cause**: Database connection failed
- **Fix**: 
  1. Check MONGODB_URI in `backend/.env`
  2. Verify MongoDB Atlas cluster is active
  3. Whitelist your IP in MongoDB Atlas security settings

### Port Already in Use
If port 8001 or 5173 is already in use:
- Kill the process: `netstat -ano | findstr :8001` then `taskkill /PID <PID> /F`
- Or edit `backend/index.js` and `frontend/vite.config.js` to use different ports

## Project Structure
```
backend/          - Node.js/Express API server (port 8001)
├── controllers/  - Business logic
├── routes/       - API endpoints
├── models/       - MongoDB schemas
└── middleware/   - Auth, file upload, etc.

frontend/         - React app (port 5173)
├── src/
│   ├── components/  - React components
│   ├── utils/       - Helper functions & API endpoints
│   └── context/     - State management
```

## API Endpoints

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `POST /api/users/logout` - Logout user
- `POST /api/users/profile/update` - Update user profile

### Health Check
- `GET /api/health` - Check if backend is running

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb+srv://kesharwanisonam60_db_user:sonasona@cluster0.lh4keyo.mongodb.net/
```

### Frontend (src/utils/data.js)
```javascript
export const USER_API_ENDPOINT = "http://localhost:8001/api/users";
```
