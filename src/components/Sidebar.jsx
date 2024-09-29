import React from "react";
import { assets } from "../assets/assets";
import { NavLink } from "react-router-dom";
const Sidebar = () => {
  return (
    <div className="bg-[#bb89e6] min-h-screen pl-[4vw]">
      <div className="  ">
        <h1 className="text-2xl">Melodies</h1>
      </div>

      <div className="flex flex-col gap-5 mt-10">
        <NavLink
          to="/add-song"
          className="flex items-center gap-2.5 text-gray-800 bg-white border border-black p-2 pr-[max(8vw,10px)] drop-shadow-[-4px_4px_#00FF5B] text-sm font-medium "
        >
          <img className="w-5 " src={assets.add_song} alt="" />
          <p className="hidden sm:block ">Add Song</p>
        </NavLink>
        <NavLink
          to="/list-song"
          className="flex items-center gap-2.5 text-gray-800 bg-white border border-black p-2 pr-[max(8vw,10px)] drop-shadow-[-4px_4px_#00FF5B] text-sm font-medium "
        >
          <img className="w-5 " src={assets.song_icon} alt="" />
          <p className="hidden sm:block ">List Song</p>
        </NavLink>
        <NavLink
          to="/add-album"
          className="flex items-center gap-2.5 text-gray-800 bg-white border border-black p-2 pr-[max(8vw,10px)] drop-shadow-[-4px_4px_#00FF5B] text-sm font-medium "
        >
          <img className="w-5 " src={assets.add_album} alt="" />
          <p className="hidden sm:block ">Add Album</p>
        </NavLink>
        <NavLink
          to="/list-album"
          className="flex items-center gap-2.5 text-gray-800 bg-white border border-black p-2 pr-[max(8vw,10px)] drop-shadow-[-4px_4px_#00FF5B] text-sm font-medium "
        >
          <img className="w-5 " src={assets.album_icon} alt="" />
          <p className="hidden sm:block ">List Album</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
