/**
 * A lightweight, in-memory rate limiter using standard ES6 Maps.
 * This is safe to use in Next.js Edge Runtime (middleware) as well as Node.js.
 * 
 * Note: Since this is in-memory, the state is isolated to the specific server instance
 * and will reset upon cold starts (Serverless functions) or server restarts.
 * It is meant for basic spam protection and cost-control on a budget.
 */

type RateLimitStore = Map<string, { count: number; expiresAt: number }>;

const store: RateLimitStore = new Map();

/**
 * Clean up expired entries periodically to prevent memory leaks
 */
function cleanupStore() {
  const now = Date.now();
  for (const [key, value] of store.entries()) {
    if (value.expiresAt < now) {
      store.delete(key);
    }
  }
}

// Run cleanup every minute in the background if possible
if (typeof setInterval !== "undefined") {
  setInterval(cleanupStore, 60000);
}

export interface RateLimitOptions {
  limit: number;     // Maximum number of requests allowed
  windowMs: number;  // Time window in milliseconds
}

/**
 * Profiles for different types of resources to protect.
 */
export const RATE_LIMIT_PROFILES = {
  // General API endpoints (Database protection) - 60 requests per minute
  API: { limit: 60, windowMs: 60 * 1000 },
  
  // File Storage (AWS S3) - 10 uploads per minute to prevent bucket spam
  STORAGE: { limit: 10, windowMs: 60 * 1000 },
  
  // Emails (AWS SES) - 5 emails per minute to prevent quota exhaustion
  EMAIL: { limit: 5, windowMs: 60 * 1000 },
};

/**
 * Checks if a given identifier has exceeded its rate limit.
 * 
 * @param identifier A unique string identifying the requester (e.g. IP address or User ID)
 * @param profile The rate limit profile (e.g. RATE_LIMIT_PROFILES.API)
 * @returns { success: boolean, limit: number, remaining: number, reset: number }
 */
export function checkRateLimit(identifier: string, profile: RateLimitOptions) {
  const now = Date.now();
  const record = store.get(identifier);

  // If record doesn't exist or is expired, create a new one
  if (!record || record.expiresAt < now) {
    store.set(identifier, {
      count: 1,
      expiresAt: now + profile.windowMs,
    });
    return {
      success: true,
      limit: profile.limit,
      remaining: profile.limit - 1,
      reset: now + profile.windowMs,
    };
  }

  // If limit is exceeded
  if (record.count >= profile.limit) {
    return {
      success: false,
      limit: profile.limit,
      remaining: 0,
      reset: record.expiresAt,
    };
  }

  // Increment the counter
  record.count += 1;
  store.set(identifier, record);

  return {
    success: true,
    limit: profile.limit,
    remaining: profile.limit - record.count,
    reset: record.expiresAt,
  };
}
