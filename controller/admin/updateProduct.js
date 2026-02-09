import { Product } from '../../database/products.js'
export async function updateProduct (req, res, next) {
  try {
    const { id } = req.params
    const { name, price, stock, discount, image, category } = req.body

    const foundProduct = await Product.findByPk(parseInt(id))

    if (!foundProduct) {
      return res.status(450).json({
        status: 'failed',
        message: 'Product not found'
      })
    }

    await foundProduct.update(
      {
        name: name,
        amount: parseFloat(price),
        stock: parseInt(stock),
        discount: parseFloat(discount),
        image: image,
        categoryId: parseInt(category)
      },
      {
        where: {
          id: id
        }
      }
    )

    res.status(201).json({
      status: 'success',
      message: 'Product updated successfully'
    })
  } catch (error) {
    next(error)
  }
}

export async function deleteProduct (req, res, next) {
  try {
    const { id } = req.params
    const foundProduct = await Product.findByPk(parseInt(id))

    if (!foundProduct) {
      return res.status(450).json({
        status: 'failed',
        message: 'Product not found'
      })
    }

    await foundProduct.destroy()
    res.status(201).json({
      status: 'success',
      message: 'Product deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}
