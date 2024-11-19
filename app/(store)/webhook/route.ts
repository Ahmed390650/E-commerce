import { Metadata } from "@/actions/createCheckOutSession";
import stripe from "@/lib/stripe";
import { backendClient } from "@/sanity/lib/backendClient";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headerList = await headers();
  const sig = headerList.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "No Singature" }, { status: 400 });
  }
  const webhooksSecert = process.env.STRIPE_WEBHOOK_SECERT;
  if (!webhooksSecert) {
    console.log("stripe webhooksecert not found");
    return NextResponse.json(
      { error: "Stripe webhook secert is not set" },
      { status: 400 }
    );
  }
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhooksSecert);
  } catch (error) {
    console.error("webhook signature verification failed", error);
    return NextResponse.json(
      { error: "Webhook Error " + error },
      { status: 400 }
    );
  }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    try {
      await createOrderSanity(session);
    } catch (error) {
      console.error("Error creating order in sanity", error);
      return NextResponse.json(
        { error: "Error creating order" },
        { status: 400 }
      );
    }
  }
  return NextResponse.json({ received: true });
}

const createOrderSanity = async (session: Stripe.Checkout.Session) => {
  const {
    id,
    amount_total,
    currency,
    metadata,
    payment_intent,
    customer,
    total_details,
  } = session;
  const { clerkUserId, customerEmail, customerName, orderNumber } =
    metadata as Metadata;

  const lineItemsWithProduct = await stripe.checkout.sessions.listLineItems(
    id,
    {
      expand: ["data.price.product"],
    }
  );
  const sanityProducts = lineItemsWithProduct.data.map((item) => ({
    _key: crypto.randomUUID(),
    product: {
      _type: "reference",
      _ref: (item?.price?.product as Stripe.Product)?.metadata?.id,
    },
    quantity: item.quantity || 0,
  }));
  const order = await backendClient.create({
    _type: "order",
    orderNumber,
    stripeCheckedoutSessionId: id,
    stripePaymentIntentId: payment_intent,
    stripeCustomerId: customer,
    customerName,
    clerkUserId,
    email: customerEmail,
    currency,
    amountDiscount: total_details?.amount_discount
      ? total_details.amount_discount / 100
      : 0,
    products: sanityProducts,
    totalPrice: amount_total ? amount_total / 100 : 0,
    status: "paid",
    orderDate: new Date().toISOString(),
  });
  return order;
};
