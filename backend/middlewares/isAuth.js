
import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
  try {
    console.log("🔍 Checking auth middleware...");
    const token = req.cookies?.token;
    console.log("🍪 Token from cookies:", token ? "Token found" : "No token");

    if (!token) {
      return res.status(200).json(null);
    }

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verifyToken.userId;
    console.log("✅ Token verified successfully, userId:", req.userId);

    next();
  } catch (error) {
    console.error("🚨 Token verification failed:", error.message);
    return res.status(401).json(null);
  }
};

export default isAuth;


