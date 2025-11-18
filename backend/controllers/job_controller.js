//admin job posting
//ine 
import { Job } from "../models/job_model.js";
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, jobType, position, location, salary, experience, companyId } = req.body;
        const userId = req.id;

        // require authenticated user and company id
        if (!userId) {
            return res.status(401).json({ message: "Authentication required", status: false });
        }

        if (!title || !description || !requirements || !jobType || !position || location == null || !salary || !experience || !companyId) {
            return res.status(400).json({
                message: "All fields are required: title, description, requirements, jobType, position, location, salary, experience, companyId",
                status: false,
            });
        }

        // normalize fields to match model expectations
        const normalizedRequirements = Array.isArray(requirements) ? requirements.join(',') : String(requirements);
        const normalizedSalary = String(salary);


        const job = await Job.create({
            title,
            description,
            requirements: normalizedRequirements,
            salary: normalizedSalary,
            jobType,
            position,
            location,
            experience,
            created_by: userId,
            company: companyId,
        });
        return res.status(201).json({
            message: "Job posted successfully",
            job,
            status: true,
        });


    } catch (error) {
        console.error("Error in posting job:", error);
        return res.status(500).json({
            message: "Internal server error",
            status: false,
        });
    }
};

export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
                // { requirements: { $regex: keyword, $options: "i" } },
                // { jobType: { $regex: keyword, $options: "i" } },
                // { position: { $regex: keyword, $options: "i" } },
                // { experience: { $regex: keyword, $options: "i" } },
            ],
        };
        const jobs = await Job.find(query).populate({ path: "company", }).sort({ createdAt: -1 });
        if (!jobs) {
            return res.status(404).json({
                message: "No jobs found",
                status: false,
            });
        }
        return res.status(200).json({
            message: "Jobs retrieved successfully",
            jobs,
            status: true,
        });
    } catch (error) {
        console.error("Error in fetching jobs:", error);
        return res.status(500).json({
            message: "Internal server error",
            status: false,
        });
    }
};

//users

export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                status: false,
            });
        }
        return res.status(200).json({
            message: "Job fetched successfully",
            job,
            status: true,
        });
    } catch (error) {
        console.error("Error in fetching job by ID:", error);
        return res.status(500).json({
            message: "Internal server error",
            status: false,
        });
    }
};
//admin job created
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId });
        if (!jobs) {
            return res.status(404).json({
                message: "No jobs found for this admin",
                status: false,
            });
        }
        return res.status(200).json({
            message: "Admin jobs fetched successfully",
            jobs,
            status: true,
        });
    } catch (error) {
        console.error("Error in fetching admin jobs:", error);
        return res.status(500).json({
            message: "Internal server error",
            status: false,
        });
    }
};