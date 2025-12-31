import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { USER_API_ENDPOINT } from "@/utils/data";
import { setUser } from "../../redux/authSlice";

const EditProfileModal = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const [input, setInput] = useState({
    name: user?.fullname,
    email: user?.email,
    phone: user?.phoneNumber,
    bio: user?.profile?.bio,
    skills: user?.profile?.skills?.join(", "),
    file: user?.profile?.resume,
  });

  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullname", input.name);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phone);
    formData.append("bio", input.bio);
    formData.append("skills", input.skills);
    if (input.file) {
      formData.append("file", input.file);
    }
    try {
      setLoading(true);
      const res = await axios.post(
        `${USER_API_ENDPOINT}/profile/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error("Error in updating profile");
    } finally {
      setLoading(false);
    }
    setOpen(false);
  };

  const FileChangehandler = (e) => {
    setInput({
      ...input,
      file: e.target.files[0],
    });
  };

  return (
    <div>
      <Dialog open={open}>
        <DialogContent
          className="sm:max-w-[500px]
          bg-white"
          onInteractOutside={() => setOpen(false)}
        >
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          {/* Form for editing profile */}
          <form onSubmit={handleFileChange}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={input.name}
                  // input={input.name}
                  onChange={changeEventHandler}
                  className="col-span-3 border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  // input={input.email}
                  value={input.email}
                  onChange={changeEventHandler}
                  className="col-span-3 border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  // input={input.phone}
                  value={input.phone}
                  onChange={changeEventHandler}
                  className="col-span-3 border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="bio" className="text-right">
                  Bio
                </Label>
                <input
                  type="bio"
                  id="bio"
                  name="bio"
                  value={input.bio}
                  onChange={changeEventHandler}
                  className="col-span-3 border border-gray-300 rounded-md p-2"
                />
              </div>
              {/* skills */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="skills" className="text-right">
                  Skills
                </Label>
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  value={input.skills}
                  // input={input.skills}
                  onChange={changeEventHandler}
                  className="col-span-3 border border-gray-300 rounded-md p-2"
                />
              </div>
              {/* Resume file upload */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="file" className="text-right">
                  Resume
                </Label>
                <input
                  type="file"
                  id="file"
                  name="file"
                  accept="application/pdf"
                  onChange={FileChangehandler}
                  className="col-span-3 border border-gray-300 rounded-md p-2"
                />
              </div>
            </div>

            <DialogFooter>
              {loading ? (
                <Button className="w-full my-3 py-3 text-white flex items-center justify-center max-w-7xl mx-auto bg-black hover:bg-gray-500 rounded-md">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin">
                    Please wait...
                  </Loader2>
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full my-3 py-3 text-white flex items-center justify-center max-w-7xl mx-auto bg-black hover:bg-gray-500 rounded-md"
                >
                  Save
                </Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditProfileModal;
