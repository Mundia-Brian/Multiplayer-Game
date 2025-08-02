# 🔍 Debug API & Socket Connections

## 🚨 Common Issues:

### 1. **CORS Issues**
- Frontend can't connect to backend
- Browser blocks cross-origin requests

### 2. **Socket.IO Version Mismatch**
- Client and server using different Socket.IO versions
- Connection fails silently

### 3. **Environment Variables**
- ALLOWED_ORIGINS not set correctly
- Backend URL not matching

### 4. **Network Issues**
- Render service not accessible
- DNS resolution problems

## 🧪 Step-by-Step Debugging:

### **Step 1: Test Backend API**
```bash
# Test health endpoint
curl https://multiplayer-game-52kg.onrender.com/health

# Test root endpoint
curl https://multiplayer-game-52kg.onrender.com/

# Test login endpoint
curl -X POST https://multiplayer-game-52kg.onrender.com/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test"}'
```

### **Step 2: Check Browser Console**
1. Open `https://game.web-designs.store`
2. Press F12 → Console
3. Look for:
   - Connection errors
   - CORS errors
   - Socket.IO errors

### **Step 3: Test Socket Connection**
```javascript
// In browser console
const socket = io('https://multiplayer-game-52kg.onrender.com');
socket.on('connect', () => console.log('Connected!'));
socket.on('connect_error', (err) => console.error('Error:', err));
```

## 🔧 Quick Fixes:

### **Fix 1: Update Socket.IO CDN**
```html
<!-- Use exact same version as server -->
<script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>
```

### **Fix 2: Add Connection Options**
```javascript
const socket = io(getServerUrl(), {
  transports: ['websocket', 'polling'],
  timeout: 20000
});
```

### **Fix 3: Test with Simple Client**
```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>
</head>
<body>
  <div id="status">Connecting...</div>
  <script>
    const socket = io('https://multiplayer-game-52kg.onrender.com');
    socket.on('connect', () => {
      document.getElementById('status').textContent = 'Connected!';
    });
    socket.on('connect_error', (err) => {
      document.getElementById('status').textContent = 'Error: ' + err.message;
    });
  </script>
</body>
</html>
```

## 📋 Environment Variables Check:

### **Render Environment Variables:**
```
NODE_ENV = production
PORT = 3000
ALLOWED_ORIGINS = https://game.web-designs.store
```

### **Verify in Render Dashboard:**
1. Go to your service
2. Click "Environment"
3. Verify all variables are set
4. Redeploy if needed

## 🚀 Next Steps:

1. **Test backend endpoints** with curl
2. **Check browser console** for errors
3. **Verify environment variables**
4. **Test with simple client**
5. **Update client code** if needed

Let me know what errors you see in the browser console! 🔍 