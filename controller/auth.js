import bcrypt from 'bcryptjs'
import { User } from '../database/user.js'
export async function userLogin (req, res) {
  try {
    const { email, password } = req.query
    if (!email || !password) {
      return res.status(400).json({
        status: 'failed',
        message: 'Some required fields are missing'
      })
    }

    const foundUser = await User.findOne({
      where: {
        email: email
      }
    })

    if (!foundUser) {
      return res.status(401).json({
        status: 'failed',
        message: 'Invalid Email address or password'
      })
    }

    const foundPassoword = foundUser?.dataValues.password

    const checker = bcrypt.compare(password, foundPassoword)
    if (!checker) {
      return res.status(401).json({
        status: 'failed',
        message: 'Invalid Email address or password'
      })
    }
  } catch (error) {
    next(error)
  }
}

export async function userSignUp (req, res) {
  try {
    const { email, username, password } = req.query
    if (!email || !username || !password) {
      return res.status(400).json({
        status: 'failed',
        message: 'Some required fields are missing'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    await User.create({
      name: username,
      email: email,
      password: hashedPassword
    })

    res.status(201).json({
      status: 'success',
      message: 'user created successfully'
    })
  } catch (error) {
    next(error)
  }
}
