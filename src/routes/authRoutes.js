import express from "express";
import { login } from "../services/authService.js";

const router = express.Router();

const loginHandler = async (req, res, next) => {
  console.log("Login request body:", req.body);
  try {
    const { username, email, password } = req.body;
    const usernameOrEmail = username || email;
    console.log("Attempting login with:", usernameOrEmail);
    const token = await login(usernameOrEmail, password);
    res.json({ token });
  } catch (error) {
    console.error("Error in auth route:", error);
    if (
      error.message === "User not found" ||
      error.message === "Invalid password"
    ) {
      res.status(401).json({ error: "Invalid credentials" });
    } else {
      next(error);
    }
  }
};

router.post("/login", loginHandler);
router.post("/", loginHandler);

export default router;
