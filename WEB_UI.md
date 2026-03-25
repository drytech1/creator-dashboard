# CreatorDash Web UI

## 🌐 Starting the Web Server

The CreatorDash web UI includes a home page, privacy policy, and terms of service.

### Quick Start

```bash
# Start the web server
npm start
# or
npm run dev

# Server runs at: http://localhost:3000
```

### Available Pages

- **Home**: http://localhost:3000/
- **Privacy Policy**: http://localhost:3000/privacy.html
- **Terms of Service**: http://localhost:3000/terms.html

### Server Features

✅ Static file serving from `public/` folder
✅ Proper MIME types for HTML, CSS, JS, images
✅ Automatic index.html for root path
✅ 404 handling for missing files
✅ Request logging for debugging

### File Structure

```
public/
├── index.html        # Home page with features
├── privacy.html      # Privacy policy
└── terms.html        # Terms of service
```

### Making Changes

1. Edit any file in the `public/` folder
2. Refresh your browser (no server restart needed for static files)

### Server Details

- **Port**: 3000 (change in `server.mjs` if needed)
- **Implementation**: Pure Node.js HTTP server (no dependencies)
- **Location**: `server.mjs` in project root

### Stopping the Server

Press `Ctrl+C` in the terminal where the server is running.

### Production Deployment

For production, consider using:
- Nginx or Apache as a reverse proxy
- PM2 for process management
- HTTPS with Let's Encrypt

Example PM2 command:
```bash
pm2 start server.mjs --name creatordash
```

---

✅ **Status**: Privacy and Terms links are fully functional!
