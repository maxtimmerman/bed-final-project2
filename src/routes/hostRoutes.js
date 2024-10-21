import express from "express";
import {
  getHosts,
  createHost,
  getHost,
  updateHost,
  deleteHost,
} from "../services/hostService.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const hosts = await getHosts(req.query);
    res.json(hosts);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const host = await createHost(req.body);
    res.status(201).json(host);
  } catch (error) {
    if (error.code === "P2002") {
      res.status(400).json({ error: "Email or username already exists" });
    } else {
      next(error);
    }
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const host = await getHost(req.params.id);
    if (host) {
      res.json(host);
    } else {
      res.status(404).json({ error: "Host not found" });
    }
  } catch (error) {
    next(error);
  }
});

router.put("/:id", authMiddleware, async (req, res, next) => {
  console.log("Update host - User ID from token:", req.user.id);
  console.log("Update host - Requested host ID:", req.params.id);
  try {
    const host = await updateHost(req.params.id, req.body, req.user.id);
    if (host) {
      res.json(host);
    } else {
      res.status(404).json({ error: "Host not found" });
    }
  } catch (error) {
    if (error.message === "Unauthorized") {
      res.status(403).json({ error: "Unauthorized" });
    } else {
      next(error);
    }
  }
});

router.delete("/:id", authMiddleware, async (req, res, next) => {
  console.log("Delete host - User ID from token:", req.user.id);
  console.log("Delete host - Requested host ID:", req.params.id);
  try {
    const deleted = await deleteHost(req.params.id, req.userId);
    if (deleted) {
      res.status(204).end();
    } else {
      res.status(404).json({ error: "Host not found" });
    }
  } catch (error) {
    if (error.message === "Unauthorized") {
      res.status(403).json({ error: "Unauthorized" });
    } else {
      next(error);
    }
  }
});

export default router;
