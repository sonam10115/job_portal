import React from "react";
import Navbar from "@/components/components_lite/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { USER_API_ENDPOINT } from "@/utils/data";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";

const Login = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    password: "",
    role: "",
  });

  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((store) => store.auth);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      dispatch(setLoading(true));

      const res = await axios.post(`${USER_API_ENDPOINT}/login`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (res?.data?.success) {
        dispatch(setUser(res.data.user));
        navigate("/Home");
        toast.success(res.data.message || "Login successful");
      }
    } catch (error) {
      console.log(error);
      const message =
        error?.response?.data?.message || error?.message || "Login failed";
      toast.error(message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="">
      {/* <div className="min-h-screen  bg-linear-to-br from-slate-900 via-indigo-900 to-black text-slate-100"> */}
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
                Welcome Back
              </h1>
              <p className="mt-2 text-sm text-slate-300">
                Sign in to continue to your account
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label>Name</Label>
                <Input
                  className="mt-2"
                  type="text"
                  value={input.fullname}
                  name="fullname"
                  onChange={changeEventHandler}
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
                  value={input.password}
                  name="password"
                  onChange={changeEventHandler}
                  type="password"
                  placeholder="********"
                />
              </div>

              <div>
                <RadioGroup className="flex flex-wrap gap-4 items-center mt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-300">Role</span>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={input.role === "Student"}
                        onChange={changeEventHandler}
                        name="role"
                        value="Student"
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

              {loading ? (
                <div className="flex items-center justify-center my-10">
                  <div className="spinner-border text-blue-600" role="status">
                    <span className="sr-only">Loading....</span>
                  </div>
                </div>
              ) : (
                <button className="mt-2 w-full py-3 rounded-xl text-white font-semibold bg-linear-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600">
                  Login
                </button>
              )}

              <p className="text-center mt-3 text-sm text-slate-300">
                No account?{" "}
                <Link
                  to="/register"
                  className="text-indigo-300 hover:underline"
                >
                  Register here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
