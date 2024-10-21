import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import { logout } from "../store/reducer/authReducer";
import { BiUser, BiUserCircle } from "react-icons/bi";

const Navbar = () => {
  const { name, roles, _id } = useSelector((state) => state.auth.loginInfo);

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const adminLogout = async () => {
    try {
      setLoading(true);
      setTimeout(() => {
        dispatch(logout("token"));
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="navbar w-full border-b-2 border-gray-800 px-5 sm:px-12 py-4 text-lg bg-[#eaeaea]">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          <i className="bi bi-person-vcard-fill text-3xl "></i>
          <p className="font-semibold capitalize">Name: {name}</p>
        </div>
        <div className="flex items-center space-x-1">
          <i className="bi bi-universal-access-circle text-3xl"></i>
          <p className="font-semibold capitalize">Role: {roles}</p>
        </div>
      </div>
      <button
        className="py-2 px-4 bg-[#4575d4] text-white rounded-md capitalize text-sm"
        onClick={adminLogout}
      >
        {loading ? <Spinner /> : <i className="bi bi-power text-[20px]"></i>}
      </button>
    </div>
  );
};

export default Navbar;
