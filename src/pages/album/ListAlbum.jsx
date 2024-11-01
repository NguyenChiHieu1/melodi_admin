import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { url } from "../../App";
import AdminHome from "../../components/AdminHome";
import { Link, useNavigate, useParams } from "react-router-dom";
import ScreenHeader from "../../components/ScreenHeader";
import Spinner from "../../components/Spinner";
import Pagination from "../../components/Pagination";
import { useSelector } from "react-redux";
import Excel from "../../utils/Excel";

const ListAlbum = () => {
  const { page = 1 } = useParams();
  const navigate = useNavigate();
  const [countPage, setCounPage] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sortValue, setSortValue] = useState("");

  const { name, roles, _id } = useSelector((state) => state.auth.loginInfo);
  const token = useSelector((state) => state.auth.loginToken);

  const [artist, setArtist] = useState(roles === "artist" ? _id : "");

  const fetchAlbums = async () => {
    try {
      if (roles === "artist") {
        setArtist(_id);
      }
      const params = {
        ...(search && { name: search }),
        ...(roles === "artist" && { artist: _id }),
        ...(status && { status: status }),
        ...(sortValue && { sort: sortValue }),
        page: page,
        limit: 5,
        // fields: "name,artist,viewCount",
      };

      const queryParams = new URLSearchParams(params);
      // console.log(queryParams);
      const response = await axios.get(
        `${url}/api/album/albums?${queryParams.toString()}`
      );
      if (response.data.success) {
        // console.log(response);
        // const newData = await response.data.data.map((it) => {
        //   return {
        //     ...it,
        //     checkStatus:
        //       it.status === "approved" ? 1 : it.status === "pending" ? 0 : -1,
        //   };
        // });

        setData(response.data.data);
        setCounPage(response.data.counts);
      }
    } catch (error) {
      toast.error("Error Occur");
    }
  };

  const removeAlbum = async (id, name) => {
    try {
      if (window.confirm(`Bạn có xác nhận muốn xóa album "${name}"?`)) {
        setLoading(true);
        const response = await axios.delete(`${url}/api/album/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          toast.success(response.data.message);
          setLoading(false);
          await fetchAlbums();
        }
        setLoading(false);
      }
    } catch (error) {
      toast.error("Error Occur");
    }
  };

  const onSearch = async () => {
    setLoading(true);
    fetchAlbums().finally(() => setLoading(false));
  };

  const onHandleChange = (id) => {};

  // Gọi lại `fetchAlbums` khi `status` thay đổi
  // useEffect(() => {
  //   if (status !== "") {
  //     setLoading(true);
  //     fetchAlbums().finally(() => setLoading(false));
  //   }
  // }, []);

  useEffect(() => {
    setLoading(true);
    fetchAlbums().finally(() => setLoading(false));
  }, [artist, status, sortValue, page]);

  //Dug cho excel
  const headers = [
    "STT",
    "Album Name",
    "Artist",
    "Status",
    "Views",
    "Description",
    "Songs",
    "Bg - Color",
    "Image",
  ];

  const dataForCSV =
    data?.map((ab, index) => ({
      index: index + 1,
      name: ab?.name || "",
      artist: ab?.artist?.username || "",
      status: ab?.status || "",
      viewCount: ab?.viewCount || "0",
      downloadCount: ab?.downloadCount || "0",
      songs: ab?.coupons?.songs?.join(", ") || "",
      bg_colour: ab?.bg_colour || "",
      image: ab?.image || "",
    })) || [];

  return (
    <AdminHome>
      <ScreenHeader>
        <div className="flex items-center space-x-10 mb-1 w-full">
          <div className="flex items-center space-x-4 justify-between w-full">
            {/* Ô tìm kiếm */}
            <div className="flex items-center bg-slate-600 rounded-2xl overflow-hidden">
              <input
                type="text"
                placeholder="Search by album name ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="py-2 px-4 w-80 text-white bg-slate-600 placeholder-gray-400 rounded-r-2xl h-full pl-2 focus:outline-none"
              />
              <div
                className="px-3 py-1 bg-slate-600 cursor-pointer hover:bg-slate-500"
                onClick={onSearch}
              >
                <i className="bi bi-search text-lg text-white group-hover:text-gray-700"></i>
              </div>
            </div>
            <div className="relative group flex justify-center items-center w-24">
              <div className="font-semibold text-3xl text-white rounded-full flex items-center justify-center border-white">
                <i className="bi bi-filter "></i>
              </div>
              <div className="hidden z-50 absolute top-[30px] right-[40px] flex-col w-56 max-w-60 bg-[#744a65] rounded-lg group-hover:flex p-3">
                <div className="flex justify-start items-start flex-col gap-2 text-white mb-2 ">
                  <div className="flex flex-row items-center gap-2">
                    <i className="bi bi-music-note-beamed text-lg text-white"></i>
                    <p className="font-bold text-white">Action</p>
                  </div>
                  <div
                    className=" text-gray-200 w-full py-1 hover:bg-[#8f5e7e] rounded-md px-1 cursor-pointer"
                    onClick={() => navigate("/manager-album/add")}
                  >
                    <p>Add new album</p>
                  </div>
                </div>
                <div className="flex justify-start items-start flex-col gap-2 text-gray-200 mb-2 border-t-2">
                  <div className="flex flex-row items-center gap-2">
                    <i className="bi bi-filter-square text-lg "></i>
                    <p className="font-bold text-white">Filter</p>
                  </div>
                  <select
                    value={status}
                    className="bg-[#744a65] hover:bg-[#8f5e7e] rounded-md py-1 outline-[#834a7d]"
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="">Filter by albums status</option>
                    <option value="pending">Status Pending</option>
                    <option value="approved">Status Approved</option>
                    <option value="rejected">Status Rejected</option>
                  </select>
                  <select
                    value={sortValue}
                    className=" bg-[#744a65] w-full hover:bg-[#8f5e7e] rounded-md py-1 outline-[#834a7d]"
                    onChange={(e) => setSortValue(e.target.value)}
                  >
                    <option value="">Sort by views</option>
                    <option value="viewCount">Ascending views</option>
                    <option value="-viewCount">Descending views</option>
                  </select>
                  <select
                    value={sortValue}
                    className="bg-[#744a65] w-full hover:bg-[#8f5e7e] rounded-md py-1 outline-[#834a7d]"
                    onChange={(e) => setSortValue(e.target.value)}
                  >
                    <option value="">Sort by download</option>
                    <option value="downloadCount">Ascending downloads</option>
                    <option value="-downloadCount">Descending downloads</option>
                  </select>
                </div>
                <div className="flex justify-start items-center gap-2 text-white mb-2 "></div>
                <div className="flex justify-start items-start flex-col gap-2 text-white border-t-2">
                  <div className="flex flex-row items-center gap-2">
                    <i className="bi bi-gear text-lg "></i>
                    <p className="font-bold text-white">Others</p>
                  </div>
                  <Excel
                    dataRow={dataForCSV}
                    dataHeader={headers}
                    nameExcel={"albums"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScreenHeader>
      {loading ? (
        <Spinner />
      ) : data?.length > 0 ? (
        <div>
          <table className="w-full rounded-md">
            <thead>
              <tr className="border-b border-gray-500 text-left">
                {/* {roles === "leader" ? (
                  <th className="p-3 uppercase text-sm font-medium text-gray-600">
                    <input type="checkbox" id="myCheckbox" name="myCheckbox" />
                  </th>
                ) : null} */}
                <th className="p-3 capitalize text-sm font-normal text-gray-300"></th>
                <th className="p-3 capitalize text-sm font-normal text-gray-300 w-96"></th>
                <th className="p-3 capitalize text-sm font-normal text-gray-300">
                  Status
                </th>
                <th className="p-3 capitalize text-sm font-normal text-gray-300">
                  Views
                </th>
                <th className="p-3 capitalize text-sm font-normal text-gray-300">
                  Downloads
                </th>
                <th className="p-3 capitalize text-sm font-normal text-gray-300">
                  Total Song
                </th>
                <th className="p-3 capitalize text-sm font-normal text-gray-300">
                  Bg - Color
                </th>
                <th className="p-3 capitalize text-sm font-normal text-gray-300 w-2"></th>
              </tr>
            </thead>
            <tbody>
              {data?.map((album, index) => (
                <tr
                  className="text-white rounded-lg mb-2 group hover:bg-slate-700"
                  key={album?._id}
                >
                  <td className="p-3 text-sm text-white mr-2"># {index + 1}</td>
                  <td className="p-3 text-sm text-white flex flex-row items-center gap-2 w-[500px]">
                    <img
                      src={album?.image}
                      alt="Image album"
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex flex-col justify-center ">
                      <p className="font-bold truncate">{album?.name}</p>
                      <p className="text-gray-300">
                        {album?.artist.map((item) => item?.username).join(", ")}
                      </p>
                    </div>
                  </td>
                  <td className="p-3 text-sm text-white capitalize ">
                    {album?.status}
                  </td>
                  <td className="p-3 text-sm text-white capitalize">
                    {album?.viewCount}
                  </td>
                  <td className="p-3 text-sm text-white capitalize">
                    {album?.downloadCount}
                  </td>
                  <td className="p-3 text-sm text-white capitalize ">
                    {album?.songs.length}
                  </td>
                  <td className="p-3 text-sm text-white capitalize">
                    <input
                      type="color"
                      value={album?.bg_colour}
                      readOnly
                      className="w-6 h-6 rounded-full"
                    />
                  </td>
                  <td className="w-20">
                    <div className="hidden gap-3 text-sm text-white group-hover:flex space-x-2">
                      <Link to={`/manager-album/update/${album?._id}`}>
                        <button className="text-white rounded">
                          <i className="bi bi-pencil text-lg hover:text-[#EE10B0]"></i>
                        </button>
                      </Link>
                      <button
                        className="text-white rounded"
                        onClick={() => removeAlbum(album?._id, album?.name)}
                      >
                        <i className="bi bi-trash text-lg hover:text-[#EE10B0]"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            page={parseInt(page)}
            perPage={5}
            count={countPage}
            path="manager-album"
            theme="light"
          />
        </div>
      ) : (
        <p className="text-white mt-3">No albums!</p>
      )}
    </AdminHome>
  );
};

export default ListAlbum;
