import { db } from '@/infra/persistence/drizzle/client'
import type { InferInsertModel } from 'drizzle-orm'
import type { PgTable } from 'drizzle-orm/pg-core'

export class BaseDrizzleRepository<Table extends PgTable> {
  private table: Table

  constructor (table: Table) {
    this.table = table
  }

  async save (entity: InferInsertModel<Table>): Promise<void> {
    await db.insert(this.table).values(entity)
  }
}
