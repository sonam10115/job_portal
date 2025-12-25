import React, { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Avatar, AvatarImage } from "../ui/avatar";
import { User2, LogOut, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import { USER_API_ENDPOINT } from "@/utils/data";

function Navbar() {
  const [open, setOpen] = useState(true);
  const { user } = useSelector((store) => store.auth); // Replace with actual authentication logic
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logouthandler = async () => {
    try {
      const response = await fetch(`${USER_API_ENDPOINT}/logout`, {
        method: "POST",
        withCredentials: true,
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Logout Successful");
        dispatch(setUser(null));
        navigate("/login");
      } else {
        toast.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed");
    }
    console.log("Logout clicked");
  };

  const NavLink = ({ to, children }) => (
    <li className="group">
      <Link
        to={to}
        className="relative inline-flex items-center px-2 py-1 text-sm text-slate-300 hover:text-white transition-colors duration-200"
      >
        <span className="z-10">{children}</span>
        <span className="absolute left-0 -bottom-0.5 h-0.5 w-full origin-left scale-x-0 transform bg-linear-to-r from-cyan-400 to-pink-400 transition-transform duration-200 group-hover:scale-x-100"></span>
      </Link>
    </li>
  );

  return (
    <header className="sticky top-0 z-40 w-full bg-linear-to-r from-slate-900 via-indigo-900 to-slate-900 shadow-lg overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <div className="shrink-0">
            <Link to="/" className="flex items-baseline gap-1">
              <h1 className="text-2xl font-bold leading-none text-white">
                Job
                <span className="text-cyan-400 ">Portal</span>
              </h1>
            </Link>
          </div>

          {/* Center nav - hidden on small screens. Use overflow-hidden to avoid overflow issues. */}
          <nav className="hidden sm:flex flex-1 justify-center ">
            <ul className="flex items-center gap-6 whitespace-nowrap font-semibold">
              {user && user.role === "Recruiter" ? (
                <>
                  <NavLink to="/admin/companies">Companies</NavLink>
                  <NavLink to="/admin/jobs">Jobs</NavLink>
                </>
              ) : (
                <>
                  <NavLink to="/Home">Home</NavLink>
                  <NavLink to="/browse">Browse</NavLink>
                  <NavLink to="/jobs">Jobs</NavLink>
                </>
              )}
            </ul>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              {!user ? (
                <>
                  <Link to="/login">
                    <button className="bg-white/10 text-white px-3 py-1.5 rounded-md text-sm border border-white/20 hover:bg-white/20 transition-colors duration-200">
                      Login
                    </button>
                  </Link>
                  <Link to="/register">
                    <button className="bg-cyan-500 text-white px-3 py-1.5 rounded-md text-sm font-semibold hover:from-cyan-600 hover:to-pink-600 transition-all duration-200">
                      Register
                    </button>
                  </Link>
                </>
              ) : (
                <Popover>
                  <PopoverTrigger asChild>
                    <Avatar className="cursor-pointer h-12 w-12">
                      <AvatarImage
                        src={user?.profile?.profilePhoto}
                        alt={user?.fullname}
                      />
                    </Avatar>
                  </PopoverTrigger>
                  <PopoverContent className="w-72">
                    <div className="flex items-start gap-4 text-black">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={user?.profile?.profilePhoto}
                          alt={user?.fullname}
                        />
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{user?.fullname}</h3>
                        <p className="text-sm text-muted-foreground">
                          {user?.profile?.bio}
                        </p>
                        <div className="mt-4 flex flex-col gap-2">
                          {user && user.role === "Student" && (
                            <button className="w-full bg-[#141f4e] text-white px-3 py-2 rounded-md flex items-center gap-2 text-sm">
                              <User2 />
                              <Button variant="link">
                                {" "}
                                <Link to={"/Profile"}>View profile</Link>
                              </Button>
                            </button>
                          )}

                          <div className="w-full bg-[#141f4e] text-white px-3 py-2 rounded-md flex items-center gap-2 text-sm">
                            <LogOut />
                            <Button onClick={logouthandler} variant="link">
                              Logout
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="sm:hidden">
              <button
                onClick={() => setOpen(!open)}
                aria-label="Toggle menu"
                className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-white/10 transition-colors duration-200"
              >
                {open ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu panel - slides down */}
      <div
        className={`${
          open ? "block" : "hidden"
        } sm:hidden border-t border-white/10 bg-linear-to-b from-slate-800 to-slate-900`}
      >
        <div className="px-4 pt-3 pb-4 space-y-2">
          <Link
            to="/"
            className="block px-2 py-2 rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition-colors duration-200"
          >
            Home
          </Link>
          <Link
            to="/browse"
            className="block px-2 py-2 rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition-colors duration-200"
          >
            Browse
          </Link>
          <Link
            to="/jobs"
            className="block px-2 py-2 rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition-colors duration-200"
          >
            Jobs
          </Link>

          <div className="pt-2">
            {!user ? (
              <div className="flex flex-col gap-2">
                <Link to="/login" className="block">
                  <button className="w-full text-left bg-white/10 border border-white/20 text-white px-3 py-2 rounded-md hover:bg-white/20 transition-colors duration-200">
                    Login
                  </button>
                </Link>
                <Link to="/register" className="block">
                  <button className="w-full text-left bg-linear-to-r from-cyan-500 to-pink-500 text-white px-3 py-2 rounded-md font-semibold hover:from-cyan-600 hover:to-pink-600 transition-all duration-200">
                    Register
                  </button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <button className="w-full text-left bg-[#141f4e] text-white px-3 py-2 rounded-md flex items-center gap-2">
                  <User2 /> Profile
                </button>
                <button className="w-full text-left bg-[#141f4e] text-white px-3 py-2 rounded-md flex items-center gap-2">
                  <LogOut /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
