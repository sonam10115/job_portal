import React from "react";
import Navbar from "../components_lite/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import AdminJobsTable from "./AdminJobsTable";
import useGetAlladminJobs from "@/hooks/useGetAlladminJobs";
import { useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { setSearchJobByText } from "@/redux/jobSlice";

const AdminJobs = () => {
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input]);
  // fetch admin jobs on mount
  useGetAlladminJobs();
  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto my-10 px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 my-5">
          <Input
            className="w-full sm:w-72"
            placeholder="Filter by Name & job"
            onChange={(e) => setInput(e.target.value)}
          />
          <Button onClick={() => navigate("/admin/jobs/create")}>
            Post New Job
          </Button>
        </div>
        <div>
          <AdminJobsTable />
        </div>
      </div>
    </div>
  );
};

export default AdminJobs;
