import { db } from '@/infra/persistence/drizzle/client'
import type { InferInsertModel } from 'drizzle-orm'
import type { PgTable } from 'drizzle-orm/pg-core'

export abstract class BaseDrizzleRepository<Table extends PgTable> {
  constructor (private table: Table) {}

  async save (entity: InferInsertModel<Table>): Promise<void> {
    await db.insert(this.table).values(entity)
  }
}
