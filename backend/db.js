import pkg from "pg";
const { Pool } = pkg;
const pool = new Pool({
  user: "postgres",
  password: "1007",
  host: "localhost",
  port: 5432,
  database: "jamline",
});

export default pool;
