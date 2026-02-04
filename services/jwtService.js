import dotenv from 'dotenv'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'

dotenv.config()

export function generateTokens () {
  const accessCode = crypto.randomBytes(10).toString('hex')
}
