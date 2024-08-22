//connect to mysql
require('dotenv').config();
const mysql = require('mysql2/promise');
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 500,
  queueLimit: 0,
});

exports.connect = async function (func) {
  const conn = await pool.getConnection();
  let result = false;
  try {
    const rows = await func.apply(this, [conn]);
    result = rows;
  } catch (err) {
    conn.connection.release();
    console.log(err);
    throw err;
  }

  conn.connection.release();
  return result;
};

exports.transaction = async function (func) {
  const conn = await pool.getConnection();
  conn.connection.beginTransaction();
  let result = undefined;
  try {
    const rows = await func.apply(this, [conn]);
    result = rows;
  } catch (err) {
    conn.rollback();
    conn.connection.release();
    console.log(err);
    throw err;
  }

  await conn.commit();
  conn.connection.release();
  return result;
};
exports.finish = async () => {
  await pool.end(function (err) {
    if (err) {
      return console.log('error:' + err.message);
    }
    console.log('Close the database connection.');
  });
};
