import Stripe from "stripe";

const stripeKey = process.env.STRIPE_SECRET_KEY;

export const stripe = stripeKey 
  ? new Stripe(stripeKey, { apiVersion: "2026-02-25.clover" })
  : null as any;

export const getOrCreateCustomer = async (email: string, name?: string | null) => {
  if (!stripe) throw new Error("Stripe not configured");
  
  const existing = await stripe.customers.list({
    email,
    limit: 1,
  });

  if (existing.data.length > 0) {
    return existing.data[0];
  }

  return stripe.customers.create({
    email,
    name: name || undefined,
  });
};

export const createCheckoutSession = async (customerId: string) => {
  if (!stripe) throw new Error("Stripe not configured");
  
  return stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID!,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/dashboard?canceled=true`,
    subscription_data: {
      trial_period_days: 7,
    },
  });
};

export const createPortalSession = async (customerId: string) => {
  if (!stripe) throw new Error("Stripe not configured");
  
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXTAUTH_URL}/dashboard`,
  });
};
