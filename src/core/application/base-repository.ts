export type BaseRepository<Entity> = {
  save: (entity: Entity) => Promise<void>
  getById(entityId: string): Promise<Entity | null>
}
