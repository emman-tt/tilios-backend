import express from 'express'
const router = express.Router()
import upload from '../config/cloudinary.js'

import { uploadProduct } from '../controller/products/upload.js'
import { fetchProducts } from '../controller/products/product.js'
import { userLogin, userSignUp } from '../controller/user/auth.js'
import { adminLogin, adminSignup } from '../controller/admin/admin-auth.js'
import { GetAllProducts } from '../controller/admin/admin-products.js'
import { authenticateToken, refreshAuth } from '../middleware/auth.js'
import { adminOnly } from '../middleware/admin-only.js'
import { addProduct } from '../controller/admin/addProduct.js'
import {
  updateProduct,
  deleteProduct
} from '../controller/admin/updateProduct.js'
import {
  fetchCart,
  addCart,
  deleteCart,
  updateCart
} from '../controller/cart/cart.js'
import { silentUserAuth } from '../controller/user/silent-auth.js'
import { handlePayments } from '../controller/payment/payment.js'
import { confirmOrder, createOrder } from '../controller/order/order.js'
import { adminCheck } from '../controller/admin/admin-check.js'
import {
  confirmDeliveredStatus,
  confirmPayment,
  GetAllOrders
} from '../controller/admin/admin-orders.js'
import { getCustomers } from '../controller/admin/admin-customers.js'
import { getOverview } from '../controller/admin/admin-overview.js'
import { isMeMiddleware } from '../middleware/only-me.js'
//Stripe/Payments/Order Routes
router.post('/order/session', authenticateToken, createOrder, handlePayments)
router.get('/order/status/:sessionId', authenticateToken, confirmOrder)

//  Neutral Routes
router.post('/auth/refresh', refreshAuth)
router.get('/silent/user-auth', authenticateToken, silentUserAuth)

// Product Routes
router.get('/products', fetchProducts)

//User Auth Routes
router.post('/login', userLogin)
router.post('/register', userSignUp)

// Admin Auth Routes
router.post('/admin-login', adminLogin)
router.post('/admin-register', adminSignup)
router.get('/admin/check', authenticateToken, adminOnly, adminCheck)

//Dashboard Routes
router.get('/admin/overview', authenticateToken, adminOnly, getOverview)
router.get('/admin/products', authenticateToken, adminOnly, GetAllProducts)
router.post(
  '/admin/add-product',
  authenticateToken,
  adminOnly,
  upload.single('image'),
  isMeMiddleware,
  addProduct
)
router.put(
  '/admin/update-product/:id',
  authenticateToken,
  adminOnly,
  isMeMiddleware,
  updateProduct
)
router.delete(
  '/admin/delete-product/:id',
  authenticateToken,
  adminOnly,
  isMeMiddleware,
  deleteProduct
)
router.get('/admin/orders', authenticateToken, adminOnly, GetAllOrders)
router.put(
  '/admin/orders/:id',
  authenticateToken,
  adminOnly,
  isMeMiddleware,
  confirmDeliveredStatus
)
router.put(
  '/admin/confirm/payment/:id',
  authenticateToken,
  adminOnly,
  isMeMiddleware,
  confirmPayment
)
router.get('/admin/customers', authenticateToken, adminOnly, getCustomers)

// Cart Routes
router.get('/cart', authenticateToken, fetchCart)
router.post('/cart/:id', authenticateToken, addCart)
router.put('/cart', authenticateToken, updateCart)
router.delete('/cart/:id', authenticateToken, deleteCart)

// upload Routes
router.post('/upload', upload.single('image'), uploadProduct)

export default router
