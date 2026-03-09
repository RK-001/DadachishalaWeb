/**
 * Advanced Caching Service
 * Provides a scoped, multi-layer (memory + localStorage) cache.
 * NOTE: For data fetched via React Query hooks, this service is NOT used for reads.
 * It remains useful for non-React-Query code paths and for manual cache clearing.
 */

const CACHE_NAMESPACE = 'dcs:';

class CacheService {
  constructor() {
    // Memory cache for fast access
    this.memoryCache = new Map();
    
    // Cache configurations for different data types
    this.cacheConfig = {
      // Content that changes via admin — short TTL so updates propagate quickly
      branches: { ttl: 5 * 60000, storage: 'local' },         // 5 minutes
      events: { ttl: 60000, storage: 'local' },                // 1 minute
      gallery: { ttl: 2 * 60000, storage: 'local' },           // 2 minutes
      blogs: { ttl: 2 * 60000, storage: 'local' },             // 2 minutes
      successStories: { ttl: 2 * 60000, storage: 'local' },    // 2 minutes
      testimonials: { ttl: 2 * 60000, storage: 'local' },      // 2 minutes
      awards: { ttl: 5 * 60000, storage: 'local' },            // 5 minutes
      news: { ttl: 2 * 60000, storage: 'local' },              // 2 minutes
      videos: { ttl: 2 * 60000, storage: 'local' },            // 2 minutes
      team: { ttl: 5 * 60000, storage: 'local' },              // 5 minutes
      
      // Dynamic data - short TTL
      volunteers: { ttl: 60000, storage: 'memory' }, // 1 minute
      donations: { ttl: 60000, storage: 'memory' },  // 1 minute
      stats: { ttl: 60000, storage: 'memory' },      // 1 minute
    };
  }

  /**
   * Generate namespaced cache key
   */
  getCacheKey(collectionName, params = {}) {
    const paramString = Object.keys(params).length > 0
      ? JSON.stringify(params)
      : '';
    return `${CACHE_NAMESPACE}${collectionName}:${paramString}`;
  }

  /**
   * Get from cache
   */
  get(collectionName, params = {}) {
    const key = this.getCacheKey(collectionName, params);
    const config = this.cacheConfig[collectionName] || { ttl: 300000, storage: 'memory' };

    // Try memory cache first
    if (this.memoryCache.has(key)) {
      const cached = this.memoryCache.get(key);
      if (Date.now() - cached.timestamp < config.ttl) {
        console.log(`[Cache HIT - Memory] ${key}`);
        return cached.data;
      }
      this.memoryCache.delete(key);
    }

    // Try localStorage for persistent cache
    if (config.storage === 'local') {
      try {
        const stored = localStorage.getItem(key);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Date.now() - parsed.timestamp < config.ttl) {
            console.log(`[Cache HIT - LocalStorage] ${key}`);
            // Restore to memory cache
            this.memoryCache.set(key, parsed);
            return parsed.data;
          }
          localStorage.removeItem(key);
        }
      } catch (error) {
        console.warn('LocalStorage read error:', error);
      }
    }

    console.log(`[Cache MISS] ${key}`);
    return null;
  }

  /**
   * Set cache
   */
  set(collectionName, data, params = {}) {
    const key = this.getCacheKey(collectionName, params);
    const config = this.cacheConfig[collectionName] || { ttl: 300000, storage: 'memory' };
    
    const cacheEntry = {
      data,
      timestamp: Date.now()
    };

    // Always set in memory cache
    this.memoryCache.set(key, cacheEntry);

    // Also set in localStorage if configured
    if (config.storage === 'local') {
      try {
        localStorage.setItem(key, JSON.stringify(cacheEntry));
      } catch (error) {
        console.warn('LocalStorage write error:', error);
        // If localStorage is full, clear old entries
        if (error.name === 'QuotaExceededError') {
          this.clearOldLocalStorage();
          try {
            localStorage.setItem(key, JSON.stringify(cacheEntry));
          } catch (retryError) {
            console.error('Failed to write to localStorage after cleanup:', retryError);
          }
        }
      }
    }

    console.log(`[Cache SET] ${key}`);
  }

  /**
   * Invalidate specific cache
   */
  invalidate(collectionName, params = {}) {
    const key = this.getCacheKey(collectionName, params);
    this.memoryCache.delete(key);
    
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('LocalStorage remove error:', error);
    }
    
    console.log(`[Cache INVALIDATE] ${key}`);
  }

  /**
   * Invalidate all caches for a collection
   */
  invalidateCollection(collectionName) {
    const prefix = `${CACHE_NAMESPACE}${collectionName}:`;

    // Clear from memory cache
    for (const key of this.memoryCache.keys()) {
      if (key.startsWith(prefix)) {
        this.memoryCache.delete(key);
      }
    }

    // Clear from localStorage
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.warn('LocalStorage clear error:', error);
    }

    console.log(`[Cache INVALIDATE Collection] ${collectionName}`);
  }

  /**
   * Clear all caches owned by this app
   */
  clearAll() {
    this.memoryCache.clear();
    
    try {
      // Only clear keys in our namespace — never touch third-party localStorage entries
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(CACHE_NAMESPACE)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.warn('LocalStorage clear error:', error);
    }

    console.log('[Cache CLEAR ALL]');
  }

  /**
   * Clear old localStorage entries to free up space
   */
  clearOldLocalStorage() {
    try {
      const entries = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(CACHE_NAMESPACE)) {
          const value = localStorage.getItem(key);
          try {
            const parsed = JSON.parse(value);
            entries.push({ key, timestamp: parsed.timestamp || 0 });
          } catch {
            entries.push({ key, timestamp: 0 });
          }
        }
      }

      // Sort by timestamp and remove oldest 25%
      entries.sort((a, b) => a.timestamp - b.timestamp);
      const toRemove = entries.slice(0, Math.ceil(entries.length * 0.25));
      toRemove.forEach(entry => localStorage.removeItem(entry.key));

      console.log(`[Cache] Cleared ${toRemove.length} old entries from localStorage`);
    } catch (error) {
      console.error('Error clearing old localStorage:', error);
    }
  }

  /**
   * Prefetch and cache data.
   * @param {string} collectionName
   * @param {Function} fetchFunction - async function that returns the data
   * @param {Object} [params={}] - params forwarded to getCacheKey only (not to fetchFunction)
   */
  async prefetch(collectionName, fetchFunction, params = {}) {
    const cached = this.get(collectionName, params);
    if (cached) return cached;

    const data = await fetchFunction();
    this.set(collectionName, data, params);
    return data;
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const memorySize = this.memoryCache.size;
    let localStorageSize = 0;
    
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(CACHE_NAMESPACE)) {
          localStorageSize++;
        }
      }
    } catch (error) {
      console.warn('Error getting localStorage stats:', error);
    }

    return {
      memoryCacheSize: memorySize,
      localStorageCacheSize: localStorageSize,
      totalCacheSize: memorySize + localStorageSize
    };
  }
}

// Singleton instance
const cacheService = new CacheService();

export default cacheService;
