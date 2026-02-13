import { User } from '../../database/user'
import { Order } from '../../database/orders'
import { OrderItem } from '../../database/orderItems'
import { Product } from '../../database/products'
export async function createOrder (req, res, next) {
  try {
    const { id } = req.params
    const { reference, quantity } = req.body
    const decoded = req.user
    const userId = decoded.sub

    const user = await User.findByPk(userId)
    let order = await user.getOrder()

    const product = await Product.findByPk(parseInt(id))

    if (!order) {
      order = await user.createOrder()
    }

    await order.addProduct(product, {
      through: {}
    })
  } catch (error) {
    next(error)
  }
}
