import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2, MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";

const AdminJobsTable = () => {
  const { companies } = useSelector((store) => store.company);

  const { allAdminJobs, searchJobByText } = useSelector((store) => store.job);

  const navigate = useNavigate();
  const [filterJobs, setFilterJobs] = useState(allAdminJobs);

  useEffect(() => {
    const filteredJobs =
      Array.isArray(allAdminJobs) &&
      allAdminJobs.filter((job) => {
        if (!searchJobByText) return true;
        const q = searchJobByText.toLowerCase();
        const titleMatch = job.title?.toLowerCase().includes(q);
        const companyMatch = job.company?.name?.toLowerCase().includes(q);
        return titleMatch || companyMatch;
      });
    setFilterJobs(filteredJobs);
  }, [allAdminJobs, searchJobByText]);

  console.log("COMPANIES", companies);
  console.log("ALL ADMIN JOBS", allAdminJobs);
  if (!companies) {
    return <div>Loading...</div>;
  }

  return (
    <div className="px-4">
      <div className="overflow-x-auto w-full">
        <Table>
          <TableCaption>Your recent Posted Jobs</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Company Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {!filterJobs || filterJobs.length === 0 ? (
              <span>No jobs found</span>
            ) : (
              filterJobs?.map((job) => (
                <TableRow key={job._id}>
                  <TableCell>{job?.company?.name}</TableCell>
                  <TableCell>{job.title}</TableCell>
                  <TableCell>{job.createdAt.split("T")[0]}</TableCell>
                  <TableCell className="text-right cursor-pointer">
                    <Popover>
                      <PopoverTrigger>
                        <MoreHorizontal />
                      </PopoverTrigger>
                      <PopoverContent className="w-40 flex flex-col gap-1 p-2">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/admin/companies/${job._id}`)
                          }
                          className="flex items-center gap-2 w-full px-2 py-1 rounded hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-sky-300 text-left"
                          aria-label={`Edit job ${job.title}`}
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/admin/jobs/${job._id}/applicants`)
                          }
                          className="flex items-center gap-2 w-full px-2 py-1 rounded hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-sky-300 text-left"
                          aria-label={`View applicants for ${job.title}`}
                          title="Applicants"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Applicants</span>
                        </button>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminJobsTable;
