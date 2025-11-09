import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    const decodedToken = jwt.verify(
      token,
      "qawsedrf-edwsqaws-wsqaedws-wswswsws"
    );

    // Store user info in req.user
    req.body = {...req.body, userId: decodedToken.userId };
      req.user = {
      _id: decodedToken.userId,
      email: decodedToken.email, // optional
      level: decodedToken.level, 
        // optional
    };
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default authMiddleware;
