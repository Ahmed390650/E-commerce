"use server";
import imgeurl from "@/lib/imgeurl";
import stripe from "@/lib/stripe";
import { BasketItem } from "@/store/store";

export type Metadata = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  clerkUserId: string;
};
export type GroupedBasketItem = {
  product: BasketItem["product"];
  quantity: number;
};

export const createCheckoutSession = async (
  items: GroupedBasketItem[],
  metadata: Metadata
) => {
  try {
    const itemsWithoutPrice = items.filter((item) => !item.product.price);
    if (!itemsWithoutPrice) throw new Error("Some item dont have price");
    const customers = await stripe.customers.list({
      email: metadata.customerEmail,
      limit: 1,
    });
    let customerId: string | undefined;

    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }
    const baseURL =
      process.env.NODE_ENV === "production"
        ? `https://${process.env.VERCEL_URL}`
        : `${process.env.NEXT_PUBLIC_BASE_URL}`;
    const success_url = `${baseURL}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`;
    const cancel_url = `${baseURL}/basket`;
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_creation: customerId ? undefined : "always",
      customer_email: !customerId ? metadata.customerEmail : undefined,
      metadata,
      mode: "payment",
      allow_promotion_codes: true,
      success_url,
      cancel_url,
      line_items: items.map((item) => ({
        price_data: {
          currency: "gbp",
          unit_amount: Math.round(item.product.price! * 100),
          product_data: {
            name: item.product.name || "Unnamed product",
            description: `Product ID: ${item.product._id}`,
            metadata: {
              id: item.product._id,
            },
            images: item.product.image
              ? [imgeurl(item.product.image).url()]
              : undefined,
          },
        },
        quantity: item.quantity,
      })),
    });
    return session.url;
  } catch (error) {
    console.error("Error creating checkout session", error);
    return error;
  }
};
