const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

pool.connect()
  .then(client => {
    console.log('conectado ao banco postgresql com sucesso')
    client.release()
  })
  .catch(err => {
    console.error('erro ao conectar no banco postgresql:', err.message, process.env.DATABASE_URL)
    process.exit(1)
  })

async function findByEmail(email) {
  const res = await pool.query('select * from users where email=$1', [email])
  return res.rows[0]
}

async function create({ email, password, name }) {
  const res = await pool.query(
    'insert into users (email, password, name) values ($1, $2, $3) returning id',
    [email, password, name]
  )
  return { id: res.rows[0].id, email, name }
}

module.exports = { findByEmail, create }
