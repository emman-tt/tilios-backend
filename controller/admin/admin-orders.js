import { Order } from '../../database/orders.js'
import { Transaction } from '../../database/transactions.js'
import { User } from '../../database/user.js'
export async function GetAllOrders (req, res, next) {
  try {
    // const page = parseInt(req.query.page) || 1
    // const limit = parseInt(req.query.limit) || 10
    // const offset = (page - 1) * limit
    const { filter } = req.query
    // console.log(filter)
    const whereClause = {}

    if (filter !== 'all') {
      whereClause.order_status = filter
    }

    const { count, rows } = await Order.findAndCountAll({
      //   limit,
      //   offset,
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email']
        },
        {
          model: Transaction,

          attributes: ['paymentMethod', 'amount', 'providerReference']
        }
      ]
    })

    if (!rows || rows.length === 0) {
      return res.status(203).json({
        status: 'success',
        message: 'No order found',
        orders: []
      })
    }

    return res.status(201).json({
      status: 'success',
      orders: rows,
      totalOrders: count,
      //   totalPages: Math.ceil(count / limit),
      //   currentPage: page,
      message: 'Orders fetched successfully'
    })
  } catch (error) {
    next(error)
  }
}

export async function confirmDeliveredStatus (req, res, next) {
  try {
    const { id } = req.params
    const order = await Order.findOne({
      where: {
        reference: id
      }
    })

    if (!order) {
      return res.status(404).json({
        status: 'failed',
        message: 'product not found'
      })
    }

    await order.update({
      order_status: 'delivered'
    })

    return res.status(201).json({
      status: 'success',
      message: 'order status updated successfully'
    })
  } catch (error) {
    next(error)
  }
}

export async function confirmPayment (req, res, next) {
  try {
    const { id } = req.params

    const alreadyConfirmed = await Order.findOne({
      where: {
        reference: id,
        payment_status: 'confirmed'
      }
    })
    if (alreadyConfirmed) {
      return res.status(200).json({
        message: 'Payment confirmed already'
      })
    }
    await Order.update(
      {
        payment_status: 'confirmed'
      },
      {
        where: {
          reference: id
        }
      }
    )

    return res.status(200).json({
      message: 'Payment confirmed'
    })
  } catch (error) {
    next(error)
  }
}
