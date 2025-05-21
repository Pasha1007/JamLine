import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "./jwtgenerator.js";

const refreshTokens = new Set();

const addToken = (token) => refreshTokens.add(token);
const removeToken = (token) => refreshTokens.delete(token);
const hasToken = (token) => refreshTokens.has(token);

const refresh = (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken || !hasToken(refreshToken)) {
    return res.sendStatus(403);
  }

  jwt.verify(refreshToken, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);

    removeToken(refreshToken);

    const newAccessToken = generateAccessToken({
      id: user.id,
      email: user.email,
    });

    const newRefreshToken = generateRefreshToken({
      id: user.id,
      email: user.email,
    });

    addToken(newRefreshToken);

    res
      .cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        path: "/refresh",
      })
      .json({ accessToken: newAccessToken });
  });
};

export default { addToken, removeToken, hasToken, refresh };
