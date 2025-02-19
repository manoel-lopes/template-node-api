import Redis from 'ioredis'
import type { CacheService } from '../ports/cache-service'

export class RedisProvider implements CacheService {
  private readonly client = new Redis()
  async set (key: string, value: string): Promise<void> {
    this.client.set(key, value)
  }

  async get (key: string): Promise<string | null> {
    return this.client.get(key)
  }

  async delete (key: string): Promise<void> {
    this.client.del(key)
  }
}
