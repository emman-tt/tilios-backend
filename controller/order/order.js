import { User } from '../../database/user.js'
import { Order } from '../../database/orders.js'

import { Product } from '../../database/products.js'
import { v4 as uuidv4 } from 'uuid'
import { CartProduct } from '../../database/cartProduct.js'
import { sequelize } from '../../config/sql.js'
import { Transaction } from '../../database/transactions.js'
export async function createOrder (req, res, next) {
  try {
    const { id } = req.params
    const { address, details } = req.body
    const decoded = req.user
    const userId = decoded.sub

    const user = await User.findByPk(userId)

    const cart = await user.getCart()

    if (!cart) {
      return res.status(404).json({
        status: 'failed',
        message: 'Cart doesnt exist'
      })
    }
    const item = await cart.getProducts()

    const products = item.map(item => item.dataValues)
    if (products.length === 0 || !products) {
      return res.status(404).json({
        status: 'failed',
        message: 'No items in cart'
      })
    }

    const orderTotal = await calculateOrderTotal(cart.id)
    const reference = `TIL-${uuidv4().split('-')[0].toUpperCase()}`

    const cartproducts = await CartProduct.findAll({
      where: {
        cartId: cart.id
      },
      include: [
        {
          model: Product,
          attributes: ['image', 'name', 'amount']
        }
      ]
    })
    // cartproducts.map(item => console.log(item.dataValues.product.name))

    const allDetails = cartproducts.map(item => {
      return {
        product_name: item.dataValues.product.name,
        product_image: item.dataValues.product.image,
        product_price: item.dataValues.product.amount,
        product_id: item.productId,
        priceAtSale: item.priceAtSale,
        product_quantity: item.quantity,
        product_total: item.total
      }
    })

    const latestOrder = await user.getOrders({
      where: { status: 'pending' },
      order: [['createdAt', 'DESC']],
      limit: 1
    })

    const order = latestOrder[0]
    if (order) {
      await order.update({
        totalAmount: orderTotal,
        shippingAddress: address,
        product_details: allDetails
      })

      req.details = { allDetails, orderId: order.id }
      return next()
    }

    const newOrder = await user.createOrder({
      status: 'pending',
      totalAmount: orderTotal,
      shippingAddress: address,
      product_details: allDetails,
      reference: reference,
      stripeSessionId: null
    })

    req.details = {
      allDetails,
      orderId: newOrder.id
    }
    return next()
  } catch (error) {
    next(error)
  }
}

export async function updateOrder (session) {
  const { orderId, userId } = session.metadata

  const order = await Order.findByPk(parseInt(orderId))

  if (!order || order.status === 'paid') {
    console.log('Order not found or already paid.')
    return
  }

  await sequelize.transaction(async t => {
    await Order.update(
      {
        stripeSessionId: session.id,
        status: 'paid'
      },
      {
        where: {
          id: orderId
        }
      },
      { transaction: t }
    )

    const user = await User.findByPk(parseInt(userId))
    const cart = await user.getCart()

    await Transaction.create(
      {
        orderId: orderId,
        paymentMethod: 'Stripe',
        providerReference: session.id,
        amount: session.amount_total / 100
      },
      {
        transaction: t
      }
    )

    await CartProduct.destroy(
      { where: { cartId: cart.id } },
      { transaction: t }
    )
  })
}

export async function confirmOrder (req, res, next) {
  try {
    const { sessionId } = req.params
    const decoded = req.user
    const userId = decoded.sub
    const order = await Order.findOne({
      include: [
        {
          model: User,
          attributes: ['name', 'email']
        }
      ],
      where: {
        stripeSessionId: sessionId
      }
    })

    if (!order) {
      return res.status(404).json({
        status: 'failed',
        message: 'Transaction was unsuccessfull or unpaid'
      })
    }

    const details = await order.dataValues

    console.log(details)
    return res.status(201).json({
      status: 'success',
      message: 'Transaction was succesful',
      details: details
    })
  } catch (error) {
    next(error)
  }
}

async function calculateOrderTotal (Id) {
  const orderTotal = await CartProduct.sum('total', {
    where: {
      cartId: Id
    }
  })

  return (orderTotal + 0.0).toFixed(2)
}
