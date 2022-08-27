export default class TistoryError extends Error {
  constructor(readonly code: string, readonly message: string) {
    super(message);
  }

  toString() {
    return `[${this.code}] ${this.message}`;
  }
}
