import process from "node:process";

// Server-only config helpers for Next.js route handlers, server components,
// and server actions. Keep secrets in non-public environment variables.
// Browser-readable values must use NEXT_PUBLIC_ and must not contain secrets.
export function getServerConfig() {
  return {
    nodeEnv: process.env.NODE_ENV,
    // Add server-only values here, e.g.:
    //   databaseUrl: process.env.DATABASE_URL,
    //   stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  };
}
