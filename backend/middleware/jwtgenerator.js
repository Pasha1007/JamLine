import jwt from "jsonwebtoken";

const generateAccessToken = (user) => {
  let payload = {
    id: user.id,
    username: user.username,
    email: user.email,
  };

  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: "15m",
  });
};
const generateRefreshToken = (user) => {
  let payload = {
    id: user.id,
    username: user.username,
    email: user.email,
  };

  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });
};

export { generateAccessToken, generateRefreshToken };
