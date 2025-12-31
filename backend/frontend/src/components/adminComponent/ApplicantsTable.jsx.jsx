import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components_lite/Navbar";
import axios from "axios";
import { useParams } from "react-router-dom";
import { APPLICATION_API_ENDPOINT } from "@/utils/data";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "../ui/dialog";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import {
  setApplications,
  setLoading,
  setError,
} from "@/redux/applicationSlice";

const ApplicantsTable = () => {
  // read applications array from redux store
  const {
    applications: storeApplications,
    loading: storeLoading,
    error: storeError,
  } = useSelector((store) => store.application);
  const dispatch = useDispatch();
  const { id: jobId } = useParams();

  const [job, setJob] = useState(null);
  // local UI state for job details only; use storeApplications for list
  const [loading, setLoadingLocal] = useState(true);
  const [error, setErrorLocal] = useState(null);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [openAppId, setOpenAppId] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          `${APPLICATION_API_ENDPOINT}/${jobId}/applicants`,
          { withCredentials: true }
        );
        if (res.data.success) {
          setJob(res.data.job || null);
          // populate redux store with fetched applications
          dispatch(setApplications(res.data.applications || []));
        } else {
          setErrorLocal(res.data.message || "Failed to fetch applicants");
          dispatch(setError(res.data.message || "Failed to fetch applicants"));
        }
      } catch (err) {
        console.error(err);
        setErrorLocal(
          err.response?.data?.message || err.message || "Server error"
        );
      } finally {
        setLoadingLocal(false);
        dispatch(setLoading(false));
      }
    };

    if (jobId) fetch();
  }, [jobId]);

  const filtered = useMemo(() => {
    // use applications from the store as the source of truth
    let list = Array.isArray(storeApplications) ? [...storeApplications] : [];
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((a) => {
        const name = a.applicant?.fullname || "";
        const email = a.applicant?.email || "";
        return (
          name.toLowerCase().includes(q) || email.toLowerCase().includes(q)
        );
      });
    }
    if (statusFilter !== "all") {
      list = list.filter(
        (a) =>
          String(a.status || "").toLowerCase() ===
          String(statusFilter).toLowerCase()
      );
    }
    list.sort((a, b) =>
      sort === "newest"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );
    return list;
  }, [storeApplications, query, statusFilter, sort]);

  const updateStatus = async (applicationId, newStatus) => {
    const prev = (storeApplications || []).map((a) => ({ ...a }));
    const optimistic = (storeApplications || []).map((a) =>
      a._id === applicationId ? { ...a, status: newStatus } : a
    );
    // update redux store optimistically
    dispatch(setApplications(optimistic));
    try {
      const res = await axios.post(
        `${APPLICATION_API_ENDPOINT}/status/${applicationId}/update`,
        { status: newStatus },
        { withCredentials: true }
      );
      if (!res.data.success) {
        dispatch(setApplications(prev));
        toast.error(res.data.message || "Failed to update status");
      } else {
        toast.success("Status updated");
      }
    } catch (err) {
      console.error(err);
      dispatch(setApplications(prev));
      toast.error(err.response?.data?.message || "Server error");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-6xl mx-auto p-6">Loading applicants...</div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-6xl mx-auto p-6 text-red-500">{error}</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold">{job?.title || "Job"}</h2>
            <p className="text-sm text-gray-600">
              Company: <strong>{job?.company?.name || "-"}</strong>
            </p>
            <p className="text-sm text-gray-600">
              Total applicants:{" "}
              <strong>{storeApplications?.length || 0}</strong>
            </p>
          </div>

          <div className="flex gap-3 items-center">
            <Input
              placeholder="Search by name or email"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded px-2 py-2 border"
            >
              <option value="all">All</option>
              <option value="Applied">Applied</option>
              <option value="accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded px-2 py-2 border"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>

        <div className="bg-white shadow rounded-md overflow-hidden">
          <table className="min-w-full divide-y">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Candidate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Resume
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Applied
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-sm text-gray-600">
                    No applicants found
                  </td>
                </tr>
              ) : (
                filtered.map((app) => (
                  <tr key={app._id}>
                    <td className="px-6 py-4 flex items-center gap-3">
                      <Avatar>
                        {app.applicant?.profile?.profilePhoto ? (
                          <AvatarImage
                            src={app.applicant.profile.profilePhoto}
                          />
                        ) : (
                          <AvatarFallback>
                            {(app.applicant?.fullname || "?").slice(0, 1)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {app.applicant?.fullname}
                        </div>
                        <div className="text-sm text-gray-500">
                          {app.applicant?.profile?.bio || ""}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm">
                      <div>{app.applicant?.email}</div>
                      <div className="text-xs text-gray-500">
                        {app.applicant?.phoneNumber || "-"}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm">
                      {app.applicant?.profile?.resume ? (
                        <a
                          href={app.applicant.profile.resume}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sky-600 underline"
                        >
                          View / Download
                        </a>
                      ) : (
                        <span className="text-gray-400">No resume</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      {new Date(app.createdAt).toLocaleString()}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      <Badge
                        variant={
                          String(app.status || "").toLowerCase() === "accepted"
                            ? "default"
                            : String(app.status || "").toLowerCase() ===
                              "rejected"
                            ? "destructive"
                            : "outline"
                        }
                      >
                        {String(app.status || "applied")
                          .charAt(0)
                          .toUpperCase() +
                          String(app.status || "applied").slice(1)}
                      </Badge>
                    </td>

                    <td className="px-6 py-4 text-right text-sm flex gap-2 justify-end">
                      <Dialog
                        open={openAppId === app._id}
                        onOpenChange={(open) =>
                          setOpenAppId(open ? app._id : null)
                        }
                      >
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{app.applicant?.fullname}</DialogTitle>
                            <DialogDescription>
                              {app.applicant?.email}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="mt-4">
                            <p className="text-sm text-gray-600">
                              Phone: {app.applicant?.phoneNumber || "-"}
                            </p>
                            <p className="text-sm text-gray-600 mt-2">
                              Bio: {app.applicant?.profile?.bio || "-"}
                            </p>
                            <div className="mt-3">
                              <strong className="text-sm">Skills:</strong>
                              <div className="flex gap-2 flex-wrap mt-2">
                                {(app.applicant?.profile?.skills || []).map(
                                  (s) => (
                                    <span
                                      key={s}
                                      className="text-xs bg-gray-100 px-2 py-1 rounded"
                                    >
                                      {s}
                                    </span>
                                  )
                                )}
                              </div>
                            </div>
                            <div className="mt-4">
                              {app.applicant?.profile?.resume && (
                                <a
                                  href={app.applicant.profile.resume}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-sky-600 underline"
                                >
                                  Open resume
                                </a>
                              )}
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              size="sm"
                              onClick={() =>
                                window.open(`mailto:${app.applicant?.email}`)
                              }
                            >
                              Contact
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setOpenAppId(null)}
                            >
                              Close
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <div className="flex gap-2">
                        <select
                          value={(app.status || "applied").toLowerCase()}
                          onChange={(e) =>
                            updateStatus(app._id, e.target.value.toLowerCase())
                          }
                          className="px-2 py-1 border rounded"
                        >
                          <option value="all" hidden />
                          <option value="applied">Applied</option>
                          <option value="accepted">Accepted</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ApplicantsTable;
