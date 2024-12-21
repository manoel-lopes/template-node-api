import crypto from 'node:crypto'

export abstract class Model {
  static generateId() {
    return crypto.randomUUID()
  }
}
