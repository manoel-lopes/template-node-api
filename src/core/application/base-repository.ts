export type BaseRepository<Entity> = {
  save: (entity: Entity) => Promise<Entity>
  getById(entityId: string): Promise<Entity | null>
}
