import { sequelize } from '../../config/sql.js'
import { Order } from '../../database/orders.js'
import { Transaction } from '../../database/transactions.js'
import { User } from '../../database/user.js'
export async function getCustomers (req, res, next) {
  try {
    // const page = parseInt(req.query.page) || 1
    // const limit = parseInt(req.query.limit) || 10
    // const offset = (page - 1) * limit
    // const { filter } = req.query
    // // console.log(filter)
    const whereClause = {}

    const { count, rows } = await User.findAndCountAll({
      attributes: {
        include: [
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM "orders" WHERE "orders"."userId" = "user"."id")`
            ),
            'totalOrders'
          ]
        ],
        exclude: ['password', 'role']
      }
    })

    if (!rows || rows.length === 0) {
      return res.status(203).json({
        status: 'success',
        message: 'No customers found',
        customers: []
      })
    }

    return res.status(201).json({
      status: 'success',
      customers: rows,
      totalCustomers: count,
      //   totalPages: Math.ceil(count / limit),
      //   currentPage: page,
      message: 'Customers fetched successfully'
    })
  } catch (error) {
    next(error)
  }
}
