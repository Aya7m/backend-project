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
import cors from 'cors'






const app = express()


// السماح فقط للفرونت المحلي والمستضاف على Vercel
const allowedOrigins = ["http://localhost:5173", "https://yourfrontend.vercel.app"];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization"
}));


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
app.options('*', cors()); // السماح لجميع طلبات OPTIONS


connectDB()

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))