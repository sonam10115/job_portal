import React from "react";
import Navbar from "@/components/components_lite/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { USER_API_ENDPOINT } from "@/utils/data";
import { useNavigate } from "react-router-dom";

function Register() {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    password: "",
    role: "",
    phoneNumber: "",
    file: "",
  });

  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };
  const changeFileHandler = (e) => {
    setInput({
      ...input,
      file: e.target.files?.[0],
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("password", input.password);
    formData.append("role", input.role);
    formData.append("phoneNumber", input.phoneNumber);
    if (input.file) {
      formData.append("file", input.file);
    }
    
    // Log what we're sending
    console.log("Form submission data:");
    console.log("- fullname:", input.fullname);
    console.log("- email:", input.email);
    console.log("- password:", input.password ? "***" : "MISSING");
    console.log("- role:", input.role);
    console.log("- phoneNumber:", input.phoneNumber);
    console.log("- file:", input.file ? input.file.name : "none");
    
    try {
      const res = await axios.post(`${USER_API_ENDPOINT}/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        navigate("/login");
        toast.success("Registration successful! " + res.data.message);
      }
    } catch (error) {
      console.error("Registration error:", error);

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.code === "ERR_NETWORK") {
        toast.error(
          "Network Error: Backend server is not running. Please start the backend server on port 8001"
        );
        console.error("Backend is not accessible at", USER_API_ENDPOINT);
      } else if (error.message === "Network Error") {
        toast.error(
          "Cannot connect to server. Make sure backend is running on http://localhost:8001"
        );
      } else {
        toast.error("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="">
      <Navbar />

      <div className="flex items-center justify-center px-6 py-12 bg-linear-to-br from-slate-900 via-indigo-900 to-black text-slate-100 min-h-screen">
        <div className="relative w-full max-w-xl bg-linear-to-br from-slate-900 via-indigo-900 to-black text-slate-100">
          <div className="absolute -left-16 -top-16 w-40 h-40 rounded-full bg-linear-to-tr from-pink-500 to-yellow-400 opacity-20 blur-3xl pointer-events-none"></div>
          <div className="absolute -right-12 -bottom-12 w-56 h-56 rounded-full bg-linear-to-br from-cyan-400 to-blue-600 opacity-12 blur-3xl pointer-events-none"></div>

          <form
            onSubmit={submitHandler}
            className="relative bg-white/6 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl"
          >
            <div className="text-center mb-6">
              <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-indigo-300 to-pink-400">
                Create Account
              </h1>
              <p className="mt-2 text-sm text-slate-300">
                Join us — set up your account
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label>Name</Label>
                <Input
                  className="mt-2"
                  value={input.fullname}
                  name="fullname"
                  onChange={changeEventHandler}
                  type="text"
                  placeholder="john doe"
                />
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  className="mt-2"
                  value={input.email}
                  name="email"
                  onChange={changeEventHandler}
                  type="text"
                  placeholder="johndoe@example.com"
                />
              </div>

              <div>
                <Label>Password</Label>
                <Input
                  className="mt-2"
                  type="password"
                  value={input.password}
                  name="password"
                  onChange={changeEventHandler}
                  placeholder="********"
                />
              </div>

              <div>
                <Label>Phone Number</Label>
                <Input
                  className="mt-2"
                  type="tel"
                  value={input.phoneNumber}
                  name="phoneNumber"
                  onChange={changeEventHandler}
                  placeholder="123-456-7890"
                />
              </div>

              <div>
                <RadioGroup className="flex flex-wrap gap-4 items-center mt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-300">Role</span>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="role"
                        value="Student"
                        checked={input.role === "Student"}
                        onChange={changeEventHandler}
                        className="accent-indigo-400"
                      />
                      <Label htmlFor="r1">Student</Label>
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="role"
                        checked={input.role === "Recruiter"}
                        onChange={changeEventHandler}
                        value="Recruiter"
                        className="accent-indigo-400"
                      />
                      <Label htmlFor="r2">Recruiter</Label>
                    </label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center gap-2">
                <Label>Profile Photo</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={changeFileHandler}
                  className="cursor-pointer mt-2"
                />
              </div>

              <button
                type="submit"
                className="mt-2 w-full py-3 rounded-xl text-white font-semibold bg-linear-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600"
              >
                Register
              </button>

              <p className="text-center mt-3 text-sm text-slate-300">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-indigo-300 hover:underline font-semibold"
                >
                  Login here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
