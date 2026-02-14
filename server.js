import cors from 'cors'
import express from 'express'
import bodyParser from 'body-parser'
import router from './routes/route.js'
import { setupDB } from './database/database.js'
import { errorLogger } from './middleware/errorlog.js'
import cookieParser from 'cookie-parser'

const app = express()

const PORT = process.env.PORT || 3000

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
app.use(bodyParser.urlencoded({ extended: false }))

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
