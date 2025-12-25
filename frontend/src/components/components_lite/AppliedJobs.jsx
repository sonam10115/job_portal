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
// import { useSelector } from "react-redux";

const AppliedJobs = () => {
  const allAppliedJobs = [1, 2, 3, 4, 5, 6, 7];
  return (
    <div>
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
          {allAppliedJobs.length <= 0 ? (
            <span>You have not applied any job yet. </span>
          ) : (
            allAppliedJobs.map((appliedJob) => (
              <TableRow key={appliedJob}>
                <TableCell>29/12/25</TableCell>
                <TableCell>software engineer</TableCell>
                <TableCell>Microsoft</TableCell>
                <TableCell className="text-right">
                  {" "}
                  <Badge
                    className={" bg-blue-950 text-white font-bold"}
                    variant={"ghost"}
                  >
                    selected
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppliedJobs;
