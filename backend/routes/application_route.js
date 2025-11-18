import express from "express";
import authenticateToken from "../middleware/isAuthentication.js";
import { getApplicants, getAppliedJobs, applyJob, updateStatus } from "../controllers/application_controller.js";


const router = express.Router();

router.get("/apply/:id", authenticateToken, applyJob);
router.get("/get", authenticateToken, getAppliedJobs);
router.get("/:id/applicants", authenticateToken, getApplicants);
router.post("/status/:id/update", authenticateToken, updateStatus);

export default router; 