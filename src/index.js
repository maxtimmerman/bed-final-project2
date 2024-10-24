import express from "express";
import dotenv from "dotenv";
import * as Sentry from "@sentry/node";
import userRoutes from "./routes/users.js";
import hostRoutes from "./routes/hosts.js";
import propertyRoutes from "./routes/properties.js";
import amenityRoutes from "./routes/amenities.js";
import bookingRoutes from "./routes/bookings.js";
import reviewRoutes from "./routes/reviews.js";
import loginRouter from "./routes/login.js";
import loggingMiddleware from "./middleware/logMiddleware.js";
import errorHandler from "./middleware/errorHandler.js";
import { PrismaClient } from "@prisma/client";

// Load environment variables
dotenv.config();
const prisma = new PrismaClient();

// Initialize express app
const app = express();

// Test database connection
prisma
  .$connect()
  .then(() => console.log("Database connection successful"))
  .catch((e) => console.error("Database connection failed", e));

//Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    new Sentry.Integrations.Http({
      tracing: true,
    }),
    new Sentry.Integrations.Express({
      app,
    }),
  ],
  tracesSampleRate: 1.0,
});

// Middleware
app.use(express.json());
app.use(loggingMiddleware);

// Resource routes
app.use("/users", userRoutes);
app.use("/hosts", hostRoutes);
app.use("/properties", propertyRoutes);
app.use("/amenities", amenityRoutes);
app.use("/bookings", bookingRoutes);
app.use("/reviews", reviewRoutes);

// Login route
app.use("/login", loginRouter);

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(err.status || 500).json({
//     error: {
//       message: err.message || "An unexpected error occurred",
//       status: err.status || 500,
//     },
//   });
// });

//Trace errors
app.use(Sentry.Handlers.errorHandler());

// Error handling
app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
