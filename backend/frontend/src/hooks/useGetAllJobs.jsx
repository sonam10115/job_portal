import React from "react";
import { useEffect } from "react";
import axios from "axios";
import { JOB_API_ENDPOINT } from "@/utils/data";
import { useDispatch } from "react-redux";
import { setAllJobs } from "@/redux/jobSlice";
import { useSelector } from "react-redux";

const useGetAllJobs = () => {
  const { searchedQuery } = useSelector((store) => store.job);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        const res = await axios.get(
          `${JOB_API_ENDPOINT}/get?keyword=${searchedQuery}`,
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          dispatch(setAllJobs(res.data.jobs));
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchAllJobs();
  }, [dispatch]);
};

export default useGetAllJobs;
