
import jwt from "jsonwebtoken";

const userAuth = (req, res, next) => {
  const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: token not found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    console.log("Cookies received:", req.cookies);
console.log("Authorization header:", req.header("Authorization"));

    next();
  } catch (error) {
    // ✅ Handle expired token
    if (error.name === "TokenExpiredError") {
      console.warn("JWT expired at:", error.expiredAt);

      // Clear the cookie so browser stops sending it
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      });

      return res.status(401).json({ message: "Session expired. Please log in again." });
    }

    // Other JWT errors
    console.error("JWT verify failed:", error.message);
    return res.status(401).json({ message: "Unauthorized", error: error.message });
  }
};

export default userAuth;
