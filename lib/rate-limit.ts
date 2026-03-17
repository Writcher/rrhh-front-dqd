type RateLimitStore = Map<string, { count: number; resetTime: number }>;

const store: RateLimitStore = new Map();

setInterval(() => {
  const now = Date.now();
  for (const [key, value] of store.entries()) {
    if (now > value.resetTime) {
      store.delete(key);
    }
  }
}, 60 * 60 * 1000);

export function rateLimit(
  identifier: string,
  limit: number = 5,
  windowMs: number = 60000
): boolean {
  const now = Date.now();
  const record = store.get(identifier);

  if (!record || now > record.resetTime) {
    store.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return true;
  };

  if (record.count >= limit) {
    return false;
  };

  record.count++;
  return true;
};

export function getRemainingTime(identifier: string): number {
  const record = store.get(identifier);
  if (!record) return 0;
  
  const remaining = record.resetTime - Date.now();
  return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
};