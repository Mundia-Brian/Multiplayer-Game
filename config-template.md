# 🔧 Configuration Template

## Your URLs (Replace these with your actual URLs):

### Netlify URL:
```
https://game.web-designs.store
```

### Render URL:
```
https://multiplayer-game-52kg.onrender.com
```

## Files to Update:

### 1. Update client/index.html
Find this section and replace the URLs:

```javascript
const getServerUrl = () => {
  if (window.location.hostname.includes("netlify")) {
    return "https://multiplayer-game-52kg.onrender.com"; // Replace with your actual Render URL
  } else if (window.location.hostname.includes("localhost")) {
    return "http://localhost:3000";
  } else {
    return "https://multiplayer-game-52kg.onrender.com"; // Replace with your actual Render URL
  }
};
```

### 2. Update server/server.js
Find this section and replace the URLs:

```javascript
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['YOUR_NETLIFY_URL_HERE'] // Replace with your actual Netlify URL
    : ['http://localhost:3000', 'http://localhost:8080'],
  credentials: true
};
```

## Quick Update Commands:

After you get your URLs, run these commands:

```bash
# Replace YOUR_RENDER_URL with your actual Render URL
# Replace YOUR_NETLIFY_URL with your actual Netlify URL

# Update client
sed -i 's/https://multiplayer-game-52kg.onrender.com/YOUR_ACTUAL_RENDER_URL/g' client/index.html

# Update server
sed -i 's/YOUR_NETLIFY_URL_HERE/YOUR_ACTUAL_NETLIFY_URL/g' server/server.js
``` 