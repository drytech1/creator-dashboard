# Stripe Setup Guide

## 1. Create Stripe Account

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Sign up or log in
3. Switch to Test Mode (toggle in top right)

## 2. Create a Product and Price

1. Go to **Products** → **Add product**
2. Name: "Creator Dashboard Pro"
3. Description: "Unlimited access to Creator Dashboard"
4. Pricing model: **Standard pricing**
5. Price: $10.00
6. Billing period: **Monthly**
7. Click **Save product**

## 3. Get Your API Keys

1. Go to **Developers** → **API keys**
2. Copy **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
3. Copy **Secret key** → `STRIPE_SECRET_KEY`
4. Copy **Price ID** from your product → `STRIPE_PRICE_ID`
   - Format: `price_xxxxxxxxxxxxx`

## 4. Set Up Webhook

1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Endpoint URL: `https://yourdomain.com/api/stripe/webhook`
   - For local testing, use Stripe CLI (see below)
4. Select events:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.deleted`
5. Click **Add endpoint**
6. Copy **Signing secret** → `STRIPE_WEBHOOK_SECRET`

## 5. Local Webhook Testing

Install Stripe CLI:
```bash
# macOS
brew install stripe/stripe-cli/stripe

# Windows
scoop install stripe

# Linux
curl -s https://packages.stripe.dev/api/security/keypair/stripe-cli-gpg/public | gpg --dearmor | sudo tee /usr/share/keyrings/stripe.gpg
echo "deb [signed-by=/usr/share/keyrings/stripe.gpg] https://packages.stripe.dev/stripe-cli-debian-local stable main" | sudo tee -a /etc/apt/sources.list.d/stripe.list
sudo apt update
sudo apt install stripe
```

Login and forward webhooks:
```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`.

## 6. Update Environment Variables

```bash
cp .env.example .env.local
# Edit .env.local with your Stripe keys
```

## 7. Test Payment Flow

1. Start your app: `npm run dev`
2. Sign in with a test account
3. Click "Subscribe Now"
4. Use Stripe test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any 3-digit CVC
   - Any ZIP code
5. Complete checkout
6. You should be redirected back to dashboard with active subscription

## Test Cards

| Card Number | Scenario |
|-------------|----------|
| 4242 4242 4242 4242 | Successful payment |
| 4000 0000 0000 0002 | Card declined |
| 4000 0000 0000 0341 | Requires 3D Secure |

## Going Live

1. Toggle Stripe Dashboard to **Live mode**
2. Repeat steps 2-4 with live keys
3. Update `.env.local` with live keys
4. Deploy and test with real card (small amount)
