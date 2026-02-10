import dotenv from 'dotenv'
dotenv.config()
import jwt from 'jsonwebtoken'

export function authenticateToken (req, res, next) {
  try {
    const authHeader = req.headers['authorization']
    const accessToken = authHeader && authHeader.split(' ')[1]

    if (!accessToken) {
      return res.status(401).json({
        status: 'failed',
        message: 'No token provided'
      })
    }

    jwt.verify(accessToken, process.env.ACCESS_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          status: 'failed',
          message: 'Invalid or expired token'
        })
      }

      req.user = decoded
      next()
    })
  } catch (error) {
    next(error)
  }
}

export function refreshAuth (req, res, next) {
  try {
    const refreshToken = req.cookies?.refreshToken

    if (!refreshToken) {
      return res.status(401).json({
        status: 'failed',
        message: 'Unauthorized, no token provided'
      })
    }

    jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
      if (err) {
        return res.status(405).json({
          status: 'failed',
          message: 'Invalid or expired refresh token ,please log in'
        })
      }

      const payload = {
        sub: decoded.sub,
        role: decoded.role
      }

      const newAccessToken = jwt.sign(payload, process.env.ACCESS_SECRET)
      return res.status(201).json({
        status: 'success',
        message: 'New access token generated',
        accessToken: newAccessToken
      })
    })
  } catch (error) {
    next(error)
  }
}
