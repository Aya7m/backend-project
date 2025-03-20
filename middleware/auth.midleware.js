import jwt from "jsonwebtoken";
import User from "../model/user.model.js";






export const adminRoute = (req, res, next) => {
	try {
		if (req.user.role !== "admin") {
			return res.status(401).json({ error: "Unauthorized,You are not admin" })
		}
		next()
	} catch (error) {
		console.log(error)
	}
};

export const protectRoute = () => {
	try {

		return async (req, res, next) => {
		  const { token } = req.headers;
	
		  if (!token) {
			return res.status(401).json({ error: "Unauthorized please login" })
		  }
	
		  if (!token.startsWith("demarric")) {
			return res.status(401).json({ error: "Unauthorized,invalid token" })
	
		  }
		  const originalToken = token.split(" ")[1];
		  const decoadData = jwt.verify(originalToken, "demarric")
		  if (!decoadData.userId) {
			return res.status(401).json({ error: "Unauthorized,invalid token" })
		  }
	
		  // find userId
		  const user = await User.findById(decoadData.userId).select("-password")
	
	
		  if (!user) {
			return res.status(401).json({ error: "please sign up first and try again" })
	
		  }
	
	
	
		  req.authuser = user
		  next()
	
		}
	} catch (error) {
		console.log(error)
	}
};


