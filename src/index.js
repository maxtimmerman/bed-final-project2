import express from "express";
import dotenv from "dotenv";
import * as Sentry from "@sentry/node";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import hostRoutes from "./routes/hostRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import amenityRoutes from "./routes/amenityRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import loggingMiddleware from "./middleware/loggingMiddleware.js";
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

// Initialize Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Sentry.Integrations.Express({ app }),
    // Uncomment the next line if ProfilingIntegration is available
    // new Sentry.Integrations.Profiling(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production
});

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

// Middleware
app.use(express.json());
app.use(loggingMiddleware);

// Routes
app.use("/auth", authRoutes);
app.use("/login", authRoutes);
app.use("/users", userRoutes);
app.use("/hosts", hostRoutes);
app.use("/properties", propertyRoutes);
app.use("/amenities", amenityRoutes);
app.use("/bookings", bookingRoutes);
app.use("/reviews", reviewRoutes);

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
    res.status(err.status || 500).json({
      error: {
      message: err.message || "An unexpected error occurred",
      status: err.status || 500,
    },
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
