import React from "react";
import Navbar from "./Navbar";
import Filter from "./Filter";
import Job from "./Job";
import { useSelector } from "react-redux";

// const jobsArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const Jobs = () => {
  const { allJobs } = useSelector((store) => store.jobs);
  return (
    <div>
      <Navbar />

      <div className="max-w-7xl mx-auto mt-5">
        <div className="flex gap-5">
          <div className="w-20%">
            {/* filter Cards */}
            <Filter></Filter>
          </div>
          {/* job Cards */}
          {allJobs.length <= 0 ? (
            <span className=""> Job not found</span>
          ) : (
            <div className="flex-1 h-[88vh] overflow-y-auto pb-5">
              <div className="grid grid-cols-3 gap-4">
                {allJobs.map((job) => (
                  <div>
                    <Job key={job._id} job={job} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
