export class AppError extends Error {
  constructor(message: string, public metadata?: Record<string, unknown>) {
    super(message);
    this.name = 'AppError';
  }
}
