import db from "../db.js";
import Joi from "joi";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../middleware/jwtgenerator.js";
import jwtrefresh from "../middleware/jwtrefresh.js";
const { addToken } = jwtrefresh;

class authController {
  async authorization(req, res) {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    try {
      const { email, password } = req.body;

      const userQuery = await db.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);
      const existingUser = userQuery.rows[0];

      if (existingUser) {
        if (existingUser.password === password) {
          const accessToken = generateAccessToken(existingUser);
          const refreshToken = generateRefreshToken(existingUser);
          addToken(refreshToken);

          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            path: "/refresh",
          });

          return res.status(200).json({
            message: "Successfully logged in",
            accessToken,
          });
        } else {
          return res.status(400).json({ error: "Wrong password" });
        }
      } else {
        const newUser = await db.query(
          "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
          [email, password]
        );
        const user = newUser.rows[0];

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        addToken(refreshToken);

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          path: "/refresh",
        });

        return res.status(200).json({
          message: "Successfully signed up",
          accessToken,
        });
      }
    } catch (err) {
      console.error("Authentication error:", err.message, err.stack);
      res.status(500).json({ err: "Internal server error" });
    }
  }

  async updateNickname(req, res) {
    try {
      const { id, nickname } = req.body;
      const updatedUser = await db.query(
        "UPDATE users SET nickname = $1 WHERE id = $2 RETURNING id, email, nickname",
        [nickname, id]
      );
      if (updatedUser.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(updatedUser.rows[0]);
    } catch (err) {
      res.status(500).json({ err: "Internal server error" });
    }
  }

  async getUsers(req, res) {
    try {
      const users = await db.query("SELECT id, email, nickname FROM users");
      res.json(users.rows);
    } catch (err) {
      res.status(500).json({ err: "Internal server error" });
    }
  }
}

export default new authController();
