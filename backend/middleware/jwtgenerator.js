const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  let payload = {
    id: user.id,
    username: user.username,
    email: user.email,
  };

  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: "5s",
  });
};
module.exports = generateToken;
