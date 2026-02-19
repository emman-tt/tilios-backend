import { User } from '../../database/user.js'

export async function adminCheck (req, res, next) {
  try {
    const decoded = req.user
    const userId = decoded.sub
  
    const admin = await User.findOne({
      where: {
        id: userId,
        role: 'admin'
      }
    })

    if (!admin) {
      return res.status(401).json({
        status: 'failed',
        message: 'Not an admin'
      })
    }

    const username = admin.dataValues.name
    return res.status(201).json({
      status: 'success',
      message: 'Admin verified',
      name: username
    })
  } catch (error) {
    next(error)
  }
}
