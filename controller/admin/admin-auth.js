import bcrypt from 'bcryptjs'
import { User } from '../../database/user.js'
import { generateTokens } from '../../services/jwtService.js'
export async function adminLogin (req, res, next) {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({
        status: 'failed',
        message: 'Some required fields are missing'
      })
    }

    const Email = email.toLowerCase().trim()
    const Password = password

    const foundUser = await User.findOne({
      where: {
        email: Email,
        role: 'admin'
      }
    })

    if (!foundUser) {
      return res.status(401).json({
        status: 'failed',
        message: 'Invalid Email address or password'
      })
    }

    const foundPassoword = foundUser?.dataValues.password

    const checker = await bcrypt.compare(Password, foundPassoword)

    if (!checker) {
      return res.status(401).json({
        status: 'failed',
        message: 'Invalid Email address or password'
      })
    }

    const { accessToken, refreshToken } = await generateTokens(Email, 'admin')

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(200).json({
      status: 'success',
      message: 'Admin logged in successfully',
      accessToken: accessToken
    })
  } catch (error) {
    next(error)
  }
}
export async function adminSignup (req, res, next) {
  try {
    const { email, password, username } = req.body
    if (!email || !password || !username) {
      return res.status(400).json({
        status: 'failed',
        message: 'Some required fields are missing'
      })
    }

    const Email = email.toLowerCase().trim()
    const Password = password
    const foundUser = await User.findOne({
      where: {
        email: Email,
        role: 'admin'
      }
    })

    if (foundUser) {
      return res.status(400).json({
        status: 'failed',
        message: 'Admin already exists , please login'
      })
    }

    const hashedPassword = await bcrypt.hash(Password, 12)

    await User.create({
      name: username,
      email: Email,
      password: hashedPassword,
      role: 'admin'
    })

    res.status(201).json({
      status: 'success',
      message: 'Admin created successfully'
    })
  } catch (error) {
    next(error)
  }
}
