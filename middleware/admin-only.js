import { User } from '../database/user.js'
export function adminOnly (req, res, next) {
  try {
    const decoded = req.user
    const userId = decoded.sub
    const userCheck = User.findOne({
      where: {
        id: userId,
        role: 'admin'
      }
    })

    if (!userCheck) {
      return res.status(401).json({
        status: 'failed',
        message: 'Unauthorized / unknown , not an admin)'
      })
    }

    next()
  } catch (error) {
    next(error)
  }
}
