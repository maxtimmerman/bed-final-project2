import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
  console.log("Auth middleware hit");
  const authHeader = req.headers.authorization;
  console.log("Auth header:", authHeader);

  if (!authHeader) {
    console.log("No auth header provided");
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);
    req.user = decoded;
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.log("Token verification failed:", err);
    return res.status(401).json({ error: "Token invalid" });
  }
}
