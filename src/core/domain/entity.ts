import { uuidv7 } from 'uuidv7'

export abstract class Entity {
  readonly id = uuidv7()
  readonly createdAt: Date
  readonly updatedAt?: Date
}
