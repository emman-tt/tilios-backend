import { CartProduct } from '../../database/cartProduct.js'
import { Product } from '../../database/products.js'
import { User } from '../../database/user.js'
import { stripe } from '../../services/stripe.js'

export async function handlePayments (req, res, next) {
  try {
    const decoded = req.user
    const userId = decoded.sub

    const user = await User.findByPk(userId)
    const cart = await user.getCart()

    if (!cart) {
      return res.status(404).json({
        status: 'failed',
        message: 'no items in cart/ cart doesnt exist'
      })
    }

    // const cartProduct = await CartProduct.findAll({
    //   where: {
    //     cartId: cart.id
    //   }
    // })

    const cartItems = await CartProduct.findAll({
      where: { cartId: cart.id },
      include: [{ model: Product, attributes: ['name', 'image'] }]
    })
    cartItems.map(item => console.log(item.dataValues.product.name))

    const line_items = cartItems.map(item => {
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product.dataValues.name,
            images: [item.product.dataValues.image]
          },
          unit_amount: Math.round(item.priceAtSale * 100)
        },
        quantity: item.quantity
      }
    })

    const session = stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: line_items,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`
    })
    console.log(line_items)

    res.status(200).json({
      status: 'success',
      url: (await session).url
    })
  } catch (error) {
    next(error)
  }
}
