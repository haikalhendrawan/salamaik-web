/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import pg from 'pg';
const { Pool, types } = pg;
import "dotenv/config"; 

const NUMERIC_OID = 1700;

// Override NUMERIC type dari string ke number
types.setTypeParser(NUMERIC_OID, (value) => {
  return parseFloat(value);
});

 
const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  max: 20,
  idleTimeoutMillis: 60000,
});

export default pool

