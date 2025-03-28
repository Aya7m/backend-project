import { Router } from "express";
import { protectRoute } from "../middleware/auth.midleware.js";
import { addToCart, createOrder, getAllOrders, getCartProducts, removeAllFromCart, updateQuantity } from "../controller/cart.controller.js";

const cartRouter=Router()

cartRouter.post('/',protectRoute,addToCart)
cartRouter.delete('/',protectRoute,removeAllFromCart)
cartRouter.put('/:id',protectRoute,updateQuantity)
cartRouter.get('/',protectRoute,getCartProducts)
cartRouter.get('/order',protectRoute,getAllOrders)
cartRouter.post('/order',protectRoute,createOrder)

export default cartRouter