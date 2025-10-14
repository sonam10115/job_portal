import { User } from "../models/user_model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { name, email, password, role, phoneNumber } = req.body;
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                message: "All fields are required",
                success: false,
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists",
                success: false,
            });
        }

        //convert password to hashed password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            fullname: name,
            email,
            phoneNumber: phoneNumber || '',
            password: hashedPassword,
            role,
        });
        await user.save();

        const publicUser = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
        };

        return res.status(201).json({
            message: 'User registered successfully',
            user: publicUser,
            success: true,
        });
    }
    catch (error) {
        console.error("Error in user registration:", error);
        return res.status(500).json({
            message: "registration error",
            success: false,
        });
    }
};
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "All fields are required",
                success: false,
            });
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "Incorrect email or password",
                success: false,
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(404).json({
                message: "Incorrect email or password",
                success: false,
            });
        }

        //check role
        if (user.role !== role) {
            return res.status(403).json({
                message: "Please login from the correct portal",
                success: false,
            });
        }

        // generate token 
        const tokenData = {
            userId: user._id,
        };
        const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
        };

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production' }).json({
            message: `Welcome back, ${user.fullname} `,
            user,
            success: true,
        });
    }
    catch (error) {
        console.error("Error in user login:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully",
            success: true,
        });
    }
    catch (error) {
        console.error("Error in user logout:", error);
        return res.status(500).json({
            message: " server error logout",
            success: false,
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;

        if (!fullname || !email || !phoneNumber || !bio || !skills) {
            return res.status(400).json({
                message: "All fields are required",
                success: false,
            });
        }

        // cloudinary upload

        const skillsArray = skills.split(',');
        const userId = req.id; // middleware sets req.id

        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        user.fullname = fullname;
        user.email = email;
        user.phoneNumber = phoneNumber;
        user.bio = bio;
        user.skills = skillsArray;

        //resume file

        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
        };


        return res.status(200).json({
            message: "Profile updated successfully",
            user,
            success: true,
        });
    }
    catch (error) {
        console.error("Error in updating profile:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};
