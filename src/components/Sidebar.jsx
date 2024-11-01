import React from "react";
import { assets } from "../assets/assets";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
const Sidebar = () => {
  const loginInfo = useSelector((state) => state?.auth?.loginInfo);
  const location = useLocation();
  // Kiểm tra nếu `loginInfo` là null hoặc undefined, gán giá trị mặc định
  const { name, roles, _id } = loginInfo || {};
  let hasManagerAlbum = location.pathname.includes("manager-album");
  let hasManagerSong = location.pathname.includes("manager-song");
  let hasManagerCategory = location.pathname.includes("manager-category");
  let hasManagerAccount = location.pathname.includes("manager-account");

  return (
    <div className="bg-[#0E1920] min-h-screen w-[18%] flex flex-col items-center">
      {/* Logo và tiêu đề */}
      <div className="flex items-center flex-col gap-3 mt-5">
        {/* <img
          className="w-18 h-18 object-contain"
          src={assets.logo}
          alt="Molodies Logo"
        /> */}
        <h1 className="font-[Vazirmatn] text-4xl font-bold leading-[37.5px] text-center bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
          Melodies
        </h1>
      </div>

      {/* Các menu điều hướng */}
      <div className="flex flex-col gap-3 mx-5 p-3 w-full">
        {/* <p className="pl-8 text-sm text-[#EE10B0] ">Manager</p> */}
        <NavLink
          to="/manager-album"
          className={`flex text-xl items-center gap-3 pl-8 cursor-pointer rounded-lg text-gray-400
                    border-2 ${
                      hasManagerAlbum
                        ? "border-[#FF00E5] shadow-[0px_0px_10px_5px_#FF00E5]"
                        : "border-transparent"
                    }  hover:border-[#FF00E5] hover:shadow-[0px_0px_10px_5px_#FF00E5]`}
        >
          <i className="bi bi-collection-play"></i>
          <p className="font-semibold text-white">Manager Album</p>
        </NavLink>
        <NavLink
          to="/manager-song"
          className={`flex text-xl items-center gap-3 pl-8 cursor-pointer rounded-lg text-gray-400
            border-2 ${
              hasManagerSong
                ? "border-[#FF00E5] shadow-[0px_0px_10px_5px_#FF00E5]"
                : "border-transparent"
            }  hover:border-[#FF00E5] hover:shadow-[0px_0px_10px_5px_#FF00E5]`}
        >
          <i className="bi bi-music-note-beamed text-xl"></i>
          <p className="font-semibold text-white">Manager Song</p>
        </NavLink>

        {roles === "leader" && (
          <>
            <NavLink
              to="/manager-category"
              className={`flex text-xl items-center gap-3 pl-8 cursor-pointer rounded-lg text-gray-400
                border-2 ${
                  hasManagerCategory
                    ? "border-[#FF00E5] shadow-[0px_0px_10px_5px_#FF00E5]"
                    : "border-transparent"
                }  hover:border-[#FF00E5] hover:shadow-[0px_0px_10px_5px_#FF00E5]`}
            >
              <i className="bi bi-card-heading text-xl"></i>
              <p className="font-semibold text-white">Manager Category</p>
            </NavLink>
            <NavLink
              to="/manager-account"
              className={`flex text-xl items-center gap-3 pl-8 cursor-pointer rounded-lg text-gray-400
                border-2 ${
                  hasManagerAccount
                    ? "border-[#FF00E5] shadow-[0px_0px_10px_5px_#FF00E5]"
                    : "border-transparent"
                }  hover:border-[#FF00E5] hover:shadow-[0px_0px_10px_5px_#FF00E5]`}
            >
              <i className="bi bi-person-lines-fill text-xl"></i>
              <p className="font-semibold text-white">Manager Account</p>
            </NavLink>
          </>
        )}
      </div>
      <div className="border-b-2 text-white"></div>
    </div>
  );
};

export default Sidebar;
