import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { useSelector } from "react-redux";

const AppliedJobs = () => {
  const allAppliedJobs = useSelector((store) => store.job.allAppliedJobs);
  return (
    <div className="px-4">
      <div className="overflow-x-auto w-full">
        <Table>
          <TableCaption>Recent Applied Jobs</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Job Title</TableHead>
              <TableHead>Company</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!Array.isArray(allAppliedJobs) || allAppliedJobs.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-sm text-gray-600">
                  You have not applied any job yet.
                </td>
              </tr>
            ) : (
              allAppliedJobs.map((appliedJob) => (
                <TableRow key={appliedJob._id}>
                  <TableCell>
                    {appliedJob.createdAt
                      ? new Date(appliedJob.createdAt).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell>{appliedJob.job?.title || "-"}</TableCell>
                  <TableCell>{appliedJob.job?.company?.name || "-"} </TableCell>
                  <TableCell className="text-right">
                    {" "}
                    <Badge
                      className={`${
                        appliedJob?.status === "rejected"
                          ? "bg-red-700"
                          : appliedJob?.status === "accepted"
                          ? "bg-green-400"
                          : "bg-gray-500"
                      }`}
                    >
                      {appliedJob?.status}
                    </Badge>
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

export default AppliedJobs;
