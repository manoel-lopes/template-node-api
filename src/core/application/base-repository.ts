export type BaseRepository<Props, Entity> = {
  save: (data: Props) => Promise<void>
  getById(entityId: string): Promise<Entity | null>
}
