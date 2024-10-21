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

const ListAlbum = () => {
  const { page = 1 } = useParams();
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
        limit: 4,
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
        <div className="flex items-center space-x-10 justify-between mb-1">
          {/* Nút "create" */}
          <Link to="/manager-album/add">
            <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
              <i className="bi bi-plus-lg text-lg"></i>
            </button>
          </Link>

          <div className="flex items-center space-x-4">
            {/* Ô tìm kiếm */}
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
              <input
                type="text"
                placeholder="Search by album name ..."
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
            <div className=" flex flex-end">
              <select
                value={status}
                className="p-2 border rounded-lg w-52"
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Filter by albums status</option>
                <option value="pending">Status Pending</option>
                <option value="approved">Status Approved</option>
                <option value="rejected">Status Rejected</option>
              </select>
            </div>

            <div className=" flex flex-end">
              <select
                value={sortValue}
                className="p-2 border rounded-lg w-36"
                onChange={(e) => setSortValue(e.target.value)}
              >
                <option value="">Sort by views</option>
                <option value="viewCount">Ascending views</option>
                <option value="-viewCount">Descending views</option>
              </select>
            </div>

            <div className=" flex flex-end">
              <select
                value={sortValue}
                className="p-2 border rounded-lg w-52"
                onChange={(e) => setSortValue(e.target.value)}
              >
                <option value="">Sort by download</option>
                <option value="downloadCount">Ascending downloads</option>
                <option value="-downloadCount">Descending downloads</option>
              </select>
            </div>
            {/* Nút "Export" */}
            <Excel
              dataRow={dataForCSV}
              dataHeader={headers}
              nameExcel={"albums"}
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
                {/* {roles === "leader" ? (
                  <th className="p-3 uppercase text-sm font-medium text-gray-600">
                    <input type="checkbox" id="myCheckbox" name="myCheckbox" />
                  </th>
                ) : null} */}
                <th className="p-3 uppercase text-sm font-medium text-gray-600 w-[10rem]">
                  Image
                </th>
                <th className="p-3 uppercase text-sm font-medium text-gray-600">
                  Album Name
                </th>
                <th className="p-3 uppercase text-sm font-medium text-gray-600 ">
                  Artist
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
                  Description
                </th>
                <th className="p-3 uppercase text-sm font-medium text-gray-600">
                  Total Song
                </th>
                <th className="p-3 uppercase text-sm font-medium text-gray-600 w-[7rem]">
                  Bg - Color
                </th>
                <th className="p-3 uppercase text-sm font-medium text-gray-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.map((album, index) => (
                <tr className="odd:bg-gray-100" key={album?._id}>
                  {/* {roles === "leader" ? (
                    <th className="p-3 uppercase text-sm font-medium text-gray-600">
                      <input
                        type="checkbox"
                        id="myCheckbox"
                        name="myCheckbox"
                        onChange={}
                        checked={album.checkStatus === 1 ? true : false}
                      />
                    </th>
                  ) : null} */}
                  <td className="p-3 text-sm text-gray-800 ">
                    <img src={album?.image} alt="" className="h-16" />
                  </td>
                  <td className="p-3 text-sm text-gray-800 w-80">
                    {album?.name}
                  </td>
                  <td className="p-3 text-sm text-gray-800 w-64 max-w-[12rem] min-w-[3rem]">
                    {album?.artist.map((item) => item?.username).join(", ")}
                  </td>
                  <td className="p-3 text-sm text-gray-800 capitalize">
                    {album?.status}
                  </td>
                  <td className="p-3 text-sm text-gray-800">
                    {album?.viewCount}
                  </td>
                  <td className="p-3 text-sm text-gray-800">
                    {album?.downloadCount}
                  </td>
                  <td className="p-3 text-sm text-gray-800 w-80">
                    {album?.desc}
                  </td>
                  <td className="p-3 text-sm text-gray-800 ">
                    {album?.songs.length}
                  </td>
                  <td className="p-3 text-sm text-gray-800">
                    <input
                      type="color"
                      value={album?.bg_colour}
                      readOnly
                      className="w-20 h-6 cursor-pointer"
                    />
                  </td>
                  <td className="p-3 text-sm text-gray-800 flex space-x-2 mt-2">
                    <Link to={`/manager-album/update/${album?._id}`}>
                      <button className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-800">
                        <i className="bi bi-pencil text-lg"></i>
                      </button>
                    </Link>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => removeAlbum(album?._id, album?.name)}
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
            perPage={4}
            count={countPage}
            path="manager-album"
            theme="light"
          />
        </div>
      ) : (
        "No albums!"
      )}
    </AdminHome>
  );
};

export default ListAlbum;
