import jwt from "jsonwebtoken";
import User from "../model/user.model.js";






export const adminRoute = (req, res, next) => {
	if (req.user && req.user.role === "admin") {
		next();
	} else {
		return res.status(403).json({ message: "Access denied - Admin only" });
	}
};

// export const protectRoute = async (req, res, next) => {
// 	try {
// 		const token = req.cookies.jwt;

// 		if (!token) {
// 			return res.status(401).json({ message: "Unauthorized - No token" });
// 		}

// 		const decoded = jwt.verify(token, process.env.JWT_SECRET);

// 		const user = await User.findById(decoded.userId);

// 		if (!user) {
// 			return res.status(401).json({ message: "Unauthorized - User not found" });
// 		}

// 		req.user = user;
// 		next();
// 	} catch (error) {
// 		return res.status(401).json({ message: "Unauthorized - Invalid token" });
// 	}
// };

export const protectRoute = async (req, res, next) => {
	try {
		const token = req.cookies.jwt;

		if (!token) {
			return res.status(401).json({ message: "Unauthorized - No token" });
		}

		// فك التوكن واستخرج البيانات
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		console.log("Decoded Token:", decoded); // ✅ اطبعي بيانات التوكن بعد فكّه

		// البحث عن المستخدم في قاعدة البيانات
		const user = await User.findById(decoded.userId);

		if (!user) {
			return res.status(401).json({ message: "Unauthorized - User not found" });
		}

		// تأكدي إن الـ role بيتسجل في req.user
		req.user = {
			id: user._id,
			name: user.name,
			email: user.email,
			role: user.role, // ← تأكدي إنه بيتسجل هنا
		};

		console.log("User from DB:", req.user); // ✅ اطبعي بيانات المستخدم بعد جلبها من الداتا بيز

		next();
	} catch (error) {
		return res.status(401).json({ message: "Unauthorized - Invalid token" });
	}
};
