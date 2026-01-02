import React from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useEffect } from "react";
import { APPLICATION_API_ENDPOINT } from "@/utils/data";
import { setAllAppliedJobs } from "@/redux/jobSlice";

const useGetAllAppliedJobs = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const res = await axios.get(`${APPLICATION_API_ENDPOINT}/get/`, {
          withCredentials: true,
        });
        console.log("Fetched applied jobs:", res.data);
        if (res.data.success) {
          dispatch(setAllAppliedJobs(res.data.application));
        }
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
      }
    };

    fetchAppliedJobs();
  }, [dispatch]);
  return <div></div>;
};

export default useGetAllAppliedJobs;
