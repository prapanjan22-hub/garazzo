const NodeCache = require('node-cache');

class RateLimiter {
  constructor(options = {}) {
    this.windowMs = options.windowMs || 60000; // 1 minute default
    this.maxRequests = options.maxRequests || 100; // 100 requests per window default
    this.cache = new NodeCache({
      stdTTL: this.windowMs / 1000, // Convert to seconds
      checkperiod: Math.min(this.windowMs / (1000 * 10), 1) // Check expiry 10 times during window
    });
  }

  async checkLimit(key, count = 1) {
    const now = Date.now();
    let record = this.cache.get(key) || { count: 0, resetAt: now + this.windowMs };

    // If the window has expired, reset the counter
    if (now >= record.resetAt) {
      record = { count: 0, resetAt: now + this.windowMs };
    }

    // Check if adding this request would exceed the limit
    if (record.count + count > this.maxRequests) {
      const msUntilReset = record.resetAt - now;
      throw new Error(
        `Rate limit exceeded. Try again in ${Math.ceil(msUntilReset / 1000)} seconds. ` +
        `Limit: ${this.maxRequests} requests per ${this.windowMs / 1000} seconds.`
      );
    }

    // Increment the counter and update the cache
    record.count += count;
    this.cache.set(key, record);

    return {
      remaining: this.maxRequests - record.count,
      resetAt: record.resetAt,
      limit: this.maxRequests
    };
  }

  async reset(key) {
    this.cache.del(key);
  }
}

// Create rate limiters for different notification types
const rateLimiters = {
  email: new RateLimiter({
    windowMs: 60000, // 1 minute
    maxRequests: 100 // 100 emails per minute
  }),
  sms: new RateLimiter({
    windowMs: 60000, // 1 minute
    maxRequests: 50 // 50 SMS per minute
  }),
  push: new RateLimiter({
    windowMs: 60000, // 1 minute
    maxRequests: 200 // 200 push notifications per minute
  }),
  bulkPush: new RateLimiter({
    windowMs: 60000, // 1 minute
    maxRequests: 500 // 500 bulk notifications per minute
  })
};

module.exports = rateLimiters;