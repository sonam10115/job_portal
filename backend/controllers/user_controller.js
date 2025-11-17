import { User } from "../models/user_model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import crypto from "crypto";
import { fileURLToPath } from "url";
import path from "path";
import logger from "../utils/logger.js";

// Helper: read or create a local secret file (backend/.jwt_secret).
// This avoids requiring the user to set an environment variable manually.
function getOrCreateLocalJwtSecret() {
    try {
        const secretPath = fileURLToPath(new URL('../.jwt_secret', import.meta.url));
        // If file exists and has content, use it
        if (fs.existsSync(secretPath)) {
            const data = fs.readFileSync(secretPath, 'utf8').trim();
            if (data) {
                if (!process.env.JWT_SECRET) process.env.JWT_SECRET = data;
                return data;
            }
        }

        // otherwise generate a new secret and persist it
        const newSecret = crypto.randomBytes(48).toString('hex');
        try {
            fs.writeFileSync(secretPath, newSecret, { mode: 0o600 });
        }
        catch (writeErr) {
            // non-fatal: log and continue using in-memory secret
            console.error('Warning: could not write JWT secret file', writeErr);
        }
        if (!process.env.JWT_SECRET) process.env.JWT_SECRET = newSecret;
        return newSecret;
    }
    catch (err) {
        console.error('Error while getting/creating local jwt secret:', err);
        // fallback to an in-memory random secret (will invalidate tokens on restart)
        const fallback = crypto.randomBytes(48).toString('hex');
        if (!process.env.JWT_SECRET) process.env.JWT_SECRET = fallback;
        return fallback;
    }
}

// Compute local secret once at module load
const LOCAL_JWT_SECRET = process.env.JWT_SECRET || getOrCreateLocalJwtSecret();

export const register = async (req, res) => {
    try {
        logger.info(`Request received: ${req.method} ${req.path}`);
        const { fullname, email, password, role, phoneNumber } = req.body;
        if (!fullname || !email || !password || !role) {
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
            fullname,
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
        // Handle duplicate key errors
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                message: `${field} already exists`,
                success: false,
            });
        }
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
                message: "Incorrect email",
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
        const token = jwt.sign(tokenData, LOCAL_JWT_SECRET, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
        };

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "Strict", secure: process.env.NODE_ENV === 'production' }).json({
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
        const file = req.file;



        // cloudinary upload
        let skillsArray;
        if (skills) {
            const skillsArray = skills.split(',');
        }

        const userId = req.id; // middleware sets req.id

        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        // update database profile
        if (fullname) {
            user.fullname = fullname;
        }

        if (email) {
            user.email = email;
        }
        if (phoneNumber) {
            user.phoneNumber = phoneNumber;
        }
        if (bio) {
            user.profile.bio = bio;
        }
        if (skills) {
            user.profile.skills = skillsArray;
        }

        // user.fullname = fullname;
        // user.email = email;
        // user.phoneNumber = phoneNumber;
        // user.bio = bio;
        // user.skills = skillsArray;

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
