// Error handling middleware

class ErrorMiddleware {
  // TODO: Implementeer notFound middleware
  // - Voor 404 errors wanneer route niet bestaat
  static notFound(req, res, next) {
    // TODO: Create 404 error en pass to error handler
    
  }

  // TODO: Implementeer globalErrorHandler middleware
  // - Central error handling voor alle errors
  static globalErrorHandler(error, req, res, next) {
    // TODO: Log error details
    
    // TODO: Handle verschillende error types:
    // - Prisma errors (P2002 = unique constraint, P2025 = record not found)
    // - Validation errors
    // - General errors
    
    // TODO: Return appropriate error response
    // Development: include stack trace
    // Production: generic error messages
    
  }

  // TODO: Implementeer asyncHandler wrapper
  // - Wrapper voor async route handlers om try/catch te vermijden
  static asyncHandler(fn) {
    return (req, res, next) => {
      // TODO: Promise wrapper die errors doorgeeft aan next()
      
    };
  }
}

module.exports = ErrorMiddleware;