# OAuth Setup Guide

## YouTube (Google) OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable the **YouTube Data API v3**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure consent screen:
   - User Type: External
   - App name: Creator Dashboard
   - User support email: your email
   - Scopes: `.../auth/youtube.readonly`
6. Create OAuth client ID:
   - Application type: Web application
   - Name: Creator Dashboard Web
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
   - (Add production URL when deployed)
7. Copy Client ID and Client Secret to `.env.local`

## Instagram (Facebook) OAuth

**Important:** Instagram requires a **Business or Creator** account connected to a Facebook Page.

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create a new app → Select "Other" → "Consumer"
3. Add **Instagram Graph API** product
4. Configure OAuth:
   - Valid OAuth Redirect URIs: `http://localhost:3000/api/auth/callback/facebook`
   - Deauthorize Callback URL: `http://localhost:3000`
   - Data Deletion Request URL: `http://localhost:3000`
5. Copy App ID and App Secret to `.env.local` as `FACEBOOK_APP_ID` and `FACEBOOK_APP_SECRET`

**Prerequisites for Instagram:**
- Instagram Business Account or Creator Account (not personal)
- Connected to a Facebook Page you admin
- Page must have the Instagram account linked in Page Settings

## Environment Setup

```bash
cp .env.example .env.local
# Edit .env.local with your credentials
```

## Generate NextAuth Secret

```bash
openssl rand -base64 32
# Copy output to NEXTAUTH_SECRET in .env.local
```

## Running Locally

```bash
npm run dev
# Open http://localhost:3000
```

## Testing OAuth

1. Visit `http://localhost:3000/auth/signin`
2. Click "Continue with YouTube"
3. Authorize the app
4. You should be redirected to `/dashboard`

## API Endpoints

- `GET /api/youtube` - Fetch YouTube channel stats (requires auth)
- `GET /api/auth/session` - Get current session
- `POST /api/auth/signout` - Sign out
