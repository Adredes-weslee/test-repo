export class ApiError extends Error {
  public readonly cause: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.cause = cause;
  }
}