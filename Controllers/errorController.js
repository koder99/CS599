const printErrorDev = function (error, req, res) {
  if (req.url.startsWith("/api")) {
    return res.status(error.statusCode).json({
      status: "fail",
      data: {
        message: error.message,
        stack: error.stack,
        error,
      },
    });
  }
  if (req.url.startsWith("/") && error.isOperational) {
    console.log(error);
    return res.status(error.statusCode).render("error", {
      error,
      message: error.message,
      title: `Regionify | Error`,
      heading: `Error `,
    });
  }
  if (req.url.startsWith("/") && !error.isOperational) {
    console.log(`The error is a non operational error from the views`);
    return res.status(500).render("error", {
      message: error.message,
      heading: `Error`,
      error,
      title: `Regionify | Error`,
    });
  }
};

const printErrorProd = function (error, req, res) {
  if (req.url.startsWith("/api") && error.isOperational) {
    return res.status(error.statusCode).json({
      status: "fail",
      data: {
        message: err.message,
      },
    });
  }
  if (req.url.startsWith("/api") && !error.isOperational) {
    res.status(500).json({
      status: "error",
      data: {
        message: `Something went very wrong! Please contact the system administrator via ${process.env.ADMIN_EMAIL}`,
      },
    });
  }
  if (req.url.startsWith("/") && error.isOperational) {
    return res.status(error.statusCode).render("error", {
      message: error.message,
    });
  }
  if (req.url.startsWith("/") && !error.isOperational) {
    console.log(error);
    return res
      .status(500)
      .render("error", { message: `Something went very wrong!` });
  }
};
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || `Something went wrong!`;
  if (process.env.NODE_ENV == "development") printErrorDev(err, req, res);
  if (process.env.NODE_ENV == "production") printErrorProd(err, req, res);
};

module.exports = globalErrorHandler;
