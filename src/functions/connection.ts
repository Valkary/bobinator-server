import mysql from 'mysql2';

import { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME } from '../constants';

const pool_connection = mysql.createPool({
  host: DB_HOST,
  user: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool_connection;