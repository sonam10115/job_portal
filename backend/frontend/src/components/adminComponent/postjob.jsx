import React, { useState, useEffect } from "react";
import Navbar from "../components_lite/Navbar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import axios from "axios";
import { JOB_API_ENDPOINT } from "@/utils/data";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const PostJob = () => {
  const navigate = useNavigate();
  const { companies } = useSelector((store) => store.company);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    jobType: "Full-time",
    position: "Mid-level",
    requirements: "",
    experience: "0",
    companyId: "",
  });

  // Update companyId when companies are fetched
  useEffect(() => {
    if (companies && companies.length > 0 && !input.companyId) {
      setInput((prev) => ({ ...prev, companyId: companies[0]._id }));
    }
  }, [companies]);

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !input.title ||
      !input.description ||
      !input.location ||
      !input.salary ||
      !input.requirements ||
      !input.companyId
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${JOB_API_ENDPOINT}/post`, input, {
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message || "Job posted successfully");
        setInput({
          title: "",
          description: "",
          location: "",
          salary: "",
          jobType: "Full-time",
          position: "Mid-level",
          requirements: "",
          experience: "0",
          companyId: companies?.[0]?._id || "",
        });
        navigate("/admin/jobs");
      } else {
        toast.error(res.data.message || "Failed to post job");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Error posting job"
      );
      console.error("Error posting job:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">
            Post a New Job
          </h1>

          <form onSubmit={submitHandler} className="space-y-6">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Job Title <span className="text-red-500">*</span>
              </label>
              <Input
                id="title"
                type="text"
                name="title"
                value={input.title}
                placeholder="e.g., Senior React Developer"
                onChange={changeEventHandler}
                className="w-full"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Job Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={input.description}
                placeholder="Describe the job responsibilities..."
                onChange={changeEventHandler}
                rows="4"
                className="w-full border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Requirements */}
            <div>
              <label
                htmlFor="requirements"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Requirements <span className="text-red-500">*</span>
              </label>
              <textarea
                id="requirements"
                name="requirements"
                value={input.requirements}
                placeholder="e.g., React, Node.js, MongoDB (comma-separated)"
                onChange={changeEventHandler}
                rows="3"
                className="w-full border-2 border-gray-300 rounded-md p-3 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-2 gap-4">
              {/* Location */}
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Location <span className="text-red-500">*</span>
                </label>
                <Input
                  id="location"
                  type="text"
                  name="location"
                  value={input.location}
                  placeholder="e.g., New York, Remote"
                  onChange={changeEventHandler}
                  className="w-full"
                />
              </div>

              {/* Salary */}
              <div>
                <label
                  htmlFor="salary"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Salary <span className="text-red-500">*</span>
                </label>
                <Input
                  id="salary"
                  type="text"
                  name="salary"
                  value={input.salary}
                  placeholder="e.g., 60000 - 80000"
                  onChange={changeEventHandler}
                  className="w-full"
                />
              </div>

              {/* Job Type */}
              <div>
                <label
                  htmlFor="jobType"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Job Type
                </label>
                <select
                  id="jobType"
                  name="jobType"
                  value={input.jobType}
                  onChange={changeEventHandler}
                  className="w-full border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              {/* Position Level */}
              <div>
                <label
                  htmlFor="position"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Position Level
                </label>
                <select
                  id="position"
                  name="position"
                  value={input.position}
                  onChange={changeEventHandler}
                  className="w-full border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
                >
                  <option value="Entry-level">Entry-level</option>
                  <option value="Mid-level">Mid-level</option>
                  <option value="Senior">Senior</option>
                  <option value="Lead">Lead</option>
                </select>
              </div>

              {/* Experience */}
              <div>
                <label
                  htmlFor="experience"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Years of Experience
                </label>
                <Input
                  id="experience"
                  type="number"
                  name="experience"
                  value={input.experience}
                  min="0"
                  onChange={changeEventHandler}
                  className="w-full"
                />
              </div>

              {/* Company */}
              <div>
                <label
                  htmlFor="companyId"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Company <span className="text-red-500">*</span>
                </label>
                <select
                  id="companyId"
                  name="companyId"
                  value={input.companyId}
                  onChange={changeEventHandler}
                  className="w-full border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Company</option>
                  {companies && companies.length > 0 ? (
                    companies.map((company) => (
                      <option key={company._id} value={company._id}>
                        {company.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>No companies available</option>
                  )}
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-200 disabled:opacity-50"
              >
                {loading ? "Posting..." : "Post Job"}
              </Button>
              <Button
                type="button"
                onClick={() => navigate("/admin/jobs")}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded-md transition duration-200"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
