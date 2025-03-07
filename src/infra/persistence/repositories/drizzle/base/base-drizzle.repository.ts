import { type InferInsertModel, type InferSelectModel, sql } from 'drizzle-orm'
import type { PgTable } from 'drizzle-orm/pg-core'
import { db } from '@/infra/persistence/drizzle/client'

export abstract class BaseDrizzleRepository<Table extends PgTable> {
  constructor (private readonly table: Table) {}

  async save (entity: InferInsertModel<Table>): Promise<void> {
    await db.insert(this.table).values(entity)
  }

  async findAll (): Promise<InferSelectModel<Table>[]> {
    return db.select().from(sql`${this.table}`).execute() as Promise<InferSelectModel<Table>[]>
  }
}
