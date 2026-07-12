const errorHandler = (err, req, res, next) => {
  // Handle Zod Validation Errors
  if (err.name === 'ZodError') {
    // Take the first error issue to provide a specific field error message
    const issue = err.errors[0];
    const field = issue.path.join('.');
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: issue.message,
        field: field
      }
    });
  }

  // Handle Prisma Known Request Errors
  if (err.name === 'PrismaClientKnownRequestError') {
    // P2002: Unique constraint failed
    if (err.code === 'P2002') {
      const field = err.meta?.target?.[0] || 'unknown';
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: `Resource with this ${field} already exists.`,
          field: field
        }
      });
    }
  }

  // Log unexpected errors
  console.error(`[ERROR] ${req.method} ${req.url}:`, err);

  // General server error
  res.status(err.status || 500).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'An unexpected error occurred.',
      field: null
    }
  });
};

module.exports = errorHandler;
