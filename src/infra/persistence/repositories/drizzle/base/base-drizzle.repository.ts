import type { PgTable, AnyPgColumn } from 'drizzle-orm/pg-core'
import { and, eq, type InferInsertModel, type InferSelectModel } from 'drizzle-orm'
import { db } from '@/infra/persistence/drizzle/client'

export type FindOptions<Table extends PgTable> = {
  where: Partial<Record<
  keyof InferSelectModel<Table>, InferSelectModel<Table>[keyof InferSelectModel<Table>]>>
}

export abstract class BaseDrizzleRepository<Table extends PgTable> {
  constructor (private readonly table: Table) {}

  async save (entity: InferInsertModel<Table>): Promise<void> {
    await db.insert(this.table).values(entity)
  }

  async findOne ({ where }: FindOptions<Table>): Promise<InferSelectModel<Table> | null> {
    const whereClause = this.buildWhereClause(where)
    const [entity] = await db.select()
      .from(this.table as PgTable)
      .where(and(...whereClause))
      .limit(1) as InferSelectModel<Table>[]

    return entity ?? null
  }

  async deleteOne ({ where }: FindOptions<Table>): Promise<void> {
    const whereClause = this.buildWhereClause(where)
    await db.delete(this.table).where(and(...whereClause))
  }

  async updateOne (
    { where }: FindOptions<Table>,
    data: Partial<InferInsertModel<Table>>
  ): Promise<InferSelectModel<Table>> {
    const whereClause = this.buildWhereClause(where)
    const [updatedEntity] = await db.update(this.table)
      .set({ ...data })
      .where(and(...whereClause))
      .returning() as InferSelectModel<Table>[]

    return updatedEntity
  }

  private buildWhereClause (where: FindOptions<Table>['where']) {
    return Object.entries(where).map(([key, value]) =>
      eq(this.table[key as keyof Table] as AnyPgColumn, value))
  }
}
