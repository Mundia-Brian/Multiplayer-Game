# 🚀 Deployment Checklist

## ✅ Pre-Deployment Checklist

### Backend (Render)
- [ ] Fork repository to your GitHub account
- [ ] Ensure `server/package.json` has all dependencies
- [ ] Verify `server/server.js` uses environment variables
- [ ] Check CORS configuration in server code

### Frontend (Netlify)
- [ ] Ensure `client/package.json` exists
- [ ] Verify `netlify.toml` configuration
- [ ] Check client-side server URL configuration

## 🔧 Render Deployment Steps

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

3. **Configure Service**
   ```
   Name: multiplayer-game-backend
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   Root Directory: server
   ```

4. **Add Environment Variables**
   ```
   NODE_ENV = production
   PORT = 3000
   ALLOWED_ORIGINS = https://your-netlify-app-name.netlify.app
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy the service URL (e.g., `https://your-app.onrender.com`)

## 🌐 Netlify Deployment Steps

1. **Create Netlify Account**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub

2. **Deploy Site**
   - Click "New site from Git"
   - Connect your GitHub repository

3. **Configure Build Settings**
   ```
   Base directory: client
   Build command: npm run build
   Publish directory: client
   ```

4. **Deploy**
   - Click "Deploy site"
   - Wait for deployment
   - Copy the site URL (e.g., `https://your-app.netlify.app`)

## 🔄 Post-Deployment Configuration

### Option 1: Environment Variables (Recommended)

1. **Update Render Environment Variables:**
   - Go to your Render service dashboard
   - Add environment variable:
     ```
     ALLOWED_ORIGINS = https://your-actual-netlify-app.netlify.app
     ```

2. **Update Client Backend URL:**
   - Edit `client/index.html`
   - Replace the placeholder URL with your Render service URL:
     ```javascript
     return "https://your-actual-render-service.onrender.com";
     ```

### Option 2: Manual File Updates

1. **Update Backend URL in Client:**
   ```javascript
   // In client/index.html, find getServerUrl() function
   return "https://your-actual-render-service.onrender.com";
   ```

2. **Update CORS Origins in Server:**
   ```javascript
   // In server/server.js, update ALLOWED_ORIGINS environment variable
   ALLOWED_ORIGINS = https://your-actual-netlify-app.netlify.app
   ```

### Redeploy After Changes
- **Netlify**: Automatically redeploys on Git push
- **Render**: Automatically redeploys on Git push

## 🧪 Testing Deployment

1. **Test Backend**
   - Visit your Render service URL
   - Should see server running message

2. **Test Frontend**
   - Visit your Netlify site URL
   - Should see the game hub interface

3. **Test Connection**
   - Open browser console
   - Check for connection messages
   - Verify no CORS errors

## 🚨 Troubleshooting

### Common Issues:
- **CORS Errors**: Update ALLOWED_ORIGINS environment variable in Render
- **Connection Failed**: Check backend URL in client
- **Build Failures**: Check package.json dependencies
- **Port Issues**: Verify PORT environment variable

### Debug Steps:
1. Check Render logs for backend errors
2. Check Netlify logs for build errors
3. Test locally first
4. Verify all environment variables are set

## 📝 Quick Reference

### Your URLs:
- **Netlify**: `https://your-app-name.netlify.app`
- **Render**: `https://your-service-name.onrender.com`

### Environment Variables for Render:
```
NODE_ENV = production
PORT = 3000
ALLOWED_ORIGINS = https://your-app-name.netlify.app
``` 