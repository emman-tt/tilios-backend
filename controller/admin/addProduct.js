import { Product } from '../../database/products.js'
import { Sales } from '../../database/sales.js'
import { User } from '../../database/user.js'



export async function addProduct (req, res, next) {
  try {


    const { title, stock, price, category, discount } = req.body

    if (!req.file) {
      return res.status(400).json({ error: 'Image upload failed' })
    }

    const imagePath = req.file.path
    const newProduct = await Product.create(
      {
        name: title,
        stock: parseInt(stock),
        amount: parseFloat(price),
        categoryId: parseInt(category),
        discount: parseFloat(discount),
        image: imagePath,
        saleProducts: {
          sold_units: 0
        }
      },
      {
        include: [
          {
            as: 'saleProducts',
            model: Sales
          }
        ]
      }
    )

    res.status(201).json({
      status: 'success',
      message: 'Product added successfully'
    })
  } catch (error) {
    next(error)
  }
}
