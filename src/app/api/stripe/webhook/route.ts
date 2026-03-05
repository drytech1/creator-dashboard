import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const payload = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        await prisma.user.updateMany({
          where: { stripeCustomerId: customerId },
          data: {
            subscriptionStatus: "active",
            stripeSubscriptionId: subscriptionId,
          },
        });
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as any;
        const customerId = invoice.customer as string;

        await prisma.user.updateMany({
          where: { stripeCustomerId: customerId },
          data: { subscriptionStatus: "active" },
        });
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as any;
        const customerId = invoice.customer as string;

        await prisma.user.updateMany({
          where: { stripeCustomerId: customerId },
          data: { subscriptionStatus: "past_due" },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as any;
        const customerId = subscription.customer as string;

        await prisma.user.updateMany({
          where: { stripeCustomerId: customerId },
          data: {
            subscriptionStatus: "canceled",
            stripeSubscriptionId: null,
          },
        });
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error handling webhook:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

// Disable body parsing for Stripe webhooks
export const runtime = "nodejs";
