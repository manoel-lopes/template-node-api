import crypto from 'node:crypto'

export class UniqueID {
  readonly value: string

  constructor() {
    this.value = crypto.randomUUID()
  }
}
