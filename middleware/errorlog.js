export const errorLogger = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.url}`)
  console.error(`Message: ${err.message}`)
  console.error(err.stack)

  const statusCode = err.statusCode || 500

  res.status(statusCode).json({
    status: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : {}
  })
}

// if error in all middlewares set the error message and status code
// if (!product) {
//       const error = new Error("Product not found");
//       error.statusCode = 404; // You set this manually
//       throw error;
//     }
