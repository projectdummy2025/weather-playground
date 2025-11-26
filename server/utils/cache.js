class SimpleCache {
  constructor() {
    this.cache = new Map();
    this.timers = new Map(); // To track timeouts for cache expiration
  }

  get(key) {
    return this.cache.has(key) ? this.cache.get(key) : null;
  }

  set(key, value, ttl = 3600) { // Default TTL: 1 hour in seconds
    // Clear existing timeout if it exists
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
    }
    
    // Set the value
    this.cache.set(key, value);
    
    // Set expiration timeout
    const timeoutId = setTimeout(() => {
      this.cache.delete(key);
      this.timers.delete(key);
    }, ttl * 1000); // Convert to milliseconds
    
    this.timers.set(key, timeoutId);
  }

  has(key) {
    return this.cache.has(key);
  }

  delete(key) {
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }
    return this.cache.delete(key);
  }

  clear() {
    for (const timeoutId of this.timers.values()) {
      clearTimeout(timeoutId);
    }
    this.cache.clear();
    this.timers.clear();
  }
}

module.exports = new SimpleCache();