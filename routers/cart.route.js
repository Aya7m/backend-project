import { Router } from "express";
import { protectRoute } from "../middleware/auth.midleware.js";
import { addToCart, getCartProducts, removeAllFromCart, updateQuantity } from "../controller/cart.controller.js";

const cartRouter=Router()

cartRouter.post('/',protectRoute,addToCart)
cartRouter.delete('/',protectRoute,removeAllFromCart)
cartRouter.put('/:id',protectRoute,updateQuantity)
cartRouter.get('/',protectRoute,getCartProducts)

export default cartRouter