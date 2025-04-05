const jwt = require('jsonwebtoken')
require('dotenv').config()

/**
 * Generates a JWT token for authentication
 * @param {object} user - User data to encode in token
 * @returns {string} JWT token
 */
const buildToken = (user) => {
  const payload = {
    account_id: user.account_id,
    account_type: user.account_type
  }
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })
}

/**
 * Verifies a JWT token
 * @param {string} token - Token to verify
 * @returns {object|null} Decoded token payload or null if invalid
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch (error) {
    return null
  }
}

/**
 * Sets a cookie with the JWT token
 * @param {object} res - Response object
 * @param {string} token - JWT token
 */
const setCookie = (res, token) => {
  const options = {
    httpOnly: true,
    maxAge: 3600 * 1000 // 1 hour
  }
  
  if (process.env.NODE_ENV !== 'development') {
    options.secure = true
  }
  
  res.cookie('jwt', token, options)
}

module.exports = { buildToken, verifyToken, setCookie }
