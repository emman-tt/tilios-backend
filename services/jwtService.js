import dotenv from 'dotenv'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { User } from '../database/user.js'
dotenv.config()

export async function generateTokens (email, role) {
  const accessSecret = process.env.ACCESS_SECRET
  const refreshSecret = process.env.REFRESH_SECRET

  const foundUser = await User.findOne({
    where: {
      email: email
    }
  })

  const userId = await foundUser.dataValues.id

  const payload = {
    sub: userId,
    role: role
  }

  const accessToken = jwt.sign(payload, accessSecret, {
    expiresIn: '10m'
  })

  const refreshToken = jwt.sign(payload, refreshSecret, {
    expiresIn: '7d'
  })

  return { accessToken, refreshToken }
}
