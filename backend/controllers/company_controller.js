import { Company } from "../models/company_model.js";

export const registerCompany = async (req, res) => {
    try {
        // quick debug: log minimal request info (avoid sensitive data)
        console.log('registerCompany called, body keys:', Object.keys(req.body || {}), 'req.id:', req.id ? '[present]' : '[missing]');

        const { companyName, description, website, location, logo } = req.body;
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required",
                success: false,
            });
        }

        // Ensure required fields for the schema are present
        if (!description) {
            return res.status(400).json({
                message: "Description is required",
                success: false,
            });
        }

        // If this route is supposed to be authenticated, req.id must be present.
        // Currently the route is not protected, so return a clear 401 instead of letting Mongoose fail.
        // if (!req.id) {
        //     return res.status(401).json({
        //         message: "Authentication required to register a company",
        //         success: false,
        //     });
        // }

        const existingCompany = await Company.findOne({ name: companyName });
        if (existingCompany) {
            return res.status(400).json({
                message: "Company already exists",
                success: false,
            });
        }

        // Create company without attaching req.id (allow unauthenticated registration)
        const company = new Company({
            name: companyName,
            description,
            website,
            location,
            logo,
        });
        await company.save();

        return res.status(201).json({
            message: "Company registered successfully",
            company,
            success: true,
        });
    } catch (error) {
        console.error("Error in company registration:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

export const getAllCompanies = async (req, res) => {
    try {
        // Return all companies. Previously this filtered by req.id which
        // returned empty results when companies were created without userId.
        const companies = await Company.find();
        if (!companies || companies.length === 0) {
            return res.status(200).json({
                message: "No companies found",
                companies: [],
                success: true,
            });
        }
        return res.status(200).json({
            message: "Companies fetched successfully",
            companies,
            success: true,
        });
    }

    catch (error) {
        console.error("Error in fetching companies:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

//get company by id
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found"
            });
        }
        return res.status(200).json({
            message: "Company fetched successfully",
            company,
            success: true,
        });
    }
    catch (error) {
        console.error(error);
    }
};

//update company details
export const updateCompany = async (req, res) => {
    try {
        const { name, location, website, description } = req.body;
        const file = req.file;

        //cloudinary upload
        const updateData = { name, description, website, location };
        const company = await Company.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        if (!company) {
            return res.status(404).json({
                message: "Company not found",
                success: false,
            });
        }
        return res.status(200).json({ message: "Company update" });
    }
    catch (error) {
        console.error(error);
    }
};


