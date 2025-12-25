import express from "express";
import authenticateToken from "../middleware/isAuthentication.js";
import { registerCompany, getAllCompanies, getCompanyById, updateCompany } from "../controllers/company_controller.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

router.post("/register", registerCompany);
router.get("/get/:id", authenticateToken, getCompanyById);
router.get("/get", authenticateToken, getAllCompanies);
router.put("/update/:id", authenticateToken, singleUpload, updateCompany);

export default router; 