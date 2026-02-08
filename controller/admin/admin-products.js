import { Product } from '../../database/products.js'
import { User } from '../../database/user.js'
import { Sales } from '../../database/sales.js'
export async function GetAllProducts (req, res, next) {
  try {
    const decoded = req.user
    const userId = decoded.sub
    const page = parseInt(req.query.page) || 1
    const limit = 10
    const offset = (page - 1) * limit

    const userCheck = User.findOne({
      where: {
        id: userId,
        role: 'admin'
      }
    })

    if (!userCheck) {
      return res.status(401).json({
        status: 'failed',
        message: 'Unauthorized admin'
      })
    }

    const { count, rows } = await Product.findAndCountAll({
      limit,
      offset,
      include: {
        model: Sales,
        as: 'saleProducts',
        attributes: ['sold_units']
      }
    })

    if (!rows || rows.length === 0) {
      return res.status(203).json({
        status: 'success',
        message: 'No product found',
        products: []
      })
    }

    return res.status(201).json({
      status: 'success',
      products: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      message: 'products fetched successfully'
    })
  } catch (error) {
    next(error)
  }
}
