export default class AuthenticationError extends Error {
  constructor() {
    super('Authentication failed');
  }
}
