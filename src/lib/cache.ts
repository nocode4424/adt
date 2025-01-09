const CACHE_PREFIX = 'aurora_';
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
const CACHE_KEYS = {
  INCIDENT_LIST: 'incident_list',
  EXPENSE_LIST: 'expense_list',
  USER_PROFILE: 'user_profile',
  ANALYTICS: 'analytics'
};

interface CacheOptions {
  ttl?: number;
  forceRefresh?: boolean;
}

export const cache = {
  set: <T>(key: string, data: T, options: CacheOptions = {}): void => {
    const cacheKey = `${CACHE_PREFIX}${key}`;
    const item = {
      data,
      timestamp: Date.now(),
      ttl: options.ttl || DEFAULT_TTL
    };
    localStorage.setItem(cacheKey, JSON.stringify(item));
  },

  get: <T>(key: string, options: CacheOptions = {}): T | null => {
    if (options.forceRefresh) {
      cache.remove(key);
      return null;
    }

    const cacheKey = `${CACHE_PREFIX}${key}`;
    const item = localStorage.getItem(cacheKey);
    
    if (!item) return null;

    const { data, timestamp, ttl } = JSON.parse(item);
    const now = Date.now();

    if (now - timestamp > ttl) {
      localStorage.removeItem(cacheKey);
      return null;
    }

    return data;
  },

  remove: (key: string) => {
    const cacheKey = `${CACHE_PREFIX}${key}`;
    localStorage.removeItem(cacheKey);
  },

  clear: () => {
    Object.keys(localStorage)
      .filter(key => key.startsWith(CACHE_PREFIX))
      .forEach(key => localStorage.removeItem(key));
  },

  keys: CACHE_KEYS
};