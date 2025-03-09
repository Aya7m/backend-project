import { Router } from "express";
import { createProduct, deleteProduct, getAllProducts, getFlashOverProducts, getisFreeShippingProduct, getNewProducts, getProductByName, getProductsByCategory, getRecommendedProducts } from "../controller/product.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.midleware.js";

const productRoute=Router()

productRoute.get('/get',protectRoute,adminRoute, getAllProducts)
productRoute.get('/getNew', getNewProducts)
productRoute.get('/getFreeShipping', getisFreeShippingProduct)
productRoute.get('/getFlashOver', getFlashOverProducts)

productRoute.post('/create',protectRoute,adminRoute, createProduct)
productRoute.delete('/delete/:id',protectRoute,adminRoute, deleteProduct)
productRoute.get('/recomend',getRecommendedProducts)

productRoute.get("/category/:category", getProductsByCategory)
productRoute.get("/name/:name", getProductByName)

export default productRoute