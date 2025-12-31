import React from "react";
import Job from "./Job";
import { useSelector } from "react-redux";

const LatestJobs = () => {
  const { allJobs } = useSelector((store) => store.jobs);
  return (
    <div className="max-w-7xl mx-auto my-20 px-4">
      <h2 className="text-4xl font-bold">
        <span className="text-[#6A38C2]">Latest & Top </span>Job Openings
      </h2>
      <div className="flex-1 lg:h-[88vh] overflow-y-auto pb-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.isArray(allJobs) && allJobs.length > 0 ? (
            allJobs.map((job) =>
              job?._id ? (
                <Job key={job._id} job={job} />
              ) : (
                <span key={Math.random()}>Invalid Job Data</span>
              )
            )
          ) : (
            <div className="col-span-full p-6 text-center text-gray-600">
              No Job Available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LatestJobs;
