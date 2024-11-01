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
    <div className="navbar w-full border-b border-gray-300 px-5 sm:px-12 py-4  text-gray-300 text-lg bg-[#6f4b63] flex justify-between items-center">
      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-2">
          <i className="bi bi-person-vcard-fill text-2xl "></i>
          <p className="font-normal capitalize ">Name: {name}</p>
        </div>
        <div className="flex items-center space-x-2">
          <i className="bi bi-universal-access-circle text-2xl "></i>
          <p className="font-normal capitalize ">Role: {roles}</p>
        </div>
      </div>
      <button
        className="flex items-center py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-md capitalize text-sm transition-all duration-150"
        onClick={adminLogout}
      >
        {loading ? <Spinner /> : <i className="bi bi-power text-[18px]"></i>}
        <span className="ml-2">Logout</span>
      </button>
    </div>
  );
};

export default Navbar;
