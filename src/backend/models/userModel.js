const { Pool } = require('pg')
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

async function findByEmail(email) {
  const res = await pool.query('select * from users where email=$1', [email])
  return res.rows[0]
}

async function create({ email, password }) {
  const res = await pool.query(
    'insert into users (email, password) values ($1, $2) returning id',
    [email, password]
  )
  return { id: res.rows[0].id, email }
}

module.exports = { findByEmail, create }
