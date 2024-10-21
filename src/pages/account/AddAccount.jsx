import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { url } from "../../App";
import AdminHome from "../../components/AdminHome";
import Spinner from "../../components/Spinner";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";

const AddAccount = () => {
  const navigate = useNavigate();

  const { roles } = useSelector((state) => state.auth.loginInfo);
  const token = useSelector((state) => state.auth.loginToken);

  const [image, setImage] = useState(null);
  const [value, setValue] = useState({
    username: "",
    email: "",
    password: "",
    roles: "", // Default role is 'user'
  });
  const [loading, setLoading] = useState(false);

  const validate = (userData) => {
    if (!userData.username || userData.username.length < 3) {
      toast.error("Username must be at least 3 characters long.");
      return false;
    }

    if (!userData.email || !/\S+@\S+\.\S+/.test(userData.email)) {
      toast.error("Invalid email address.");
      return false;
    }

    if (!userData.password || userData.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return false;
    }

    if (!userData.roles) {
      toast.error("Please select a role.");
      return false;
    }

    if (!image) {
      toast.error("Please select image.");
      return false;
    }

    return true;
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (validate(value)) {
        const formData = new FormData();
        formData.append("username", value.username);
        formData.append("email", value.email);
        formData.append("password", value.password);
        formData.append("roles", value.roles);
        if (image) formData.append("image", image);

        const response = await axios.post(`${url}/api/user/create`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data.success) {
          toast.success("Account created successfully!");
          setValue({
            username: "",
            email: "",
            password: "",
            roles: "user",
          });
          setImage(null);
        } else {
          toast.error("Something went wrong!");
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const onChangeHandler = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  return (
    <AdminHome>
      {loading ? (
        <Spinner />
      ) : (
        <div className="flex items-center justify-center">
          <form
            onSubmit={onSubmitHandler}
            className="flex flex-col justify-center gap-2.5 w-[90%]"
          >
            <div className="mb-4 flex items-center gap-2">
              <i
                className="bi bi-arrow-left text-3xl cursor-pointer text-gray-600 hover:text-gray-800"
                onClick={() => {
                  navigate(-1);
                }}
              ></i>
              <h1 className="text-2xl font-bold text-gray-800 ml-[23rem]">
                Create New Account
              </h1>
            </div>

            {/* Upload Profile Image */}
            <div className="flex flex-col gap-1">
              <p>Upload Profile Image</p>
              <input
                onChange={(e) => setImage(e.target.files[0])}
                type="file"
                id="profile_image"
                accept="image/*"
                hidden
              />
              <label htmlFor="profile_image" className="w-24">
                <img
                  className="w-24 cursor-pointer"
                  src={image ? URL.createObjectURL(image) : assets.upload_area}
                  alt="Profile"
                />
              </label>
            </div>

            {/* Username */}
            <div className="flex flex-col gap-1.5">
              <p>Username</p>
              <input
                name="username"
                onChange={onChangeHandler}
                value={value.username}
                className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-full"
                type="text"
                placeholder="Enter username"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <p>Email</p>
              <input
                name="email"
                onChange={onChangeHandler}
                value={value.email}
                className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-full"
                type="email"
                placeholder="Enter email address"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <p>Password</p>
              <input
                name="password"
                onChange={onChangeHandler}
                value={value.password}
                className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-full"
                type="password"
                placeholder="Enter password"
              />
            </div>

            {/* Roles */}
            <div className="flex flex-col gap-1">
              <p>Select Role</p>
              <select
                name="roles"
                onChange={onChangeHandler}
                value={value.roles}
                className="p-2 border rounded-lg w-[12rem]"
              >
                <option value="66fbd508107a3d7571bf5570">Listener</option>
                <option value="66fba3a49365526bc7e9bd95">Artist</option>
                <option value="66fba3189365526bc7e9bd92">Leader</option>
              </select>
            </div>

            <div className="flex justify-center mt-4">
              <button
                type="submit"
                className="text-base bg-[#834a7d] hover:bg-[#8d548d] text-white py-2.5 px-14 cursor-pointer rounded-md"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminHome>
  );
};

export default AddAccount;
