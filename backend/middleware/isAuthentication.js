import jwt from "jsonwebtoken";
import fs from "fs";
import crypto from "crypto";
import { fileURLToPath } from "url";

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

const authenticateToken = async (req, res, next) => {
    try {
        console.log('Auth middleware: Checking token for', req.path);
        const token = req.cookies.token;
        console.log('Token present:', !!token);
        if (!token) {
            console.log('No token provided');
            return res.status(401).json({
                message: "No token provided",
                success: false,
            });
        }
        const decoded = await jwt.verify(token, LOCAL_JWT_SECRET);
        console.log('Token decoded:', decoded);

        if (!decoded) {
            console.log('Token verification failed');
            return res.status(401).json({
                message: "Invalid token",
                success: false,
            });
        }
        req.id = decoded.userId;
        console.log('User ID set:', req.id);
        next();
    }
    catch (error) {
        console.log('Token verification error:', error.message);
        return res.status(401).json({
            message: "Invalid token",
            success: false,
        });
    }
};
export default authenticateToken;
