#!/bin/bash

# Deploy Creator Dashboard to Vercel
# This script helps you deploy step by step

echo "🚀 Creator Dashboard Deployment Helper"
echo "======================================"
echo ""

# Check if vercel is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if logged in
echo "🔑 Checking Vercel login status..."
vercel whoami &> /dev/null
if [ $? -ne 0 ]; then
    echo ""
    echo "❌ You need to log in to Vercel first."
    echo ""
    echo "Option 1 - Login via browser (easiest):"
    echo "   vercel login"
    echo ""
    echo "Option 2 - Use a token:"
    echo "   1. Go to https://vercel.com/account/tokens"
    echo "   2. Create a new token"
    echo "   3. Run: vercel --token YOUR_TOKEN"
    echo ""
    echo "Option 3 - Deploy via GitHub:"
    echo "   1. Push code to GitHub"
    echo "   2. Go to https://vercel.com/new"
    echo "   3. Import your repo"
    exit 1
fi

echo "✅ Logged in as: $(vercel whoami)"
echo ""

# Deploy
echo "🚀 Deploying to Vercel..."
echo ""
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Add your environment variables in Vercel Dashboard"
echo "2. Update OAuth redirect URLs for production"
echo "3. Configure Stripe webhooks"
