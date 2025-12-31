import React from "react";
import { Badge } from "../ui/badge";
import { useNavigate } from "react-router-dom";

const JobCards = ({ job }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/description/${job._id}`)}
      className="p-4 sm:p-5 rounded-md shadow-sm sm:shadow-xl bg-white border border-gray-200 cursor-pointer transform transition-transform duration-200 hover:shadow-2xl hover:-translate-y-0.5"
    >
      <div>
        <h1 className="text-lg font-medium">{job.company?.name}</h1>
        <p className="text-sm text-gray-600">India</p>
      </div>
      <div>
        <h2 className="font-bold text-lg my-2">{job.title}</h2>
        <p className="text-sm text-gray-600 max-h-[4.5rem] overflow-hidden">
          {job.description}
        </p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 items-center">
        <Badge className={" text-blue-600 font-bold"} variant={"ghost"}>
          {job.position}
        </Badge>
        <Badge className={" text-[#FA4F09] font-bold"} variant={"ghost"}>
          {job.salary}
        </Badge>
        <Badge className={" text-[#FA4F09] font-bold"} variant={"ghost"}>
          {job.jobType}
        </Badge>
        <Badge className={" text-[#FA4F09] font-bold"} variant={"ghost"}>
          {job.location}
        </Badge>
      </div>
    </div>
  );
};

export default JobCards;
