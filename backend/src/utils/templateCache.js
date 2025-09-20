const NodeCache = require('node-cache');

// Cache configuration
const cache = new NodeCache({
  stdTTL: 3600, // Cache for 1 hour
  checkperiod: 120, // Check for expired keys every 2 minutes
  useClones: false // Store references instead of copying
});

class TemplateCache {
  constructor() {
    this.cache = cache;
    this.usageStats = {
      hits: 0,
      misses: 0,
      lastReset: Date.now()
    };
  }

  get(key) {
    const value = this.cache.get(key);
    if (value !== undefined) {
      this.usageStats.hits++;
      return value;
    }
    this.usageStats.misses++;
    return null;
  }

  set(key, value, ttl = 3600) {
    return this.cache.set(key, value, ttl);
  }

  del(key) {
    return this.cache.del(key);
  }

  flush() {
    return this.cache.flushAll();
  }

  getStats() {
    const stats = this.cache.getStats();
    return {
      ...stats,
      ...this.usageStats,
      hitRate: this.usageStats.hits / (this.usageStats.hits + this.usageStats.misses) || 0
    };
  }

  resetStats() {
    this.usageStats = {
      hits: 0,
      misses: 0,
      lastReset: Date.now()
    };
  }
}

module.exports = new TemplateCache();