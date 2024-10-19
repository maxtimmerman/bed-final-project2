import express from "express";
import {
  getBookings,
  createBooking,
  getBooking,
  updateBooking,
  deleteBooking,
} from "../services/bookingService.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const bookings = await getBookings();
    res.json(bookings);
  } catch (error) {
    next(error);
  }
});

router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const booking = await createBooking(req.body);
    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", authMiddleware, async (req, res, next) => {
  try {
    const booking = await getBooking(req.params.id);
    if (booking) {
      res.json(booking);
    } else {
      res.status(404).json({ error: "Booking not found" });
    }
  } catch (error) {
    next(error);
  }
});

router.put("/:id", authMiddleware, async (req, res, next) => {
  try {
    const booking = await updateBooking(req.params.id, req.body);
    res.json(booking);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", authMiddleware, async (req, res, next) => {
  try {
    await deleteBooking(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default router;
