import express from "express";
import {
  getAmenities,
  createAmenity,
  getAmenity,
  updateAmenity,
  deleteAmenity,
} from "../services/amenityService.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const amenities = await getAmenities();
    res.json(amenities);
  } catch (error) {
    next(error);
  }
});

router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const amenity = await createAmenity(req.body);
    res.status(201).json(amenity);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const amenity = await getAmenity(req.params.id);
    if (amenity) {
      res.json(amenity);
    } else {
      res.status(404).json({ error: "Amenity not found" });
    }
  } catch (error) {
    next(error);
  }
});

router.put("/:id", authMiddleware, async (req, res, next) => {
  try {
    const amenity = await updateAmenity(req.params.id, req.body);
    res.json(amenity);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", authMiddleware, async (req, res, next) => {
  try {
    await deleteAmenity(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default router;
