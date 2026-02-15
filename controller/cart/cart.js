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
    const orderTotal = await calculateOrderTotal(cartId)

    return res.status(201).json({
      status: 'success',
      message: 'Cart fetched successfully',
      products: products,
      cartTotal: cartTotal,
      orderTotal: orderTotal
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

    const total = quantity * priceAtSale

    await cart.addProduct(foundProduct, {
      through: {
        quantity: quantity,
        priceAtSale: priceAtSale,
        total: total
      }
    })

    const cartId = cart.id

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
    const { id } = req.params

    const productId = parseInt(id)
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
        productId: productId
      }
    })
    await item.destroy()
    const orderTotal = await calculateOrderTotal(cart.id)

    res.status(201).json({
      status: 'success',
      message: 'Product deleted succefully',
      orderTotal: orderTotal
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

    const cartProduct = await CartProduct.findOne({
      where: {
        productId: productId
      }
    })

    if (!cartProduct) {
      return res.status(404).json({
        status: 'failed',
        message: 'Item not found in cart'
      })
    }
    const priceAtSale = cartProduct.dataValues.priceAtSale

    if (type === 'increase') {
      const [affectedCount] = await CartProduct.increment('quantity', {
        by: 1,
        where: {
          cartId: cart.id,
          productId: productId
        }
      })

      const newQuantity = affectedCount[0][0].quantity

      const newTotal = priceAtSale * newQuantity

      await CartProduct.update(
        {
          total: newTotal.toFixed(2)
        },
        {
          where: {
            cartId: cart.id,
            productId: productId
          }
        }
      )
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

      const newQuantity = affectedCount[0][0].quantity

      const newTotal = priceAtSale * newQuantity

      await CartProduct.update(
        {
          total: newTotal.toFixed(2)
        },
        {
          where: {
            cartId: cart.id,
            productId: productId
          }
        }
      )
    }

    const orderTotal = await calculateOrderTotal(cart.id)
    return res.status(201).json({
      status: 'success',
      message: 'Product updated successfully',
      orderTotal: orderTotal
    })
  } catch (error) {
    next(error)
  }
}

async function calculateOrderTotal (Id) {
  const orderTotal = await CartProduct.sum('total', {
    where: {
      cartId: Id
    }
  })

  return (orderTotal + 0.0).toFixed(2)
}

async function countCartTotal (Id) {
  const total = await CartProduct.sum('quantity', {
    where: {
      cartId: Id
    }
  })
  if (!total) {
    return 0
  }

  return total.toFixed(2)
}
