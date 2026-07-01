import Stripe from "stripe";

// Initialize Stripe with the secret key from environment variables
// Use a placeholder if not set yet so the app doesn't crash during build
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2026-06-24.dahlia", // Use the latest API version or whatever the library defaults to
  typescript: true,
});
