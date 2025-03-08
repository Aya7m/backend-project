import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import authRouter from './routers/auth.route.js'
import connectDB from './db/connectiondb.js'
import productRoute from './routers/product.route.js'
import cartRouter from './routers/cart.route.js'
import coupenRouter from './routers/coupen.routes.js'
import paymentRoute from './routers/payment.route.js'
import analysisRouter from './routers/analytics.route.js'

const app = express()

dotenv.config()
const port = process.env.PORT || 5000

app.use(express.json({limit:"50mb"}))
app.use(cookieParser())


app.use('/auth', authRouter)
app.use('/product',productRoute)
app.use('/cart',cartRouter)
app.use('/coupon',coupenRouter)
app.use('/payment',paymentRoute)
app.use('/analysis',analysisRouter)

connectDB()

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))