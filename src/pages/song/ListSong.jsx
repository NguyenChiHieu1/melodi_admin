import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { url } from "../../App";
import AdminHome from "../../components/AdminHome";
import { Link, useParams } from "react-router-dom";
import ScreenHeader from "../../components/ScreenHeader";
import Spinner from "../../components/Spinner";
import Pagination from "../../components/Pagination";
import { useSelector } from "react-redux";
import Excel from "../../utils/Excel";

const ListSong = () => {
  const { page = 1 } = useParams();
  const [countPage, setCountPage] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sortValue, setSortValue] = useState("");

  const { name, roles, _id } = useSelector((state) => state.auth.loginInfo);
  const token = useSelector((state) => state.auth.loginToken);

  const fetchSongs = async () => {
    try {
      const params = {
        ...(search && { title: search }),
        ...(status && { status }),
        ...(sortValue && { sort: sortValue }),
        ...(roles === "artist" && { artist: _id }),

        page: page,
        limit: 5,
      };

      const queryParams = new URLSearchParams(params);
      const response = await axios.get(
        `${url}/api/song/songs?${queryParams.toString()}`
      );
      if (response.data.success) {
        setData(response.data.data);
        setCountPage(response.data.counts);
      }
    } catch (error) {
      toast.error("Error Occur");
    }
  };

  const removeSong = async (id, title) => {
    try {
      if (window.confirm(`Bạn có xác nhận muốn xóa bài hát "${title}"?`)) {
        setLoading(true);
        const response = await axios.delete(`${url}/api/song/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          toast.success(response.data.message);
          setLoading(false);
          await fetchSongs();
        }
        setLoading(false);
      }
    } catch (error) {
      toast.error("Error Occur");
    }
  };

  const onSearch = async () => {
    setLoading(true);
    fetchSongs().finally(() => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    fetchSongs().finally(() => setLoading(false));
  }, [status, sortValue, page]);

  const headers = [
    "STT",
    "Song Title",
    "Artist",
    "Category",
    "Status",
    "Views",
    "Downloads",
    "Duration",
    "Image",
  ];
  const dataForCSV =
    data?.map((song, index) => ({
      index: index + 1,
      title: song?.title || "",
      artist: song?.artist?.username || "",
      category: song?.category?.map((cat) => cat.name).join(", ") || "",
      status: song?.status || "",
      viewCount: song?.viewCount || "0",
      downloadCount: song?.downloadCount || "0",
      duration: song?.duration || "0",
      image: song?.image || "",
    })) || [];

  return (
    <AdminHome>
      <ScreenHeader>
        <div className="flex items-center space-x-10 justify-between mb-1">
          <Link to="/manager-song/add">
            <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
              <i className="bi bi-plus-lg text-lg"></i>
            </button>
          </Link>

          <div className="flex items-center space-x-4">
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
              <input
                type="text"
                placeholder="Search by song name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="py-2 px-4 w-full outline-none"
              />
              <div
                className="px-3 py-1 text-gray-500 hover:text-gray-700 hover:bg-slate-300 cursor-pointer bg-slate-200"
                onClick={onSearch}
              >
                <i className="bi bi-search text-lg"></i>
              </div>
            </div>

            <select
              value={status}
              className="p-2 border rounded-lg w-40 "
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Filter by status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              value={sortValue}
              className="p-2 border rounded-lg w-44 "
              onChange={(e) => setSortValue(e.target.value)}
            >
              <option value="">Sort by views</option>
              <option value="viewCount">Ascending views</option>
              <option value="-viewCount">Descending views</option>
            </select>

            <Excel
              dataRow={dataForCSV}
              dataHeader={headers}
              nameExcel={"songs"}
            />
          </div>
        </div>
      </ScreenHeader>

      {loading ? (
        <Spinner />
      ) : data?.length > 0 ? (
        <div>
          <table className="w-full bg-gray-200 rounded-md">
            <thead>
              <tr className="border-b border-gray-800 text-left bg-gray-300">
                <th className="p-3 uppercase text-sm font-medium text-gray-600">
                  Image
                </th>
                <th className="p-3 uppercase text-sm font-medium text-gray-600">
                  Song Title
                </th>
                <th className="p-3 uppercase text-sm font-medium text-gray-600">
                  Artist
                </th>
                <th className="p-3 uppercase text-sm font-medium text-gray-600">
                  Category
                </th>
                <th className="p-3 uppercase text-sm font-medium text-gray-600">
                  Status
                </th>
                <th className="p-3 uppercase text-sm font-medium text-gray-600">
                  Views
                </th>
                <th className="p-3 uppercase text-sm font-medium text-gray-600">
                  Downloads
                </th>
                <th className="p-3 uppercase text-sm font-medium text-gray-600">
                  Duration
                </th>
                <th className="p-3 uppercase text-sm font-medium text-gray-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.map((song, index) => (
                <tr className="odd:bg-gray-100" key={song?._id}>
                  <td className="p-3 text-sm text-gray-800">
                    <img src={song?.image} alt="" className="w-14 h-14" />
                  </td>
                  <td className="p-3 text-sm text-gray-800">{song?.title}</td>
                  <td className="p-3 text-sm text-gray-800">
                    {song?.artist?.username}
                  </td>
                  <td className="p-3 text-sm text-gray-800">
                    {song?.category?.map((cat) => cat.name).join(", ")}
                  </td>
                  <td className="p-3 text-sm text-gray-800 capitalize">
                    {song?.status}
                  </td>
                  <td className="p-3 text-sm text-gray-800">
                    {song?.viewCount}
                  </td>
                  <td className="p-3 text-sm text-gray-800">
                    {song?.downloadCount}
                  </td>
                  <td className="p-3 text-sm text-gray-800">
                    {song?.duration}
                  </td>
                  <td className="p-3 text-sm text-gray-800 flex space-x-2 mt-2">
                    <Link to={`/manager-song/update/${song?._id}`}>
                      <button className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-800">
                        <i className="bi bi-pencil text-lg"></i>
                      </button>
                    </Link>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => removeSong(song?._id, song?.title)}
                    >
                      <i className="bi bi-trash text-lg"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            page={parseInt(page)}
            perPage={5}
            count={countPage}
            path="manager-song"
            theme="light"
          />
        </div>
      ) : (
        "No songs!"
      )}
    </AdminHome>
  );
};

export default ListSong;
