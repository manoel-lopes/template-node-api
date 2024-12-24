import { UniqueID } from '@/core/domain/unique-id'

export abstract class Entity {
  readonly id: string

  protected constructor() {
    const uniqueID = new UniqueID()
    this.id = uniqueID.value
  }
}
