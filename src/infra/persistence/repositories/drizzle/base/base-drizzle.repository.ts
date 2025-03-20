import { db } from '@/infra/persistence/drizzle/client'
import { type InferInsertModel, type InferSelectModel, and, eq } from 'drizzle-orm'
import type { AnyPgColumn, PgTable } from 'drizzle-orm/pg-core'

type FindWeirdOptions<Table extends PgTable> = Partial<
  Record<keyof InferSelectModel<Table>, InferSelectModel<Table>[keyof InferSelectModel<Table>]>
>

export type FindOptions<Table extends PgTable> = {
  where: FindWeirdOptions<Table>
}

export abstract class BaseDrizzleRepository<Table extends PgTable> {
  constructor(private readonly table: Table) {}

  async save(entity: InferInsertModel<Table>): Promise<void> {
    await db.insert(this.table).values(entity)
  }

  async findOne({ where }: FindOptions<Table>): Promise<InferSelectModel<Table> | null> {
    const [entity] = (await db
      .select()
      .from(this.table as PgTable)
      .where(and(...this.buildWhereClause(where)))
      .limit(1)) as InferSelectModel<Table>[]

    return entity ?? null
  }

  async deleteOne({ where }: FindOptions<Table>): Promise<void> {
    await db.delete(this.table).where(and(...this.buildWhereClause(where)))
  }

  async updateOne(
    { where }: FindOptions<Table>,
    data: Partial<InferInsertModel<Table>>
  ): Promise<InferSelectModel<Table>> {
    const [updatedEntity] = (await db
      .update(this.table)
      .set({ ...data })
      .where(and(...this.buildWhereClause(where)))
      .returning()) as InferSelectModel<Table>[]

    return updatedEntity
  }

  private buildWhereClause(where: FindOptions<Table>['where']) {
    return Object.entries(where).map(([key, value]) =>
      eq(this.table[key as keyof Table] as AnyPgColumn, value)
    )
  }
}
