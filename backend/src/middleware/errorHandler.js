const errorHandler = (err, req, res, next) => {
  // Handle Zod Validation Errors
  if (err.name === 'ZodError') {
    // Take the first error issue to provide a specific field error message
    const issue = err.issues[0];
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
    if (err.code === 'P2002') {
      const field = err.meta?.target?.[0] || 'unknown';
      let message = `Resource with this ${field} already exists.`;
      
      if (field === 'registration_number') {
        const val = req.body.registration_number || 'X';
        message = `Vehicle with registration number '${val}' already exists.`;
      }
      
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: message,
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
