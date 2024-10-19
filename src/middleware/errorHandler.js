import * as Sentry from "@sentry/node";

export default function errorHandler(err, req, res, next) {
  // Log the error (you can use console.error for now, we'll update this to use Sentry soon)
  console.error(err);

  // Report error to Sentry
  Sentry.captureException(err);

  // Send a generic error message to the client
  if (process.env.NODE_ENV === "development") {
    res.status(err.status || 500).json({
      message: err.message,
      error: err,
    });
  } else {
    res.status(500).json({
      error:
        "An error occurred on the server, please double-check your request!",
    });
  }
}
