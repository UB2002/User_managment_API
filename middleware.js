const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Forbidden: Admins only" });
  next();
};

module.exports = { authMiddleware, adminMiddleware };
