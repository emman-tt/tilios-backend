import bcrypt from 'bcryptjs'
import { User } from '../../database/user.js'
import { generateTokens } from '../../services/jwtService.js'
export async function userLogin (req, res, next) {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({
        status: 'failed',
        message: 'Some required fields are missing'
      })
    }

    const foundUser = await User.findOne({
      where: {
        email: email,
        role: 'user'
      }
    })

    if (!foundUser) {
      return res.status(401).json({
        status: 'failed',
        message: 'Invalid Email address or password'
      })
    }

    const foundPassoword = foundUser?.dataValues.password

    const checker = await bcrypt.compare(password, foundPassoword)

    if (!checker) {
      return res.status(401).json({
        status: 'failed',
        message: 'Invalid Email address or password'
      })
    }

    const { accessToken, refreshToken } = await generateTokens(email, 'user')

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(200).json({
      status: 'success',
      message: 'User logged in successfully',
      accessToken: accessToken
    })
  } catch (error) {
    next(error)
  }
}

export async function userSignUp (req, res, next) {
  try {
    const { email, username, password } = req.body

    if (!email || !username || !password) {
      return res.status(400).json({
        status: 'failed',
        message: 'Some required fields are missing'
      })
    }

    const foundUser = await User.findOne({
      where: {
        email: email,
        role: 'user'
      }
    })

    if (foundUser) {
      return res.status(400).json({
        status: 'failed',
        message: 'User already exists, Please Log in'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    await User.create({
      name: username,
      email: email,
      password: hashedPassword,
      role: 'user'
    })

    res.status(201).json({
      status: 'success',
      message: 'user created successfully'
    })
  } catch (error) {
    next(error)
  }
}
