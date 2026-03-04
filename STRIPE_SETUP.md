# Payment Processing Setup Guide

This guide explains how to set up Stripe payment processing for the Mortgage Advisory App.

## Prerequisites

1. **Stripe Account**: Sign up at https://stripe.com
2. **Supabase Project**: Already configured in this project
3. **Environment Variables**: Must be set up correctly

## Step 1: Get Your Stripe API Keys

1. Go to https://dashboard.stripe.com/apikeys
2. Find your **Publishable Key** (starts with `pk_`)
3. Find your **Secret Key** (starts with `sk_`)
4. Keep the Secret Key private - never commit it to Git

## Step 2: Configure Environment Variables

### For Development (.env.local)

Add your Stripe keys to `.env.local` file in the project root:

```
STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_SECRET_KEY
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_PUBLISHABLE_KEY
VITE_APP_URL=http://localhost:5173
```

### For Production (.env)

Update `.env` with:

```
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_ACTUAL_PUBLISHABLE_KEY
VITE_APP_URL=https://yourdomain.com
```

## Step 3: Deploy Supabase Functions

The backend payment processing is handled by Supabase Edge Functions located in:
- `supabase/functions/create-checkout-session/index.ts`

To deploy these functions:

```bash
# Install Supabase CLI if you haven't already
npm install -g supabase

# Login to your Supabase project
supabase login

# Link your project
supabase link --project-ref your_project_ref

# Deploy the functions with environment variables
supabase functions deploy create-checkout-session --env STRIPE_SECRET_KEY=sk_test_YOUR_KEY
```

## Step 4: Test the Payment Flow

1. Start the development server: `npm run dev`
2. Click the "Pay Now" button in your app
3. You'll be redirected to Stripe Checkout
4. Use test card: `4242 4242 4242 4242` (exp: any future date, CVC: any 3 digits)
5. After successful payment, you'll be redirected to `/success`
6. After cancellation, you'll be redirected to `/cancel`

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `STRIPE_SECRET_KEY` | Stripe API Secret Key (sensitive) | `sk_test_...` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe API Publishable Key (public) | `pk_test_...` |
| `VITE_APP_URL` | Your app's URL | `http://localhost:5173` |
| `VITE_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase public key | `eyJ...` |

## Files Modified for Payment Processing

- **Frontend**: `src/components/CheckoutButton.tsx` - Button that initiates checkout
- **Backend**: `supabase/functions/create-checkout-session/index.ts` - Creates Stripe sessions
- **Config**: `.env` and `.env.local` - Environment variables

## Troubleshooting

### "No checkout session created" error
- Check that `STRIPE_SECRET_KEY` is set in Supabase functions
- Verify your Stripe keys are correct
- Check browser console for API response details

### Redirect not working
- Ensure `VITE_APP_URL` matches your application URL
- Check that success and cancel pages exist

### CORS errors
- The Supabase function includes CORS headers
- Verify the function is deployed correctly

## Security Notes

⚠️ **Important**: 
- Never commit `.env.local` or actual secret keys to Git
- Keep `STRIPE_SECRET_KEY` private - only store it in Supabase environment
- Use test keys during development, live keys in production
- Always validate amounts on the backend before creating sessions

## Next Steps

1. Replace placeholder keys in `.env.local` with your actual Stripe test keys
2. Deploy the Supabase functions
3. Test the payment flow with test cards
4. Switch to live keys when ready for production
