import { Router } from "express";
import {  changePassword, getUser, logout, signIn, signUp } from "../controller/auth.controller.js";
import { protectRoute } from "../middleware/auth.midleware.js";

const authRouter=Router()

authRouter.post('/signup', signUp)
authRouter.post('/signin', signIn)
authRouter.post('/logout', logout)
authRouter.get('/profile',protectRoute, getUser)
authRouter.post('/changePassword',protectRoute,changePassword)


export default authRouter