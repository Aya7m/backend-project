import { Router } from "express";
import { checkoutSuccess, createCheckoutSession } from "../controller/payment.controller.js";
import { protectRoute } from "../middleware/auth.midleware.js";

const paymentRoute=Router()
paymentRoute.post('/create-checkout-session',protectRoute,createCheckoutSession);
paymentRoute.post('/checkout-success',protectRoute,checkoutSuccess);


export default paymentRoute