import { User } from '../../database/user.js'

export async function silentUserAuth (req, res, next) {
  try {
    const decoded = req.user
    const userId = decoded.sub
    const role = decoded.role
    // console.log(decoded)
    const user = await User.findOne({
      where: {
        id: userId,
        role: role
      }
    })
   

    res.status(201).json({
      status: 'success',
      message: 'user session still active',
      email: user.dataValues.email
    })
  } catch (error) {
    next(error)
  }
}
