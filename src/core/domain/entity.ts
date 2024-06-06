import cuid from 'cuid'

export abstract class Entity {
  static generateRandomID() {
    return cuid()
  }
}
