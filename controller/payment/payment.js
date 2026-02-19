import { CartProduct } from '../../database/cartProduct.js'
import { Order } from '../../database/orders.js'
import { Product } from '../../database/products.js'
import { User } from '../../database/user.js'
import { stripe } from '../../services/stripe.js'

export async function handlePayments (req, res, next) {
  try {
    const decoded = req.user
    const userId = decoded.sub
    const { allDetails, orderId } = req.details

    const line_items = allDetails.map(item => {
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product_name,
            images: [item.product_image]
          },
          unit_amount: Math.round(item.priceAtSale * 100)
        },
        quantity: item.product_quantity
      }
    })
    // console.log(line_items)

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: line_items,
      mode: 'payment',
      metadata: {
        orderId: orderId.toString(),
        userId: userId.toString()
      },
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}`
    })

    await Order.update(
      {
        stripeSessionId: session.id
      },
      {
        where: {
          id: orderId
        }
      }
    )

    res.status(200).json({
      status: 'success',
      url: session.url
    })
  } catch (error) {
    return next(error)
  }
}
