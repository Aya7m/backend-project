import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign(
        { userId }, // هنا استخدمنا user._id بدل userId
        process.env.JWT_SECRET,
        { expiresIn: "15d" }
    );



};
