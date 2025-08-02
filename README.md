# 🎮 Multiplayer Game Hub

A real-time multiplayer game platform with multiple games including Tic Tac Toe, Trivia, Drawing, Card Games, and Dice Games.

## 🚀 Quick Deploy

### 🌐 Netlify (Frontend)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

### 🔧 Render (Backend)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

## 📋 Setup Instructions

### Backend (Render) Deployment:
1. Fork this repository
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: `multiplayer-game-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `server`
6. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `3000`
7. Deploy!

### Frontend (Netlify) Deployment:
1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Click "New site from Git"
3. Connect your GitHub repository
4. Configure:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client`
5. Deploy!

### 🔧 Post-Deployment Configuration:
1. Update the backend URL in `client/index.html`:
   ```javascript
   // Replace with your actual Render service URL
   return "https://your-backend-service-name.onrender.com";
   ```
2. Update CORS origins in `server/server.js`:
   ```javascript
   // Replace with your actual Netlify domain
   ['https://your-app-name.netlify.app']
   ```

## 🎮 Available Games
- **Tic Tac Toe**: Classic X's and O's
- **Trivia**: Test your knowledge
- **Drawing**: Collaborative drawing
- **Card Games**: Multiplayer card games
- **Dice Games**: Roll the dice!

## 🛠️ Local Development
```bash
# Backend
cd server
npm install
npm run dev

# Frontend
cd client
npm install
npm start
```

## 📁 Project Structure
```
├── client/          # Frontend (Netlify)
│   ├── index.html   # Main application
│   └── package.json # Frontend dependencies
├── server/          # Backend (Render)
│   ├── server.js    # Express + Socket.IO server
│   └── package.json # Backend dependencies
├── netlify.toml     # Netlify configuration
├── render.yaml      # Render configuration
└── README.md        # This file
```

## 🔧 Environment Variables
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)
- `ALLOWED_ORIGINS`: CORS origins (comma-separated)

## 🚨 Important Notes
- Update the backend URL in the client code after deployment
- Configure CORS origins for production
- The backend uses in-memory storage (data resets on restart)
- Consider adding a database for persistent data
