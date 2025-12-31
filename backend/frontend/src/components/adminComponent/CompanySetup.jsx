import React, { useEffect, useState } from "react";
import Navbar from "../components_lite/Navbar.jsx";
import { Button } from "../ui/button.jsx";
import { ArrowLeft, Loader2, X } from "lucide-react";
import { Label } from "../ui/label.jsx";
import { Input } from "../ui/input.jsx";
import axios from "axios";
import { COMPANY_API_ENDPOINT } from "../../utils/data.js";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import useGetCompanyById from "@/hooks/useGetCompanyById.jsx";

// Optional: Cloudinary config from Vite env vars
const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
const CLOUD_UPLOAD_PRESET = import.meta.env.VITE_CLOUD_UPLOAD_PRESET;

const CompanySetup = () => {
  const params = useParams();
  useGetCompanyById(params.id);

  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    file: null,
  });
  const { singleCompany } = useSelector((store) => store.company);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // If a new file is selected and Cloudinary preset is available, upload directly
      let logoUrl = null;
      if (input.file && CLOUD_NAME && CLOUD_UPLOAD_PRESET) {
        try {
          setUploading(true);
          const cloudUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;
          const fd = new FormData();
          fd.append("file", input.file);
          fd.append("upload_preset", CLOUD_UPLOAD_PRESET);

          const uploadRes = await axios.post(cloudUrl, fd, {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (evt) => {
              if (evt.total)
                setUploadProgress(Math.round((evt.loaded * 100) / evt.total));
            },
          });
          logoUrl = uploadRes?.data?.secure_url;
        } catch (uploadErr) {
          console.warn(
            "Direct upload failed, will fallback to server upload",
            uploadErr
          );
        } finally {
          setUploading(false);
          setUploadProgress(0);
        }
      }

      // Build formData. If logoUrl was uploaded client-side, send it as a field to prevent re-upload.
      const formData = new FormData();
      formData.append("name", input.name);
      formData.append("description", input.description);
      formData.append("website", input.website);
      formData.append("location", input.location);
      if (logoUrl) {
        // Tell backend the logo was already uploaded; it will skip re-upload
        formData.append("logoUrl", logoUrl);
      } else if (input.file) {
        // Fallback: send file for server-side upload
        formData.append("file", input.file);
      }

      const res = await axios.put(
        `${COMPANY_API_ENDPOINT}/update/${params.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.status === 200 && res.data.success) {
        toast.success(res.data.message || "Company updated successfully");
        navigate("/admin/companies");
      } else {
        throw new Error("Unexpected API response.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setInput({
      name: singleCompany.name || "",
      description: singleCompany.description || "",
      website: singleCompany.website || "",
      location: singleCompany.location || "",
      file: singleCompany.file || null,
    });
  }, [singleCompany]);

  return (
    <div>
      <Navbar />
      <div className="max-w-xl mx-auto my-10">
        <form onSubmit={submitHandler}>
          <div className="flex items-center gap-5 p-8">
            <Button
              onClick={() => navigate("/admin/companies")}
              variant="outline"
              className="flex items-center gap-2 text-gray-500 font-semibold"
            >
              <ArrowLeft />
              <span>Back</span>
            </Button>
            <h1 className="font-bold text-xl">Company Setup</h1>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Company Name</Label>
              <Input
                type="text"
                name="name"
                value={input.name}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                type="text"
                name="description"
                value={input.description}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>Website</Label>
              <Input
                type="text"
                name="website"
                value={input.website}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                type="text"
                name="location"
                value={input.location}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>Logo</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={changeFileHandler}
              />
              {input.file && (
                <p className="text-sm text-slate-500 mt-1">
                  Selected: {input.file.name}
                </p>
              )}
            </div>
          </div>

          {uploading && (
            <div className="w-full my-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-slate-600">
                  Uploading logo: {uploadProgress}%
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setUploading(false);
                    setUploadProgress(0);
                    setInput({ ...input, file: null });
                  }}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Skip
                </button>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded">
                <div
                  className="h-2 bg-blue-500 rounded"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {loading ? (
            <Button className="w-full my-4 bg-black text-white cursor-not-allowed">
              {" "}
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...{" "}
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full my-4 bg-black text-white hover:bg-gray-800"
            >
              Update
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default CompanySetup;
