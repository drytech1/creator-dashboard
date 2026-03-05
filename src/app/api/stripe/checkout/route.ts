import { stripe, getOrCreateCustomer, createCheckoutSession } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    // Get or create user in database
    let user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
        },
      });
    }

    // Get or create Stripe customer
    const customer = await getOrCreateCustomer(
      session.user.email,
      session.user.name
    );

    // Update user with Stripe customer ID
    if (!user.stripeCustomerId) {
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customer.id },
      });
    }

    // Create checkout session
    const checkoutSession = await createCheckoutSession(customer.id);

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
