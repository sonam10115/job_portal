import express from "express";
import { login, logout, register, updateProfile } from "../controllers/user_controller.js";
import authenticateToken from "../middleware/isAuthentication.js";
const router = express.Router();
import { singleUpload } from "../middleware/multer.js";

router.post("/register", singleUpload, register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/profile/update", authenticateToken, updateProfile);

export default router; 