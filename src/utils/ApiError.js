export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(msg = 'Bad Request') {
    return new ApiError(400, msg);
  }

  static notFound(msg = 'Not Found') {
    return new ApiError(404, msg);
  }

  static internal(msg = 'Internal Server Error') {
    return new ApiError(500, msg);
  }

  static unauthorized(msg = 'Unauthorized') {
    return new ApiError(401, msg);
  }
}
