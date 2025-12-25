import React from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { JOB_API_ENDPOINT } from "@/utils/data";
import { setSingleJob } from "@/redux/jobSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { APPLICATION_API_ENDPOINT } from "@/utils/data";
import { toast } from "sonner";

const Description = () => {
  const params = useParams();
  const jobId = params.id;
  console.log("job id", jobId);
  const dispatch = useDispatch();

  const { singleJob } = useSelector((store) => store.jobs);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useSelector((store) => store.auth);

  // initialize isApplied from any existing singleJob data to avoid UI flash
  const [isApplied, setIsApplied] = useState(() => {
    try {
      const apps = singleJob?.applications;
      return !!apps?.some(
        (application) =>
          application.applicant?._id === user?._id ||
          application.applicant === user?._id
      );
    } catch (err) {
      return false;
    }
  });
  const [applying, setApplying] = useState(false);

  // Log whenever isApplied changes
  useEffect(() => {
    console.log("isApplied state changed to:", isApplied);
  }, [isApplied]);

  // Sync isApplied whenever singleJob or user changes
  useEffect(() => {
    if (singleJob && user?._id) {
      const hasApplied = singleJob.applications?.some(
        (application) =>
          application.applicant?._id === user?._id ||
          application.applicant === user?._id
      );
      setIsApplied(!!hasApplied);
      console.log(
        "Synced isApplied from singleJob:",
        !!hasApplied,
        "singleJob.applications:",
        singleJob.applications
      );
    }
  }, [singleJob, user?._id]);

  useEffect(() => {
    const fetchSingleJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${JOB_API_ENDPOINT}/get/${jobId}`, {
          withCredentials: true,
        });
        console.log("API Response:", res.data);
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          // Check if current user has already applied
          const hasApplied = res.data.job.applications?.some(
            (application) =>
              application.applicant?._id === user?._id ||
              application.applicant === user?._id
          );
          setIsApplied(!!hasApplied);
          console.log(
            "User already applied:",
            !!hasApplied,
            "Applications:",
            res.data.job.applications
          );
        } else {
          setError("Failed to fetch jobs.");
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        setError(error.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchSingleJobs();
  }, [jobId, dispatch, user?._id]);
  if (loading) {
    // simple skeleton to improve perceived performance
    return (
      <div className="max-w-7xl mx-auto my-10">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-6" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-40 bg-gray-200 rounded" />
            <div className="h-40 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  const applyJobHandler = async () => {
    // optimistic update to improve UX
    if (isApplied || applying) return;
    setApplying(true);
    setIsApplied(true);
    const tempApp = {
      _id: `temp-${Date.now()}`,
      applicant: { _id: user?._id },
    };
    const optimisticJob = {
      ...singleJob,
      applications: [...(singleJob?.applications || []), tempApp],
    };
    dispatch(setSingleJob(optimisticJob));

    try {
      const res = await axios.get(
        `${APPLICATION_API_ENDPOINT}/apply/${jobId}`,
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const newApplication = res.data.application || { applicant: user?._id };
        // replace tempApp with real application if provided
        const updatedApplications = (optimisticJob.applications || []).map(
          (a) =>
            a._id && String(a._id).startsWith("temp-") ? newApplication : a
        );
        const updateSingleJob = {
          ...optimisticJob,
          applications: updatedApplications,
        };
        dispatch(setSingleJob(updateSingleJob));
        toast.success("Job applied successfully!");
        console.log(
          "Apply Job Response:",
          res.data.message,
          "New Application:",
          newApplication
        );
      } else {
        // revert optimistic update
        setIsApplied(false);
        const reverted = { ...singleJob };
        dispatch(setSingleJob(reverted));
        toast.error(res.data.message || "Failed to apply for job");
      }
    } catch (error) {
      console.error("Apply Job Error:", error.response?.data || error.message);
      // revert optimistic update
      setIsApplied(false);
      dispatch(setSingleJob(singleJob));
      toast.error("Failed to apply for job");
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto my-10 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Left: Job details */}
          <div className="md:col-span-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {singleJob?.title}
            </h1>

            <div className="mt-4 flex flex-wrap gap-2 items-center">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-sm font-semibold text-blue-700">
                {singleJob?.position}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-sm font-semibold text-orange-600">
                {singleJob?.salary} LPA
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-sm font-semibold text-purple-700">
                {singleJob?.jobType}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-sm font-semibold text-gray-800">
                {singleJob?.location}
              </span>
            </div>

            <div className="mt-6 text-gray-700 space-y-4">
              <div>
                <h2 className="text-lg font-medium text-gray-800">Role</h2>
                <p className="mt-1 text-base">{singleJob?.role}</p>
              </div>

              <div>
                <h2 className="text-lg font-medium text-gray-800">
                  Description
                </h2>
                <p className="mt-1 text-base whitespace-pre-line">
                  {singleJob?.description}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-800">
                  Experience
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  {singleJob?.experienceLevel} years
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-800">Posted On</h3>
                <p className="mt-1 text-sm text-gray-600">
                  {singleJob?.createdAt?.split("T")[0] || "Date not available"}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Company card & Apply */}
          <aside className="md:col-span-1">
            <div className="p-4 bg-gray-50 rounded-lg sticky top-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-xl text-gray-600">
                  {singleJob?.company?.name?.charAt(0) || "C"}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    {singleJob?.company?.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {singleJob?.company?.industry || "Company"}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="text-sm text-gray-600">Location</div>
                <div className="text-sm font-medium text-gray-800">
                  {singleJob?.location}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600">Applicants</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {singleJob?.applications?.length || 0}
                  </div>
                </div>
                <div>
                  <button
                    key={isApplied ? "applied" : "not-applied"}
                    onClick={
                      isApplied || applying ? undefined : applyJobHandler
                    }
                    disabled={isApplied || applying}
                    className={`rounded-lg px-5 py-2 font-semibold transition inline-flex items-center justify-center gap-2 ${
                      isApplied
                        ? "bg-gray-500 text-white cursor-not-allowed opacity-75"
                        : "bg-[#6B3AC2] text-white hover:bg-[#552d9b]"
                    }`}
                  >
                    {applying && (
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                    )}
                    {isApplied
                      ? "Already Applied"
                      : applying
                      ? "Applying..."
                      : "Apply Now"}
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Description;
