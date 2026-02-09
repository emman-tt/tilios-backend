import { Product } from '../../database/products.js'
import { Sales } from '../../database/sales.js'
import { Op } from 'sequelize'
export async function GetAllProducts (req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const offset = (page - 1) * limit
    const categoryId = parseInt(req.query.category)

    const whereClause = {}

    if (categoryId !== 0) {
      whereClause.categoryId = categoryId
    }

    const { count, rows } = await Product.findAndCountAll({
      limit,
      offset,
      include: {
        model: Sales,
        as: 'saleProducts',
        attributes: ['sold_units']
      },
      where: whereClause
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
