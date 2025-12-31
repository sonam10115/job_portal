//admin job posting
//ine 
import { Job } from "../models/job_model.js";
import { Application } from "../models/application_model.js";
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, jobType, position, location, salary, experience, companyId } = req.body;
        const userId = req.id;

        // require authenticated user and company id
        if (!userId) {
            return res.status(401).json({ message: "Authentication required", success: false });
        }

        if (!title || !description || !requirements || !jobType || !position || location == null || !salary || !experience || !companyId) {
            return res.status(400).json({
                message: "All fields are required: title, description, requirements, jobType, position, location, salary, experience, companyId",
                success: false,
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
            success: true,
        });


    } catch (error) {
        console.error("Error in posting job:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
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
                { requirements: { $regex: keyword, $options: "i" } },
                { jobType: { $regex: keyword, $options: "i" } },
                { position: { $regex: keyword, $options: "i" } },
                { experience: { $regex: keyword, $options: "i" } },
            ],
        };
        const jobs = await Job.find(query).populate({ path: "company", }).sort({ createdAt: -1 });
        if (!jobs) {
            return res.status(404).json({
                message: "No jobs found",
                success: false,
            });
        }
        return res.status(200).json({
            message: "Jobs retrieved successfully",
            jobs,
            success: true,
        });
    } catch (error) {
        console.error("Error in fetching jobs:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

//users

export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        console.log("Fetching job with ID:", jobId);
        // Try to populate applications from the job document
        let job = await Job.findById(jobId).populate({
            path: "applications",
            populate: {
                path: "applicant"
            }
        });

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false,
            });
        }

        // If the job document doesn't have applications linked (older data),
        // fetch Application documents directly as a fallback.
        if (!job.applications || job.applications.length === 0) {
            try {
                const fallbackApps = await Application.find({ job: jobId }).populate('applicant');
                if (fallbackApps && fallbackApps.length > 0) {
                    // Attach the fetched applications to the job object for response
                    job = job.toObject();
                    job.applications = fallbackApps;
                }
            } catch (innerErr) {
                console.error('Error fetching applications fallback:', innerErr);
            }
        }

        console.log("Job raw applications array:", job.applications);
        console.log("Job applications count:", job.applications?.length || 0);

        return res.status(200).json({
            message: "Job fetched successfully",
            job,
            success: true,
        });
    } catch (error) {
        console.error("Error in fetching job by ID:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};
//admin job created
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate({
            path: "company",
            sort: { createdAt: -1 },
        });
        if (!jobs) {
            return res.status(404).json({
                message: "No jobs found for this admin",
                success: false,
            });
        }
        return res.status(200).json({
            message: "Admin jobs fetched successfully",
            jobs,
            success: true,
        });
    } catch (error) {
        console.error("Error in fetching admin jobs:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};