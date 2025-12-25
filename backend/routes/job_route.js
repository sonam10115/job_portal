import express from "express";

import authenticateToken from "../middleware/isAuthentication.js";
import { postJob, getAdminJobs, getAllJobs, getJobById } from "../controllers/job_controller.js";
const router = express.Router();
router.post("/post", authenticateToken, postJob);
router.get("/get", getAllJobs);
router.get("/getadminjobs", authenticateToken, getAdminJobs);
router.get("/get/:id", authenticateToken, getJobById);

export default router; 