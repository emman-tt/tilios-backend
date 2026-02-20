import { Model } from 'sequelize'
import { Order } from '../../database/orders.js'
import { Transaction } from '../../database/transactions.js'
import { User } from '../../database/user.js'
import { sequelize } from '../../config/sql.js'
export async function getOverview (req, res, next) {
  try {
    const [
      total_revenue,
      revenue_sync,
      total_orders,
      orders_sync,
      delivered_orders,
      refunded_orders
    ] = await Promise.all([
      Transaction.sum('amount'),
      Transaction.findOne({
        attributes: ['updatedAt'],
        order: [['updatedAt', 'DESC']]
      }),
      Order.count(),
      Order.findOne({
        attributes: ['updatedAt'],
        order: [['updatedAt', 'DESC']]
      }),
      Order.count({ where: { order_status: 'delivered' } }),
      Order.count({ where: { order_status: 'refunded' } })
    ])

    const customers = await User.findAll({
      attributes: ['name', 'email', 'createdAt'],
      include: [
        {
          model: Order,
          required: true,
          attributes: []
        }
      ],
      limit: 4
    })

    const revenueData = await Transaction.findAll({
      attributes: [
        [
          sequelize.fn('date_trunc', 'day', sequelize.col('createdAt')),
          'time_bucket'
        ],
        [sequelize.fn('SUM', sequelize.col('amount')), 'total_revenue']
      ],
      group: [sequelize.fn('date_trunc', 'day', sequelize.col('createdAt'))],
      order: [
        [sequelize.fn('date_trunc', 'day', sequelize.col('createdAt')), 'ASC']
      ],
      raw: true
    })

    const analytics = {
      total_revenue,
      total_orders,
      delivered_orders,
      refunded_orders,
      revenue_sync,
      orders_sync
    }

    return res.status(201).json({
      status: 'success',
      message: 'Analytics fetched successfully',
      analytics: analytics,
      recent_customers: customers,
      chart_data: revenueData
    })
  } catch (error) {
    console.log(error)
  }
}
