import React from "react";
import { Badge } from "../ui/badge";

const JobCards = ({ job }) => {
  return (
    <div className="p-5 rounded-md shadow-xl bg-white border border-gray-200 cursor-pointer hover:shadow-2xl hover:shadow-gray-200 hover:p-3">
      <div>
        <h1 className="text-lg font-medium">{job.company?.name}</h1>
        <p className="text-sm text-gray-600">India</p>
      </div>
      <div>
        <h2 className="font-bold text-lg my-2">{job.title}</h2>
        <p className="text-sm text-gray-600">{job.description}</p>
      </div>
      <div className=" flex gap-2 items-center mt-4 "></div>
      <Badge className={" text-blue-600 font-bold"} variant={"ghost"}>
        {job.positions}
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
  );
};

export default JobCards;
