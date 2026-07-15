import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_API_KEY || "sk_test_dummy", {
  apiVersion: "2026-04-22.dahlia" as any, // @ts-ignore
  typescript: true,
});
