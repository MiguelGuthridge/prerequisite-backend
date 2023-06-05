
/**
 * Custom error class for errors that happen when fetching data
 */
class ApiError extends Error {
  error: string;
  code: number | null;

  /**
   * Custom error class for errors that happen when fetching data
   */
  constructor (code: number | null, error: string | object) {
    if (typeof error === 'object') {
      error = JSON.stringify(error);
    }
    super(`ApiError: [${code}] ${error}`);
    this.error = error;
    this.code = code;
  }
}

export default ApiError;
