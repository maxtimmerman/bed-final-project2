import express from "express";
import {
  getReviews,
  createReview,
  getReview,
  updateReview,
  deleteReview,
} from "../services/reviewService.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const reviews = await getReviews();
    res.json(reviews);
  } catch (error) {
    next(error);
  }
});

router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const review = await createReview(req.body);
    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const review = await getReview(req.params.id);
    if (review) {
      res.json(review);
    } else {
      res.status(404).json({ error: "Review not found" });
    }
  } catch (error) {
    next(error);
  }
});

router.put("/:id", authMiddleware, async (req, res, next) => {
  try {
    const review = await updateReview(req.params.id, req.body);
    res.json(review);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", authMiddleware, async (req, res, next) => {
  try {
    await deleteReview(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default router;
