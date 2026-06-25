interface RateLimitRecord {
  timestamps: number[];
}

const tracker = new Map<string, RateLimitRecord>();

// Clean up expired entries every 5 minutes to prevent memory leaks
if (!(globalThis as any).rateLimitCleanupInterval) {
  (globalThis as any).rateLimitCleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of tracker.entries()) {
      const validTimestamps = record.timestamps.filter(
        (time) => now - time < 15 * 60 * 1000 // 15 minutes window
      );
      if (validTimestamps.length === 0) {
        tracker.delete(ip);
      } else {
        record.timestamps = validTimestamps;
      }
    }
  }, 5 * 60 * 1000);
}

/**
 * Validates request counts for a given client IP within a window of time.
 * Defaults to 5 requests per 15 minutes.
 */
export function rateLimit(
  ip: string,
  limit = 5,
  durationMs = 15 * 60 * 1000
): { success: boolean; limit: number; remaining: number } {
  const now = Date.now();
  const record = tracker.get(ip) || { timestamps: [] };

  // Filter timestamps within the duration window
  record.timestamps = record.timestamps.filter((time) => now - time < durationMs);

  if (record.timestamps.length >= limit) {
    return { success: false, limit, remaining: 0 };
  }

  record.timestamps.push(now);
  tracker.set(ip, record);

  return {
    success: true,
    limit,
    remaining: limit - record.timestamps.length,
  };
}
