
/**
 * Custom error class for errors that happen when fetching data
 */
class ApiError extends Error {
  error: string;
  code: number | null;

  /**
   * Custom error class for errors that happen when fetching data
   */
  constructor (code: number | null, error: string) {
    super(error);
    this.error = error;
    this.code = code;
  }

  toString() {
    return `ApiError: [${this.code}] ${this.error}`;
  }
}

export default ApiError;
