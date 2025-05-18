const jwt = require("jsonwebtoken");
const generateToken = require("./jwtgenerator");

class refreshToken {
  async refresh(req, res) {
    try {
      const { token } = req.body;
      if (!token) {
        return res.status(400).json({ message: "Refresh token is required" });
      }

      jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Refresh token expired" });
          }
          return res.status(401).json({ message: "Invalid refresh token" });
        }

        const { user_id, ...rest } = decoded;

        const newToken = generateToken({
          user_id,
          ...rest,
        });

        res.status(200).json({ token: newToken });
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new refreshToken();
