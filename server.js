import cors from 'cors'
import express from 'express'
import bodyParser from 'body-parser'
import router from './routes/route.js'
import { setupDB } from './database/database.js'
import { errorLogger } from './middleware/errorlog.js'
import cookieParser from 'cookie-parser'
import { updateOrder } from './controller/order/order.js'
import { stripe } from './services/stripe.js'
const app = express()

const PORT = process.env.PORT || 3000

app.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature']
    let event

    try {
      // console.log('Signature:', sig)
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      )
    } catch (err) {
      console.error(`Signature Verification Failed: ${err.message}`)
      return res.status(400).send(`Webhook Error: ${err.message}`)
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object

      try {
      

        await updateOrder(session)

  
        return res.status(200).json({ received: true })
      } catch (error) {
        console.error('Order Update Failed:', error)
        return res.status(500).send('Internal Server Error')
      }
    }

    res.json({ received: true })
  }
)

app.get('/ping', (req, res) => {
  console.log('web alive')
  res.status(200).send('pong')
})

app.use(
  cors({
    origin: ['http://localhost:5173', 'https://tilios.vercel.app'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  })
)

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.status(200).json({
    msg: 'backend is working'
  })
})

setupDB()
app.use('/api', router)
app.use(errorLogger)
app.listen(PORT, () => {
  console.log('backend running on PORT ' + PORT)
})
