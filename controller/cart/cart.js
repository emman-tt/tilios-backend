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
        products: [],
        cartTotal: 0
      })
    }

    const cartId = cart.id
    const cartTotal = await countCartTotal(cartId)

    const item = await cart.getProducts()
    const products = item.map(item => item.dataValues)
    // console.log(products)
    return res.status(201).json({
      status: 'success',
      message: 'Cart fetched successfully',
      products: products,
      cartTotal: cartTotal
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
    const priceAtSale = (amount - discountValue).toFixed(2)
    // console.log(priceAtSale)

    await cart.addProduct(foundProduct, {
      through: {
        quantity: quantity,
        priceAtSale: priceAtSale
      }
    })

    const cartId = cart.id
    // console.log(cartId)

    const cartTotal = await countCartTotal(cartId)

    res.status(201).json({
      status: 'success',
      message: 'Product added to cart successfully',
      cartTotal: cartTotal
    })
  } catch (error) {
    next(error)
  }
}

export async function deleteCart (req, res, next) {
  try {
    const { productId } = req.body

    const decoded = req.user
    const userId = decoded.sub
    const cart = await Cart.findOne({
      where: {
        userId: userId
      }
    })

    const item = await CartProduct.findOne({
      where: {
        cartId: cart.id,
        productId: parseInt(productId)
      }
    })
    await item.destroy()

    res.status(201).json({
      status: 'success',
      message: 'Product deleted succefully'
    })
  } catch (error) {
    next(error)
  }
}
export async function updateCart (req, res, next) {
  try {
    const { type, productId } = req.body
    const decoded = req.user
    const userId = decoded.sub
    const user = await User.findByPk(userId)
    const cart = await user.getCart()
    const product = await Product.findByPk(Number(productId))

    const item = await cart.getProducts({
      where: {
        id: product.id
      }
    })

    if (type === 'increase') {
      const [affectedCount] = await CartProduct.increment('quantity', {
        by: 1,
        where: {
          cartId: cart.id,
          productId: productId
        }
      })

      if (affectedCount === 0) {
        return res.status(404).json({ message: 'Item not found in cart' })
      }
    }

    if (type === 'decrease') {
      const item = await CartProduct.findOne({
        where: {
          cartId: cart.id,
          productId: productId
        }
      })

      if (item.dataValues.quantity <= 1) {
        return item.destroy()
      }

      const [affectedCount] = await CartProduct.decrement('quantity', {
        by: 1,
        where: {
          cartId: cart.id,
          productId: productId
        }
      })

      if (affectedCount === 0) {
        return res.status(404).json({ message: 'Item not found in cart' })
      }
    }

    return res.status(201).json({
      status: 'success',
      message: 'Working'
    })
  } catch (error) {
    next(error)
  }
}

async function countCartTotal (Id) {
  const total = await CartProduct.sum('quantity', {
    where: {
      cartId: Id
    }
  })

  return total
}
