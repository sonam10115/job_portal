import React from "react";
import Navbar from "./Navbar";
import Job from "./Job";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setSearchedQuery } from "@/redux/jobSlice";
import useGetAllJobs from "@/hooks/useGetAllJobs";

const Browse = () => {
  useGetAllJobs();
  const { allJobs } = useSelector((store) => store.job);
  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      dispatch(setSearchedQuery("")); // Clear the search query on unmount
    };
  }, []);
  return (
    <div>
      <Navbar></Navbar>
      <div className="max-w-7xl mx-auto my-10 px-4">
        <h1 className="font-bold text-xl my-6">Search result</h1>
        <div className="flex-1 lg:h-[88vh] overflow-y-auto pb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allJobs && allJobs.length > 0 ? (
              allJobs.map((job) => {
                return <Job key={job._id} job={job} />;
              })
            ) : (
              <div className="col-span-full p-6 text-center text-gray-600">
                No jobs found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Browse;
