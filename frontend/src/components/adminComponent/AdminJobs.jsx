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
      <div className=" max-w-6xl mx-auto my-10">
        <div className="flex items-center justify-between my-5">
          <Input
            className="w-fit"
            placeholder="Filter by Name & job"
            onChange={(e) => setInput(e.target.value)}
          ></Input>
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
