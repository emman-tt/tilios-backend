import { Product } from '../../database/products.js'
import { User } from '../../database/user.js'
import { Cart } from '../../database/cart.js'
import { CartProduct } from '../../database/cartProduct.js'
export async function fetchCart (req, res, next) {
  try {
    const decoded = req.user
    const userId = decoded.sub
    let cart
    const user = await User.findByPk(userId)
    cart = await user.getCart()

    if (!cart) {
      cart = await user.createCart()
      return res.status(201).json({
        status: 'success',
        message: 'No product found in cart',
        products: []
      })
    }

    const item = await cart.getProducts()
    const products = item[0].dataValues
    return res.status(201).json({
      status: 'success',
      message: 'Cart fetched successfully',
      products: [products]
    })
  } catch (error) {
    next(error)
  }
}
export async function addCart (req, res, next) {
  try {
    const { id } = req.params
    const { quantity } = req.body
    const decoded = req.user
    const userId = decoded.sub

    const foundProduct = await Product.findByPk(id)
    if (!foundProduct) {
      return res.status(203).json({
        status: 'failed',
        message: 'Product not found'
      })
    }

    const product = await foundProduct.toJSON()
    const amount = product.amount
    const stock = product.stock
    const discount = product.discount
    let cart
    const user = await User.findByPk(userId)
    cart = await user.getCart()

    if (!cart) {
      cart = await user.createCart()
    }

    const discountValue = (discount / 100) * amount
    const priceAtSale = amount - discountValue
    console.log(priceAtSale)

    await cart.addProduct(foundProduct, {
      through: {
        quantity: quantity,
        priceAtSale: priceAtSale
      }
    })
    res.status(201).json({
      status: 'success',
      message: 'Product added to cart successfully'
    })
  } catch (error) {
    next(error)
  }
}

export async function deleteCart (req, res, next) {
  try {
  } catch (error) {
    next(error)
  }
}
export async function updateCart (req, res, next) {
  try {
  } catch (error) {
    next(error)
  }
}
