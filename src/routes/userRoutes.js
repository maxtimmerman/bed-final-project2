import express from "express";
import {
  getUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} from "../services/userService.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const users = await getUsers(req.query);
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json(user);
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
    const user = await getUser(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    next(error);
  }
});

router.put("/:id", authMiddleware, async (req, res, next) => {
  console.log("Update user - User ID from token:", req.user.id);
  console.log("Update user - Requested user ID:", req.params.id);
  try {
    const user = await updateUser(req.params.id, req.body, req.user.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
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
  try {
    const deleted = await deleteUser(req.params.id, req.user.id);
    if (deleted) {
      res.json({ message: "User successfully deleted" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    if (error.message === "Unauthorized") {
      res.status(403).json({ error: "Unauthorized" });
    } else {
      next(error);
    }
  }
});

router.get("/me", authMiddleware, async (req, res, next) => {
  try {
    const user = await getUser(req.userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    next(error);
  }
});

export default router;
