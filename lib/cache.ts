/**
 * 简单的内存缓存实现
 */

interface CacheItem<T> {
  data: T;
  expiry: number;
}

class Cache {
  private cache: Map<string, CacheItem<any>> = new Map();
  
  /**
   * 获取缓存数据
   * @param key 缓存键
   * @returns 缓存数据或undefined
   */
  get<T>(key: string): T | undefined {
    const item = this.cache.get(key);
    
    // 如果没有缓存或缓存已过期，返回undefined
    if (!item || Date.now() > item.expiry) {
      if (item) {
        this.cache.delete(key); // 删除过期缓存
      }
      return undefined;
    }
    
    return item.data;
  }
  
  /**
   * 设置缓存数据
   * @param key 缓存键
   * @param data 缓存数据
   * @param ttl 缓存有效期（毫秒），默认5分钟
   */
  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { data, expiry });
  }
  
  /**
   * 删除缓存
   * @param key 缓存键
   */
  delete(key: string): void {
    this.cache.delete(key);
  }
  
  /**
   * 清空所有缓存
   */
  clear(): void {
    this.cache.clear();
  }
  
  /**
   * 获取缓存数量
   */
  size(): number {
    return this.cache.size;
  }
  
  /**
   * 清理过期缓存
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

// 创建单例实例
const cache = new Cache();

// 每小时清理一次过期缓存
if (typeof window !== 'undefined') {
  setInterval(() => {
    cache.cleanup();
  }, 60 * 60 * 1000);
}

export default cache;
