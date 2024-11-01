import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { url } from "../../App";
import AdminHome from "../../components/AdminHome";
import Spinner from "../../components/Spinner";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { assets } from "../../assets/assets";

const UpdateAccount = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { roles } = useSelector((state) => state.auth.loginInfo);
  const token = useSelector((state) => state.auth.loginToken);

  const [image, setImage] = useState(null);
  const [value, setValue] = useState({
    username: "",
    email: "",
    password: "",
    roles: "", // Default role
    profile_image: "",
    status: "",
  });
  const [loading, setLoading] = useState(true); // Thay đổi về loading ban đầu

  // Hàm để tải thông tin tài khoản từ server
  const fetchAccountDetails = async () => {
    try {
      const response = await axios.get(`${url}/api/user/findAccount/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const accountData = response.data.data;
      setValue({
        username: accountData.username,
        email: accountData.email,
        password: "",
        roles: accountData.roles._id,
        profile_image: accountData.profile_image,
        status: accountData.status,
      });
      setImage(accountData.profile_image); // Giả sử bạn có trường `image` trong dữ liệu
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch account details.");
    }
  };

  useEffect(() => {
    fetchAccountDetails();
  }, [id]);

  const validate = (userData) => {
    if (!userData.username || userData.username.length < 3) {
      toast.error("Username must be at least 3 characters long.");
      return false;
    }

    if (!userData.email || !/\S+@\S+\.\S+/.test(userData.email)) {
      toast.error("Invalid email address.");
      return false;
    }

    if (userData.password && userData.password.length < 6) {
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
        formData.append("status", value.status);
        if (value.password) formData.append("password", value.password); // Chỉ thêm password nếu có thay đổi
        formData.append("roles", value.roles);
        if (image) formData.append("image", value.image);

        const response = await axios.put(
          `${url}/api/user/update-leader/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              // "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data.success) {
          toast.success("Account updated successfully!");
          // navigate("/manager-account");
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file); // Tạo URL tạm thời cho ảnh
      setImage(objectUrl); // Cập nhật state với URL tạm thời
      setValue({ ...value, image: file });
    }
  };
  return (
    <AdminHome>
      {loading ? (
        <Spinner />
      ) : (
        <div className="flex items-center justify-center">
          <form
            onSubmit={onSubmitHandler}
            className="flex flex-col justify-center gap-2.5 w-[90%] text-white"
          >
            <div className="mb-4 flex items-center gap-2">
              <i
                className="bi bi-arrow-left text-3xl cursor-pointer text-gray-200 hover:text-gray-400"
                onClick={() => {
                  navigate(-1);
                }}
              ></i>
              <h1 className="text-xl font-bold ml-[23rem]">Update Account</h1>
              <ToastContainer />
            </div>

            {/* Upload Profile Image */}
            <div className="flex flex-col gap-1">
              <p>Upload Profile Image</p>
              <input
                onChange={handleImageChange}
                type="file"
                id="profile_image"
                accept="image/*"
                hidden
              />
              <label htmlFor="profile_image" className="w-24">
                <img
                  className="w-24 h-24 cursor-pointer rounded-lg"
                  src={image || assets.upload_area}
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
                className="bg-transparent outline-[#834A7D] border-2 p-2.5 w-full rounded-md"
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
                className="bg-transparent outline-[#834A7D]  rounded-md border-2  p-2.5 w-full"
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
                className="bg-transparent outline-[#834A7D]  rounded-md border-2  p-2.5 w-full"
                type="password"
                placeholder="Enter new password"
              />
            </div>

            {/* Roles */}
            <div className="flex flex-col gap-1">
              <p>Select Role</p>
              <select
                name="roles"
                onChange={onChangeHandler}
                value={value.roles}
                className="p-2 border rounded-lg w-[12rem] bg-[#412C3A] outline-[#834a7d]"
              >
                <option value="66fbd508107a3d7571bf5570">Listener</option>
                <option value="66fba3a49365526bc7e9bd95">Artist</option>
                <option value="66fba3189365526bc7e9bd92">Leader</option>
              </select>
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1">
              <p>Select Status</p>
              <select
                name="status"
                onChange={onChangeHandler}
                value={value.status}
                className="p-2 border rounded-lg w-[12rem] bg-[#412C3A] outline-[#834a7d]"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="flex justify-center mt-4">
              <button
                type="submit"
                className="text-base bg-[#834a7d] hover:bg-[#8d548d] text-white py-2.5 px-14 cursor-pointer rounded-md"
              >
                Update Account
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminHome>
  );
};

export default UpdateAccount;
