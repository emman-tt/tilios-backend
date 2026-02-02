import { Product } from '../database/products.js'
export async function fetchProducts (req, res, next) {
  try {
    const limit = req.query.limit || 12
    const page = 1
    const categoryId = req.query.category

  

    if (categoryId == 0) {
      const items = await Product.findAll({
        limit: limit,
        offset: (page - 1) * limit
      })
      const products = items.map(i => i.dataValues)
      return res.status(200).json({
        status: 'success',
        products: products
      })
    }

    const items = await Product.findAll({
      limit: 8,
      offset: (page - 1) * limit,
      where: {
        categoryId: categoryId
      }
    })
    const products = items.map(i => i.dataValues)
    res.status(200).json({
      status: 'success',
      products: products
    })
  } catch (error) {
    next(error)
  }
}
