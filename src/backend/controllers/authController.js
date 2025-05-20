const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')

const JWT_SECRET = process.env.JWT_SECRET

router.get('/@me', async (req, res) => {
    try {
      const authHeader = req.headers.authorization
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token not provided' })
      }
  
      const token = authHeader.split(' ')[1]
      const decoded = jwt.verify(token, JWT_SECRET)
  
      const user = await userModel.findById(decoded.id)
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }
  
      res.json({
        id: user.id,
        email: user.email,
        name: user.name
      })
    } catch (err) {
      res.status(401).json({ error: 'Invalid or expired token' })
    }
  })
  

router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body
    const existingUser = await userModel.findByEmail(email)
    if (existingUser) return res.status(400).json({ error: 'email already registered' })

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await userModel.create({ email, password: hashedPassword, name })
    res.status(201).json({ message: 'user created', userId: user.id })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await userModel.findByEmail(email)
    if (!user) return res.status(401).json({ error: 'invalid credentials' })

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) return res.status(401).json({ error: 'invalid credentials' })

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '5d' })
    res.json({ token })
  } catch (err) {
    res.status(401).json({ error: err.message })
  }
})

router.post('/logout', (req, res) => {
  res.json({ message: 'logout successful' })
})

module.exports = router
