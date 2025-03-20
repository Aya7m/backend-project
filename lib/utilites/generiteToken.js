import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (user, res) => {
    const token = jwt.sign(
        { userId: user._id, role: user.role }, // هنا استخدمنا user._id بدل userId
        process.env.JWT_SECRET, 
        { expiresIn: "15d" } 
    );

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 يوم
    });
};
