import { User } from '../../database/user.js'

export async function adminCheck (req, res, next) {
  try {
    const decoded = req.user
    const userId = decoded.sub
    const user = await User.findOne({
      where: {
        id: userId,
        role: 'admin'
      }
    })

    const username = user.dataValues.name
    return res.status(201).json({
      status: 'success',
      message: 'Admin verified',
      name: username
    })
  } catch (error) {
    next(error)
  }
}
