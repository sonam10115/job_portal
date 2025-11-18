import mongoose from "mongoose";
const applicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true,
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        // include the default value 'Applied' in enum so default doesn't fail validation
        enum: ["Applied", "", "accepted", "Rejected"],
        default: "Applied",
    },
}, {
    timestamps: true,
});

export const Application = mongoose.model("Application", applicationSchema);
