import express from 'express'
const router = express.Router()
import upload from '../config/cloudinary.js'
import {
  fetchCart,
  updateCart,
  deleteCart,
  addCart
} from '../controller/cart/cart.js'
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
// Refresh Routes
router.post('/auth/refresh', refreshAuth)

// Product Routes
router.get('/products', fetchProducts)

//User Auth Routes
router.post('/login', userLogin)
router.post('/register', userSignUp)

// Admin Auth Routes
router.post('/admin-login', adminLogin)
router.post('/admin-register', adminSignup)




//Dashboard Routes
router.get('/admin/products', authenticateToken, adminOnly, GetAllProducts)
router.post('/admin/add-product', authenticateToken, adminOnly, addProduct)
router.put(
  '/admin/update-product/:id',
  authenticateToken,
  adminOnly,
  updateProduct
)
router.delete(
  '/admin/delete-product/:id',
  authenticateToken,
  adminOnly,
  deleteProduct
)



// Cart Routes
router.get('/cart', fetchCart)
router.post('/cart', addCart)
router.put('/cart', updateCart)
router.delete('/cart', deleteCart)

// upload Routes
router.post('/upload', upload.single('image'), uploadProduct)

export default router
