import React from "react";
import { assets } from "../assets/assets";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
const Sidebar = () => {
  const loginInfo = useSelector((state) => state?.auth?.loginInfo);

  // Kiểm tra nếu `loginInfo` là null hoặc undefined, gán giá trị mặc định
  const { name, roles, _id } = loginInfo || {};

  return (
    <div className="bg-[#6e446e] min-h-screen w-[15%] items-center">
      <div className="flex items-center flex-col gap-3 mt-5">
        <img
          className="w-18 h-18 object-contain"
          src={assets.logo}
          alt="Molodies Logo"
        />

        {/* Thêm Tailwind vào tiêu đề */}
        <h1 className="font-[Vazirmatn] text-[24px] font-bold leading-[37.5px] text-left bg-clip-text text-transparent bg-gradient-to-r from-[#EE10B0] to-[#0E9EEF]">
          Molodies
        </h1>
      </div>

      <div className="flex flex-col gap-5 mt-10 ml-10">
        {/* <NavLink
          to="/add-song"
          className="flex items-center gap-2.5 text-gray-800 bg-white border border-black p-2 pr-[max(8vw,10px)] drop-shadow-[-4px_4px_#00FF5B] text-sm font-medium "
        >
          <img className="w-5 " src={assets.add_song} alt="" />
          <p className="hidden sm:block ">Add Song</p>
        </NavLink> */}
        <NavLink
          to="/manager-album"
          className="flex items-center gap-2.5 text-gray-800 bg-white border border-black p-2 pr-[max(8vw,10px)] drop-shadow-[-4px_4px_#00FF5B] text-base font-medium "
        >
          <img className="w-5 " src={assets.album_icon} alt="" />
          <p className="hidden sm:block ">Manager Album</p>
        </NavLink>
        <NavLink
          to="/manager-song"
          className="flex items-center gap-2.5 text-gray-800 bg-white border border-black p-2 pr-[max(8vw,10px)] drop-shadow-[-4px_4px_#00FF5B] text-base font-medium "
        >
          <img className="w-5 " src={assets.song_icon} alt="" />
          <p className="hidden sm:block ">Manager Song</p>
        </NavLink>

        {roles === "leader" && (
          <>
            <NavLink
              to="/manager-category"
              className="flex items-center gap-2.5 text-gray-800 bg-white border border-black p-2 pr-[max(8vw,10px)] drop-shadow-[-4px_4px_#00FF5B] text-base font-medium "
            >
              <i className="bi bi-card-heading text-xl"></i>

              <p className="hidden sm:block ">Manager Category</p>
            </NavLink>
            <NavLink
              to="/manager-account"
              className="flex items-center gap-2.5 text-gray-800 bg-white border border-black p-2 pr-[max(8vw,10px)] drop-shadow-[-4px_4px_#00FF5B] text-base font-medium "
            >
              <i className="bi bi-person-lines-fill text-xl"></i>
              <p className="hidden sm:block ">Manager Account</p>
            </NavLink>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
