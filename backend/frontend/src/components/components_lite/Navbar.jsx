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
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
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
        setOpen(false);
        navigate("/login");
      } else {
        toast.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed");
    }
  };

  const NavLink = ({ to, children }) => (
    <li className="group">
      <Link
        to={to}
        onClick={() => setOpen(false)}
        className="relative inline-flex items-center px-2 py-1 text-xs md:text-sm text-slate-300 hover:text-white transition-colors duration-200"
      >
        <span className="z-10">{children}</span>
        <span className="absolute left-0 -bottom-0.5 h-0.5 w-full origin-left scale-x-0 transform bg-linear-to-r from-cyan-400 to-pink-400 transition-transform duration-200 group-hover:scale-x-100"></span>
      </Link>
    </li>
  );

  const MobileNavLink = ({ to, children, icon: Icon }) => (
    <Link
      to={to}
      onClick={() => setOpen(false)}
      className="flex items-center gap-3 px-3 py-2 rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition-colors duration-200"
    >
      {Icon && <Icon size={18} />}
      <span>{children}</span>
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-linear-to-r from-slate-900 via-indigo-900 to-slate-900 shadow-lg">
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          {/* Brand - Responsive size */}
          <div className="shrink-0 flex-shrink-0">
            <Link to="/" className="flex items-baseline gap-0.5 md:gap-1" onClick={() => setOpen(false)}>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold leading-none text-white">
                Job
                <span className="text-cyan-400">Portal</span>
              </h1>
            </Link>
          </div>

          {/* Center nav - hidden on small screens */}
          <nav className="hidden md:flex flex-1 justify-center">
            <ul className="flex items-center gap-4 lg:gap-6 whitespace-nowrap font-semibold">
              {user && user.role === "Recruiter" ? (
                <>
                  <NavLink to="/admin/companies">Companies</NavLink>
                  <NavLink to="/admin/jobs">Jobs</NavLink>
                </>
              ) : (
                <>
                  <NavLink to="/">Home</NavLink>
                  <NavLink to="/browse">Browse</NavLink>
                  <NavLink to="/jobs">Jobs</NavLink>
                </>
              )}
            </ul>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Auth Section - hidden on small screens */}
            <div className="hidden md:flex items-center gap-2">
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
                    <Avatar className="cursor-pointer h-10 w-10 md:h-12 md:w-12">
                      <AvatarImage
                        src={user?.profile?.profilePhoto}
                        alt={user?.fullname}
                      />
                    </Avatar>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 md:w-72">
                    <div className="flex items-start gap-4 text-black">
                      <Avatar className="h-10 w-10 md:h-12 md:w-12">
                        <AvatarImage
                          src={user?.profile?.profilePhoto}
                          alt={user?.fullname}
                        />
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm md:text-base">{user?.fullname}</h3>
                        <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                          {user?.profile?.bio}
                        </p>
                        <div className="mt-4 flex flex-col gap-2">
                          {user && user.role === "Student" && (
                            <button className="w-full bg-[#141f4e] text-white px-3 py-2 rounded-md flex items-center gap-2 text-xs md:text-sm hover:bg-[#1a2659] transition-colors duration-200">
                              <User2 size={16} />
                              <Link to="/Profile" className="flex-1 text-left">
                                View profile
                              </Link>
                            </button>
                          )}
                          <button
                            onClick={logouthandler}
                            className="w-full bg-[#141f4e] text-white px-3 py-2 rounded-md flex items-center gap-2 text-xs md:text-sm hover:bg-[#1a2659] transition-colors duration-200"
                          >
                            <LogOut size={16} />
                            Logout
                          </button>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>

            {/* Mobile menu button - shown on small screens */}
            <div className="md:hidden">
              <button
                onClick={() => setOpen(!open)}
                aria-label="Toggle menu"
                className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-white/10 transition-colors duration-200"
              >
                {open ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu panel - slides down on small screens */}
      <div
        className={`${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } md:hidden overflow-hidden border-t border-white/10 bg-linear-to-b from-slate-800 to-slate-900 transition-all duration-300 ease-in-out`}
      >
        <div className="px-3 pt-2 pb-4 space-y-1">
          {/* Mobile Navigation Links */}
          {user && user.role === "Recruiter" ? (
            <>
              <MobileNavLink to="/admin/companies">Companies</MobileNavLink>
              <MobileNavLink to="/admin/jobs">Jobs</MobileNavLink>
            </>
          ) : (
            <>
              <MobileNavLink to="/">Home</MobileNavLink>
              <MobileNavLink to="/browse">Browse</MobileNavLink>
              <MobileNavLink to="/jobs">Jobs</MobileNavLink>
            </>
          )}

          {/* Mobile Auth Section */}
          <div className="pt-3 border-t border-white/10 space-y-2">
            {!user ? (
              <>
                <Link to="/login" onClick={() => setOpen(false)}>
                  <button className="w-full text-left bg-white/10 border border-white/20 text-white px-3 py-2.5 rounded-md text-sm hover:bg-white/20 transition-colors duration-200">
                    Login
                  </button>
                </Link>
                <Link to="/register" onClick={() => setOpen(false)}>
                  <button className="w-full text-left bg-linear-to-r from-cyan-500 to-pink-500 text-white px-3 py-2.5 rounded-md text-sm font-semibold hover:from-cyan-600 hover:to-pink-600 transition-all duration-200">
                    Register
                  </button>
                </Link>
              </>
            ) : (
              <>
                {user && user.role === "Student" && (
                  <Link to="/Profile" onClick={() => setOpen(false)}>
                    <button className="w-full text-left bg-[#141f4e] text-white px-3 py-2.5 rounded-md flex items-center gap-3 text-sm hover:bg-[#1a2659] transition-colors duration-200">
                      <User2 size={18} />
                      <span>View Profile</span>
                    </button>
                  </Link>
                )}
                <button
                  onClick={() => {
                    logouthandler();
                  }}
                  className="w-full text-left bg-[#141f4e] text-white px-3 py-2.5 rounded-md flex items-center gap-3 text-sm hover:bg-[#1a2659] transition-colors duration-200"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
