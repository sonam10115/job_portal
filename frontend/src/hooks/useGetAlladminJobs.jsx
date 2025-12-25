import React from "react";
import { useEffect } from "react";
import axios from "axios";
import { JOB_API_ENDPOINT } from "@/utils/data";
import { useDispatch } from "react-redux";
import { setAllAdminJobs } from "@/redux/jobSlice";

function useGetAlladminJobs() {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllAdminJobs = async () => {
      try {
        const res = await axios.get(`${JOB_API_ENDPOINT}/getadminjobs`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setAllAdminJobs(res.data.jobs));
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchAllAdminJobs();
  }, [dispatch]);
}

export default useGetAlladminJobs;
