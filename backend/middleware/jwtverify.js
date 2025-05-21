import jwt from "jsonwebtoken";
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    if (!token) return res.status(401).send("Access Denied");
    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

export default verifyToken;
