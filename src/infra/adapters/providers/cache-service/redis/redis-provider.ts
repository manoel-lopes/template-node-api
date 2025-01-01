import Redis from 'ioredis'
import type { CacheServiceProvider } from '../ports/cache-service-provider'

export class RedisProvider implements CacheServiceProvider {
  private readonly client = new Redis()
  async get(key: string): Promise<string | null> {
    return this.client.get(key)
  }

  async set(key: string, value: string): Promise<void> {
    this.client.set(key, value)
  }
}
