import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
// import { Bookmark, Bookmarked } from "lucide-react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { useNavigate } from "react-router-dom";

const Job = ({ job }) => {
  const navigate = useNavigate();
  const daysAgo = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentDate = new Date();
    const timeDiff = currentDate.getTime() - createdAt.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    return daysDiff;
  };
  const [isSaved, setIsSaved] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`savedJob_${job?._id}`) === "true";
      setIsSaved(saved);
    } catch (e) {
      // ignore localStorage errors in SSR or incognito
    }
  }, [job?._id]);

  const toggleSave = (e) => {
    e.stopPropagation();
    const next = !isSaved;
    setIsSaved(next);
    try {
      localStorage.setItem(`savedJob_${job?._id}`, next ? "true" : "false");
    } catch (e) {}
  };
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/description/${job?._id}`)}
      className="p-4 md:p-5 rounded-lg md:rounded-md shadow-md md:shadow-xl bg-white border border-gray-200 cursor-pointer transform transition-all duration-200 ease-in-out hover:shadow-lg hover:scale-[1.01]"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {daysAgo(job?.createdAt) === 0
            ? "Today"
            : daysAgo(job?.createdAt) === 1
            ? "1 day ago"
            : `${daysAgo(job?.createdAt)} days ago`}{" "}
        </p>
        <div className="flex items-center gap-2">
          {/* <Button
            size="icon"
            variant="ghost"
            className="rounded-full p-2 hover:bg-slate-100"
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard?.writeText(
                window.location.href + `description/${job?._id}`
              );
            }}
            title="Copy link"
          >
            {/* simple share icon */}
          {/* <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 8a3 3 0 10-2.83-4h-.34A3 3 0 109 8m6 8a3 3 0 10-2.83 4h-.34A3 3 0 109 16"
              />
            </svg>
          </Button> */}
          <Button
            size="icon"
            variant="outline"
            className={`rounded-full p-2 ${
              isSaved ? "bg-blue-50 border-blue-200" : ""
            }`}
            onClick={toggleSave}
            aria-pressed={isSaved}
            title={isSaved ? "Saved" : "Save for later"}
          >
            {isSaved ? (
              <svg
                className="w-4 h-4 text-blue-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4 text-gray-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 3v16l7-5 7 5V3z"
                />
              </svg>
            )}
          </Button>
        </div>
      </div>
      <div className="flex gap-3 my-3 md:my-4 sm:items-start items-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/company/${job?.company?._id}`);
          }}
          className="p-2 rounded-md bg-gray-50 border border-gray-100 hover:shadow-sm hover:scale-105 transform transition-all"
          title={`View ${job?.company?.name}`}
        >
          <Avatar>
            <AvatarImage src={job?.company?.logo} />
          </Avatar>
        </button>
        <div className="">
          <div>
            <h1 className="text-lg font-medium">{job?.company?.name}</h1>
            <p className="text-sm text-gray-600">India</p>
          </div>
          <div>
            <h2 className="font-bold text-lg my-2">{job?.title}</h2>
            <p className="text-sm text-gray-600">
              {showFullDescription || (job?.description || "").length <= 180
                ? job?.description
                : `${job?.description?.slice(0, 180)}...`}
            </p>
            {(job?.description || "").length > 180 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFullDescription(!showFullDescription);
                }}
                className="text-sm text-blue-700 underline mt-1"
                aria-expanded={showFullDescription}
              >
                {showFullDescription ? "Show less" : "Read more"}
              </button>
            )}
          </div>
          <div className=" flex gap-2 items-center mt-4 "></div>
          <div className="mt-3 flex flex-wrap gap-2 items-center">
            {job?.position && (
              <Badge className="text-blue-600 font-semibold" variant="subtle">
                {job?.position}
              </Badge>
            )}
            {job?.salary && (
              <Badge className="text-amber-600 font-semibold" variant="subtle">
                {job?.salary}
              </Badge>
            )}
            {job?.jobType && (
              <Badge className="text-green-600 font-semibold" variant="subtle">
                {job?.jobType}
              </Badge>
            )}
            {job?.location && (
              <Badge className="text-indigo-600 font-semibold" variant="subtle">
                {job?.location}
              </Badge>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-4">
        <Button
          variant="default"
          className="bg-blue-950 font-bold rounded-full text-white px-4 py-2"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/description/${job?._id}`);
          }}
        >
          Details
        </Button>
        <Button
          variant="outline"
          className={`rounded-full px-4 py-2 ${
            isSaved ? "bg-blue-50 text-blue-700" : ""
          }`}
          onClick={toggleSave}
        >
          {isSaved ? "Saved" : "Save For Later"}
        </Button>
        {/* <div className="ml-auto text-sm text-gray-500 hidden sm:block">
          Click card for quick view
        </div> */}
      </div>
    </div>
  );
};

export default Job;
