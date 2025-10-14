import express from "express";
import { login, register, updateProfile } from "../controllers/user_controller.js";
import authenticateToken from "../middleware/isAuthentication.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/profile/update", authenticateToken, updateProfile);

export default router; 