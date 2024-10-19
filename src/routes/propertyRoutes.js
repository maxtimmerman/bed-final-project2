import express from "express";
import {
  getProperties,
  createProperty,
  getProperty,
  updateProperty,
  deleteProperty,
} from "../services/propertyService.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const properties = await getProperties(req.query);
    res.json(properties);
  } catch (error) {
    next(error);
  }
});

router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const property = await createProperty(req.body, req.user.id);
    res.status(201).json(property);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const property = await getProperty(req.params.id);
    if (property) {
      res.json(property);
    } else {
      res.status(404).json({ error: "Property not found" });
    }
  } catch (error) {
    next(error);
  }
});

router.put("/:id", authMiddleware, async (req, res, next) => {
  try {
    const property = await updateProperty(req.params.id, req.body);
    res.json(property);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", authMiddleware, async (req, res, next) => {
  try {
    await deleteProperty(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
