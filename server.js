import cors from 'cors'
import express from 'express'
import bodyParser from 'body-parser'
import router from './routes/route.js'
import { setupDB } from './database/database.js'
import { errorLogger } from './middleware/errorlog.js'
const app = express()

const PORT = 3000
app.use(bodyParser.urlencoded({ extended: false }))



app.use(
  cors({
    origin: [
      'http://localhost:5173',
    ],
    credentials: true,
    allowedHeaders: ['Content-Type'],
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  })
)
setupDB()
app.use('/api', router)
app.use(errorLogger)
app.listen(PORT, () => {
  console.log('backend running on PORT ' + PORT)
})
