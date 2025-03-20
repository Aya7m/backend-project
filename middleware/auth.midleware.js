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




export const protectRoute = async (req, res, next) => {
	try {
		const { token } = req.headers;
        console.log("🔑 Token received:", token);

        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No token" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("📜 Decoded token:", decoded);

        const user = await User.findById(decoded.userId).select("-password");
        console.log("👤 User found:", user);

        if (!user) {
            return res.status(401).json({ message: "Unauthorized - User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }
}
