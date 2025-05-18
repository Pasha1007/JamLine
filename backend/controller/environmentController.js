const db = require("../db");
const Joi = require("joi");
const jwt = require("../middleware/jwtverify");

class environmentController {
  async createEnv(req, res) {
    const schema = Joi.object({
      name: Joi.string().required(),
      instrument: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { name, instrument } = req.body;
    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(401).json({ error: "Unauthorized: User ID not found" });
    }

    const createdAt = new Date();
    const updatedAt = new Date();

    try {
      const result = await db.query(
        "INSERT INTO environments (name, instrument, user_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [name, instrument, user_id, createdAt, updatedAt]
      );
      return res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to create environment" });
    }
  }

  async deleteEnv(req, res) {
    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(401).json({ error: "Unauthorized: User ID not found" });
    }
    const { id } = req.params;
    try {
      const result = await db.query(
        "DELETE FROM environments WHERE id = $1 AND user_id = $2 RETURNING *",
        [id, user_id]
      );
      return res.status(200).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to delete environment" });
    }
  }

  async getMyEnvs(req, res) {
    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(401).json({ error: "Unauthorized: User ID not found" });
    }

    try {
      const result = await db.query(
        "SELECT * FROM environments WHERE user_id = $1",
        [user_id]
      );
      return res.status(200).json(result.rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to retrieve environments" });
    }
  }

  async getEnvById(req, res) {
    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(401).json({ error: "Unauthorized: User ID not found" });
    }
    const { id } = req.params;

    try {
      const result = await db.query(
        "SELECT * FROM environments WHERE id = $1 AND user_id = $2",
        [id, user_id]
      );
      return res.status(200).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to get environment" });
    }
  }
}

module.exports = new environmentController();
