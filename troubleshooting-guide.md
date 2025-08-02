# 🔧 Troubleshooting API & Socket Connections

## 🚨 Quick Diagnostic Steps:

### **1. Test Backend Directly**
Visit: `https://multiplayer-game-52kg.onrender.com`
- Should show server status page
- If not, backend is down

### **2. Test API Endpoints**
```bash
# Health check
curl https://multiplayer-game-52kg.onrender.com/health

# Login test
curl -X POST https://multiplayer-game-52kg.onrender.com/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test"}'
```

### **3. Test Socket Connection**
Visit: `https://game.web-designs.store/test-connection.html`
- Shows real-time connection status
- Tests both API and Socket.IO

### **4. Check Browser Console**
1. Open `https://game.web-designs.store`
2. Press F12 → Console
3. Look for error messages

## 🔍 Common Error Messages:

### **CORS Errors:**
```
Access to fetch at 'https://multiplayer-game-52kg.onrender.com' from origin 'https://game.web-designs.store' has been blocked by CORS policy
```
**Fix:** Check `ALLOWED_ORIGINS` environment variable in Render

### **Socket.IO Errors:**
```
WebSocket connection to 'wss://multiplayer-game-52kg.onrender.com/socket.io/' failed
```
**Fix:** Check if backend is running and accessible

### **Network Errors:**
```
Failed to fetch
```
**Fix:** Check if Render service is deployed and running

## 🛠️ Environment Variables Check:

### **In Render Dashboard:**
```
NODE_ENV = production
PORT = 3000
ALLOWED_ORIGINS = https://game.web-designs.store
```

### **Verify:**
1. Go to Render service dashboard
2. Click "Environment" tab
3. Check all variables are set
4. Redeploy if needed

## 🔧 Quick Fixes:

### **Fix 1: Update CORS Origins**
If you see CORS errors, add your domain to `ALLOWED_ORIGINS`:
```
ALLOWED_ORIGINS = https://game.web-designs.store,https://your-custom-domain.com
```

### **Fix 2: Check Render Service**
1. Go to Render dashboard
2. Check service status
3. Look at logs for errors
4. Redeploy if needed

### **Fix 3: Test with Simple Client**
Use the test page: `https://game.web-designs.store/test-connection.html`

## 📋 Debugging Checklist:

- [ ] Backend URL accessible: `https://multiplayer-game-52kg.onrender.com`
- [ ] Health endpoint works: `/health`
- [ ] Login endpoint works: `POST /login`
- [ ] Socket.IO connects without errors
- [ ] No CORS errors in browser console
- [ ] Environment variables set correctly
- [ ] Render service is running

## 🚀 Next Steps:

1. **Test the connection test page**
2. **Check browser console for specific errors**
3. **Verify environment variables**
4. **Test backend endpoints directly**
5. **Check Render service logs**

Let me know what specific errors you see! 🔍 