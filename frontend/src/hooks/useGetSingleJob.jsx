import React from "react";
import { useEffect } from "react";
import axios from "axios";
import { JOB_API_ENDPOINT } from "@/utils/data";
import { useDispatch } from "react-redux";
import { setAllJobs } from "@/redux/jobSlice";

function useGetSingleJobs() {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchSingleJobs = async () => {
      try {
        const res = await axios.get(`${JOB_API_ENDPOINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setAllJobs(res.data.jobs));
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchSingleJobs();
  }, [dispatch]);
}

export default useGetSingleJobs;
