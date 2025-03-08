import { Router } from "express";
import { getCoupon, validateCoupon} from "../controller/coupen.controller.js";
import { protectRoute } from "../middleware/auth.midleware.js";

const coupenRouter=Router()

coupenRouter.get('/',protectRoute,getCoupon)
coupenRouter.post('/validate',protectRoute,validateCoupon)

export default coupenRouter