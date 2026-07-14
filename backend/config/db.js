const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

let pool = null;

async function connectDatabase() {
  if (pool) return pool;

  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'browniee',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    await pool.query('SELECT 1');
    console.log('Connected to MySQL database');
    return pool;
  } catch (error) {
    console.warn('MySQL not available, using in-memory fallback store:', error.message);
    pool = null;
    return null;
  }
}

async function initializeDatabase() {
  const connection = await connectDatabase();
  if (!connection) return;

  const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');
  const statements = schema
    .split(';')
    .map((statement) => statement.trim())
    .filter(Boolean);

  for (const statement of statements) {
    await connection.execute(statement);
  }
}

async function query(sql, params = []) {
  const connection = await connectDatabase();
  if (!connection) return null;
  const [rows] = await connection.execute(sql, params);
  return rows;
}

module.exports = {
  connectDatabase,
  initializeDatabase,
  query,
  isDatabaseReady: () => Boolean(pool)
};
