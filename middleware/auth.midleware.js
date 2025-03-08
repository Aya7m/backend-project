import jwt from "jsonwebtoken";
import User from "../model/user.model.js";






export const adminRoute = (req, res, next) => {
	if (req.user && req.user.role === "admin") {
		next();
	} else {
		return res.status(403).json({ message: "Access denied - Admin only" });
	}
};

export const protectRoute = async (req, res, next) => {
	try {
		const token = req.cookies.jwt;

		if (!token) {
			return res.status(401).json({ message: "Unauthorized - No token" });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		const user = await User.findById(decoded.userId);

		if (!user) {
			return res.status(401).json({ message: "Unauthorized - User not found" });
		}

		req.user = user;
		next();
	} catch (error) {
		return res.status(401).json({ message: "Unauthorized - Invalid token" });
	}
};