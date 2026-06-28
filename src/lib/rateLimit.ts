const tracker = new Map<string, { count: number; resetTime: number }>();

/**
 * Basic in-memory rate limiter helper for serverless/development environments.
 * Prevents brute-force requests by counting requests per IP.
 */
export function rateLimit(ip: string, limit = 5, windowMs = 60 * 1000) {
  const now = Date.now();
  const record = tracker.get(ip);

  // If no record exists or the rate limit window has expired, reset
  if (!record || now > record.resetTime) {
    tracker.set(ip, { count: 1, resetTime: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  // If request count exceeds the limit
  if (record.count >= limit) {
    return { success: false, remaining: 0 };
  }

  // Increment request count
  record.count += 1;
  return { success: true, remaining: limit - record.count };
}

/**
 * Extracts the client IP address from request headers.
 */
export function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") || "127.0.0.1";
}
