const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "1007",
  host: "localhost",
  port: 5432,
  database: "jamline",
});

module.exports = pool;
