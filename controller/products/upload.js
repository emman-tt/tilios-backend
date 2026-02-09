import { Product } from "../../database/products.js"
export async function uploadProduct (req, res, next) {
  try {
    if (!req.file) {
      const error = new Error('Image wasnt uploaded')
      error.statusCode = 400
      throw error
    }

    const { name, amount, categoryId } = req.body
    if (!name || !amount  || !categoryId) {
      const error = new Error('Either name or amount, category  is empty')
      throw error
    }

    const image = req.file.path

    const item = await Product.create({
      name: name,
      amount: amount,
      image: image,
      categoryId: categoryId
    })
    return res.status(201).json({
      success: true,
      message: 'Saved successfully',
      url: image,
      product: item
    })
  } catch (error) {
    next(error)
  }
}
