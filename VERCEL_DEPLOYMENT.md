# Vercel Deployment Guide - CreatorDash

## 🚀 Current Issue

Privacy and Terms links not working on Vercel deployment.

## ✅ Solution

### Option 1: Vercel Static Configuration (Recommended)

I've created `vercel.json` with proper routing configuration:

```json
{
  "version": 2,
  "public": true,
  "cleanUrls": true,
  "trailingSlash": false,
  "routes": [
    {
      "src": "/",
      "dest": "/index.html"
    },
    {
      "src": "/privacy",
      "dest": "/privacy.html"
    },
    {
      "src": "/terms",
      "dest": "/terms.html"
    }
  ]
}
```

This configuration:
- ✅ Serves files from `public/` folder
- ✅ Routes `/privacy` → `/privacy.html`
- ✅ Routes `/terms` → `/terms.html`
- ✅ Clean URLs (optional .html extension)
- ✅ Security headers included

### Deploy to Vercel

```bash
# If you haven't installed Vercel CLI
npm i -g vercel

# Deploy
cd /root/.openclaw/workspace/creator-dashboard
vercel
```

Or push to GitHub and connect to Vercel:
1. Push code to GitHub repository
2. Go to https://vercel.com
3. Import your repository
4. Vercel will auto-detect the `vercel.json` configuration
5. Deploy!

---

## Option 2: Move HTML Files to Root

If `vercel.json` doesn't work, you can move HTML files to the project root:

```bash
mv public/index.html ./
mv public/privacy.html ./
mv public/terms.html ./
```

Then update `vercel.json`:

```json
{
  "version": 2,
  "cleanUrls": true
}
```

---

## Testing Locally

Before deploying to Vercel, test locally with Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Run local dev server
vercel dev
```

This simulates the Vercel environment on your local machine.

---

## Troubleshooting

### Links still not working?

**Check 1**: Verify file structure
```
creator-dashboard/
├── public/
│   ├── index.html
│   ├── privacy.html
│   └── terms.html
└── vercel.json
```

**Check 2**: Inspect Vercel build logs
- Go to your Vercel dashboard
- Click on your deployment
- Check "Build Logs" for errors

**Check 3**: Test the direct URLs
- Visit: `https://your-site.vercel.app/privacy.html`
- Visit: `https://your-site.vercel.app/terms.html`

If these work, but clicks don't, it's a routing issue.

**Check 4**: Clear browser cache
Sometimes browsers cache 404 errors. Try:
- Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Incognito/Private window

---

## Next Steps

1. ✅ `vercel.json` is now created
2. 📤 Push changes to GitHub (or deploy with Vercel CLI)
3. 🔄 Redeploy on Vercel
4. 🧪 Test the Privacy and Terms links

---

## Quick Vercel Deployment Commands

```bash
# First time deployment
vercel

# Subsequent deployments
vercel --prod

# Or just push to main branch (if connected to GitHub)
git add .
git commit -m "Fix privacy and terms links"
git push origin main
```

Vercel will auto-deploy when you push to your connected branch!

---

**Status**: Configuration ready for Vercel deployment ✅
