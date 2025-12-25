import React from "react";
import { Button } from "../ui/button";
// import { Bookmark, Bookmarked } from "lucide-react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { useNavigate } from "react-router-dom";

const Job = ({ job }) => {
  const navigate = useNavigate();
  const daysAgo = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentDate = new Date();
    const timeDiff = currentDate.getTime() - createdAt.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    return daysDiff;
  };

  // const [isBookmarked, setIsBookmarked] = React.useState(false);
  return (
    <div className="p-5 rounded-md shadow-xl bg-white border border-gray-400 cursor-pointer hover:shadow-2xl hover:shadow-gray-200 hover:p-3">
      <div className=" flex items-center justify-between ">
        <p className="text-sm text-gray-600">
          {daysAgo(job?.createdAt) === 0
            ? "Today"
            : `${daysAgo(job?.createdAt)} days ago`}{" "}
        </p>
        <Button variant="outline" className=" rounded-full " size="icon">
          {/* <Bookmark /> */}
        </Button>
      </div>
      <div className="flex  gap-2 my-2 ">
        <Button
          className="p-6 border-0 bg-gray-200"
          variant="outline"
          size="icon"
        >
          <Avatar>
            <AvatarImage src="../../aiphoto.jpg"></AvatarImage>
          </Avatar>
        </Button>
        <div className="">
          <div>
            <h1 className="text-lg font-medium">{job?.company?.name}</h1>
            <p className="text-sm text-gray-600">India</p>
          </div>
          <div>
            <h2 className="font-bold text-lg my-2">{job?.title}</h2>
            <p ClassName="text-sm text-gray-600">{job?.description}</p>
          </div>
          <div className=" flex gap-2 items-center mt-4 "></div>
          <Badge className={" text-blue-600 font-bold"} variant={"ghost"}>
            {job?.position}
          </Badge>
          <Badge className={" text-[#FA4F09] font-bold"} variant={"ghost"}>
            {job?.salary}
          </Badge>
          <Badge className={" text-[#FA4F09] font-bold"} variant={"ghost"}>
            {job?.jobType}
          </Badge>
          <Badge className={" text-[#FA4F09] font-bold"} variant={"ghost"}>
            {job?.location}
          </Badge>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          className="bg-blue-950 font-bold rounded-full text-white"
          onClick={() => navigate(`/description/${job?._id}`)}
        >
          {/* {isBookmarked ? <Bookmarked /> : <Bookmark />} */}
          {""}
          Details
        </Button>
        <Button
          variant="outline"
          className="bg-blue-950 font-bold rounded-full text-white"
        >
          {""}
          Save For Later
        </Button>
      </div>
    </div>
  );
};

export default Job;
