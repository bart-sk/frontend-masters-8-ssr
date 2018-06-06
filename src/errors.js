export class NotFoundError extends Error {
  constructor() {
    super('NOT_FOUND');
    this.identifier = 'NOT_FOUND';
  }
}
