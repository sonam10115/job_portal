import { Application } from "../models/application_model.js";
import { Job } from "../models/job_model.js";
export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        // ensure user is authenticated
        if (!userId) {
            console.log("User not authenticated");
            return res.status(401).json({ message: "Authentication required", success: false });
        }
        const jobId = req.params.id;
        if (!jobId) {
            return res.status(400).json({
                message: "Job ID is required",
                success: false,
            });
        }
        // check if already applied

        const existingApplication = await Application.findOne({ job: jobId, applicant: userId, });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job",
                success: false,
            });
        }

        //check job exist
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false,
            });
        }

        // create application
        const newApplication = await Application.create({
            job: jobId,
            applicant: userId,
        });

        // job.applications in model may be a single ObjectId or null; ensure it's an array before pushing
        if (!job.applications) {
            job.applications = [];
        } else if (!Array.isArray(job.applications)) {
            job.applications = [job.applications];
        }
        job.applications.push(newApplication._id);
        await job.save();

        // Populate the applicant field before sending response
        const populatedApplication = await Application.findById(newApplication._id).populate('applicant');

        return res.status(200).json({ 
            message: "Job application successful", 
            success: true,
            application: populatedApplication 
        });
    } catch (error) {
        console.error("Error in applying for job:", error);
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const application = await Application.find({ applicant: userId })
            .sort({ createdAt: -1 })
            .populate({
                path: "job",
                options: { sort: { createdAt: -1 } },
                populate: { path: "company", options: { sort: { createdAt: -1 } } },
            });
        if (!application) {
            return res
                .status(404)
                .json({ message: "No applications found", success: false });
        }

        return res.status(200).json({ application, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;

        // verify job exists (optional)
        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ message: "Job not found", success: false });

        // fetch applications for this job directly from Application collection
        const applications = await Application.find({ job: jobId })
            .sort({ createdAt: -1 })
            .populate({ path: "applicant", select: "-password -someOtherSensitiveField" });

        return res.status(200).json({ job, applications, success: true });
    } catch (error) {
        console.error("Error in getApplicants:", error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;
        if (!status) {
            return res.status(400).json({
                message: "status is required",
                success: false,
            });
        }

        // find the application by applicantion id
        const application = await Application.findOne({ _id: applicationId });
        if (!application) {
            return res.status(404).json({
                message: "Application not found.",
                success: false,
            });
        }

        // update the status
        application.status = status.toLowerCase();
        await application.save();

        return res
            .status(200)
            .json({ message: "Application status updated", success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};


