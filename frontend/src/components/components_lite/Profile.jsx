import React from "react";
import Navbar from "./Navbar";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Pen, Mail, Contact } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import AppliedJobs from "./AppliedJobs";
import { useState } from "react";
import EditProfileModal from "./EditProfileModal";
import { useSelector } from "react-redux";
import Footer from "./Footer";
import useGetAllAppliedJobs from "@/hooks/useGetAllAppliedJobs";

const isResume = true;

const Profile = () => {
  useGetAllAppliedJobs();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-6 sm:p-8 shadow shadow-gray-400 hover:shadow-yellow-400 transition-shadow duration-300">
        <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <Avatar className="cursor-pointer h-20 w-20 sm:h-24 sm:w-24 hover:scale-105 transition-transform duration-200">
              <AvatarImage src={user?.profile?.profilePhoto} />
            </Avatar>
            <div>
              <h1 className="text-lg font-semibold">{user?.fullname}</h1>
              <p className="text-sm text-gray-600 mt-1">{user?.profile?.bio}</p>
            </div>
          </div>
          <div className="self-end">
            <Button
              onClick={() => setOpen(true)}
              className="text-right"
              variant="outline"
            >
              <Pen />
            </Button>
          </div>
        </div>
        <div className="my-5">
          <div className=" flex items-center gap-3 my-2">
            <Mail></Mail>
            <span className="">
              <a href={`mailto:${user?.email}`}>{user?.email}</a>
            </span>
          </div>
          <div className=" flex items-center gap-3 my-2">
            <Contact></Contact>
            <span className="">{user?.phoneNumber}</span>
          </div>
        </div>

        <div className="my-5">
          <h1>skills</h1>
          <div className="flex flex-wrap items-center gap-2">
            {Array.isArray(user?.profile?.skills) &&
            user.profile.skills.length > 0 ? (
              user.profile.skills.map((item, index) => (
                <Badge
                  key={`${item}-${index}`}
                  className={
                    "bg-blue-950 text-white font-bold hover:bg-blue-800 transition-colors duration-200 cursor-pointer"
                  }
                  variant={"ghost"}
                >
                  {item}
                </Badge>
              ))
            ) : (
              <span>NA</span>
            )}
          </div>
        </div>

        <div className="">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <label htmlFor="" className="text-md font-bold">
              upload Resume
            </label>
            <div className="">
              {isResume ? (
                <Button className="bg-[#00D3F3] text-white" variant={"outline"}>
                  <a
                    target="_blank"
                    href={user?.profile?.resume ? user?.profile?.resume : "#"}
                    download="resume.pdf"
                  >
                    {user?.profile?.resumeOriginalname}
                  </a>{" "}
                </Button>
              ) : (
                <span> No resume found</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-2xl ">
        <h1 className="text-lg my-5 fonrt-bold">Applied Jobs</h1>
        <AppliedJobs></AppliedJobs>
      </div>

      {/* {edit profile} */}
      <EditProfileModal open={open} setOpen={setOpen} />
      <Footer />
    </div>
  );
};

export default Profile;
