import { User } from '../database/user.js'

export async function isMeMiddleware (req, res, next) {
  const decoded = req.user
  const userId = decoded.sub
  const user = await User.findByPk(userId)
  const isMe = user.dataValues.email === 'emmanuelaquarius2006@gmail.com'

  if (!isMe) {
    return res.status(406).json({
      status: 'failed',
      message: 'You are not me lol'
    })
  }

  next()
}
