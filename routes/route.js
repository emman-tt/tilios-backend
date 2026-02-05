import express from 'express'
const router = express.Router()
import upload from '../config/cloudinary.js'
import {
  fetchCart,
  updateCart,
  deleteCart,
  addCart
} from '../controller/cart.js'
import { uploadProduct } from '../controller/upload.js'
import { fetchProducts } from '../controller/product.js'
import { userLogin, userSignUp } from '../controller/auth.js'
import { adminLogin, adminSignup } from '../controller/admin/admin-auth.js'
// Product Routes
router.get('/products', fetchProducts)

//User Auth Routes
router.post('/login', userLogin)
router.post('/register', userSignUp)

// Admin Auth Routes
router.post('/admin-login', adminLogin)
router.post('/admin-register', adminSignup)

// Cart Routes
router.get('/cart', fetchCart)
router.post('/cart', addCart)
router.put('/cart', updateCart)
router.delete('/cart', deleteCart)

// upload Routes
router.post('/upload', upload.single('image'), uploadProduct)

export default router
