import Stripe from "stripe";
if (!process.env.STRIPE_SECERT_KEY) {
  throw new Error("STRIPE_SECERT_KEY is not set");
}
const stripe = new Stripe(process.env.STRIPE_SECERT_KEY, {
  apiVersion: "2024-10-28.acacia",
});

export default stripe;

// const baseURL =
//   process.env.NODE_ENV === "production"
//     ? `https://${process.env.VERCEL_URL}`
//     : `${process.env.NEXT_PUBLIC_BASE_URL}`;
// const successUrl = `${baseURL}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`;
// const cancel_url = `${baseURL}/basket`;
