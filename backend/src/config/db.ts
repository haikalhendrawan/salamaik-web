import pg from 'pg';
const { Pool } = pg;
import "dotenv/config"; 
 
const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  max: 20,
  idleTimeoutMillis: 60000,
});

export default pool

