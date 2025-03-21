import jwt from "jsonwebtoken";
import User from "../model/user.model.js";
import bcrypt from "bcryptjs"

export const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }


        // التحقق من صحة البريد الإلكتروني
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        // التحقق من وجود الإيميل مسبقًا
        const emailExist = await User.findOne({ email });
        if (emailExist) {
            return res.status(400).json({ error: "Email already exists" });
        }

        // التحقق من طول كلمة المرور
        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        // تشفير كلمة المرور
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        // انشاء المستخدم
        const user = await User.create({
            name,
            email,
            password: hashPassword,
        });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "15d" });


        return res.status(200).json({ success: true, data: user, token, message: "User created successfully" });
    } catch (error) {
        console.log("Error in signUp controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


export const signIn = async (req, res) => {

    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        })
    }

    //    check email rejex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    // check email exist
    const emailExist = await User.findOne({ email })
    if (!emailExist) {
        return res.status(400).json({ error: 'Email not exist' });
    }

    // check password
    const isMatch = await bcrypt.compare(password, emailExist.password)
    if (!isMatch) {
        return res.status(400).json({ error: 'Password not match' });
    }

    const token = jwt.sign({ userId: emailExist._id }, process.env.JWT_SECRET, { expiresIn: "15d" });

    res.status(200).json({ success: true,  data: emailExist, token })

}


export const logout = async (req, res) => {
    try {
        const { _id } = req.user;
        await User.findByIdAndUpdate({ _id }, { token: "" });
        res.json({ message: "Logout successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}


export const getUser = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);


       
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
