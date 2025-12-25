import React from "react";
import Navbar from "./Navbar";
import Header from "./Header";
import Categories from "./Categories";
import LatestJobs from "./LatestJobs";
import Footer from "./Footer";
import useGetAllJobs from "@/hooks/useGetAllJobs";

const Home = () => {
  useGetAllJobs();
  return (
    <div>
      <Navbar></Navbar>
      <Header></Header>
      <Categories></Categories>
      <LatestJobs></LatestJobs>
      <Footer></Footer>
    </div>
  );
};

export default Home;
