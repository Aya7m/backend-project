import { generateTokenAndSetCookie } from "../lib/utilites/generiteToken.js";
import User from "../model/user.model.js";
import bcrypt from "bcryptjs"

export const signUp = async (req, res) => {

    const { name, email, password } = req.body

    if (!name || !email || !password) {
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
    if (emailExist) {
        return res.status(400).json({ error: 'Email already exist' });
    }

    // check password length
    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }


    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // create user
    const NewUser = await User.create({
        
        name,
        email,
        password: hashPassword,
    });

    if (NewUser) {
        generateTokenAndSetCookie(NewUser._id, res)
        await NewUser.save()
        return res.status(201).json({
            _id: NewUser._id,
            name: NewUser.name,
            email: NewUser.email,
            role: NewUser.role
        });
    }
    else {
        return res.status(400).json({ error: 'User not created' });
    }




}

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

    // create token
    generateTokenAndSetCookie(emailExist._id, res)

    return res.status(200).json({
        _id: emailExist._id,
        name: emailExist.name,
        email: emailExist.email,
        role: emailExist.role
    });


}


export const logout = async (req, res) => {
    res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "strict" });
    res.status(200).json({ message: "Logout successfully" });
}


export const getProfile = async (req, res) => {
	try {
		res.json(req.user);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
