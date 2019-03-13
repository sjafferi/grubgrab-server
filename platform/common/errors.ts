/** Class representing an error. */
export class PlatformError extends Error {
  statusCode: number;

  /** Construct an error
   * @param {string} message The message of the error
   */
  constructor(message: string) {
    super();
    this.name = "PlatformError";
    this.message = message;
    this.statusCode = 500;
  }
}

class ValidationError extends PlatformError {
  constructor(request: string, error: string) {
    super(`Validation error in ${request}: ${error}`);
    this.name = "ValidationError";
    this.statusCode = 400;
  }
}

/** Class representing an error. */
class InvalidRequestBody extends PlatformError {
  /** Construct an error
   * @param {string} paramName The name of the missing param
   */
  constructor(request: string) {
    super(`Invalid request body in ${request}`);
    this.name = "InvalidRequestBody";
    this.statusCode = 400;
  }
}

/** Class representing an error. */
class MissingParameterError extends PlatformError {
  /** Construct an error
   * @param {string} paramName The name of the missing param
   */
  constructor(paramName: string) {
    super(`Missing parameter: ${paramName}`);
    this.name = "MissingParameterError";
  }
}

/** Class representing an error. */
class NotFoundError extends PlatformError {
  /** Construct an error
   * @param {string} message The message of the error
   */
  constructor(message: string = "") {
    super(message || "Not found");
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

/** Class representing an error. */
class UnauthorizedAccessError extends PlatformError {
  /** Construct an error
   * @param {string} message The message of the error
   */
  constructor(message: string = "") {
    super(message || "Unauthorized access");
    this.name = "UnauthorizedAccessError";
    this.statusCode = 403;
  }
}

export default {
  PlatformError,
  ValidationError,
  InvalidRequestBody,
  MissingParameterError,
  NotFoundError,
  UnauthorizedAccessError
};
