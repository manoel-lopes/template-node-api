export type BaseRepository<Entity> = {
  save: (entity: Entity) => Promise<void>
}
