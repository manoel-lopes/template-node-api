import { uuidv7 } from 'uuidv7'

export abstract class Entity {
  readonly id: string = uuidv7()
}

