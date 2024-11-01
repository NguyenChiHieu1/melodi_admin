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

const ListAccount = () => {
  const { page = 1 } = useParams();
  const navigate = useNavigate();
  const [countPage, setCountPage] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sortValue, setSortValue] = useState("");
  const [roles, setRoles] = useState("");

  const token = useSelector((state) => state.auth.loginToken);

  const fetchUsers = async () => {
    try {
      const params = {
        ...(search && { username: search }),
        ...(status && { status: status }),
        ...(sortValue && { sort: sortValue }),
        ...(roles && { roles: roles }),
        page: page,
        limit: 5,
      };

      const queryParams = new URLSearchParams(params);
      const response = await axios.get(
        `${url}/api/user/?${queryParams.toString()}`
      );
      if (response.data.success) {
        setData(response.data.data);
        setCountPage(response.data.counts);
      }
    } catch (error) {
      toast.error("Error Occurred");
    }
  };

  const removeUser = async (id, username) => {
    try {
      if (window.confirm(`Bạn có xác nhận muốn xóa tài khoản "${username}"?`)) {
        setLoading(true);
        const response = await axios.delete(`${url}/api/user/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          toast.success(response.data.message);
          setLoading(false);
          await fetchUsers();
        }
        setLoading(false);
      }
    } catch (error) {
      toast.error("Error Occurred");
      setLoading(false);
    }
  };

  const onSearch = async () => {
    setLoading(true);
    fetchUsers().finally(() => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    fetchUsers().finally(() => setLoading(false));
  }, [status, sortValue, page, roles]);

  // Data for exporting to Excel
  const headers = [
    "STT",
    "Username",
    "Email",
    "Roles",
    "Status",
    "Date Created",
    "Email Verified",
  ];

  const dataForCSV =
    data?.map((user, index) => ({
      index: index + 1,
      username: user?.username || "",
      email: user?.email || "",
      roles: user?.roles?.name || "",
      status: user?.status || "",
      createdAt: user?.createdAt || "",
      isEmailVerified: user?.isEmailVerified ? "Yes" : "No",
    })) || [];

  return (
    <AdminHome>
      <ScreenHeader>
        <div className="flex items-center space-x-10 mb-1 w-full">
          {/* Nút "Create" */}

          <div className="flex items-center space-x-4 justify-between w-full">
            {/* Ô tìm kiếm */}
            <div className="flex items-center bg-slate-600 rounded-2xl overflow-hidden">
              <input
                type="text"
                placeholder="Search by user name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="py-2 px-4 w-80 text-white bg-slate-600 placeholder-gray-400 rounded-r-2xl h-full pl-2 focus:outline-none"
              />
              <div
                className="px-3 py-1 bg-slate-600 cursor-pointer hover:bg-slate-500" // Thay đổi màu nền khi hover
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
                    onClick={() => navigate("/manager-account/add")}
                  >
                    <p>Add new account</p>
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
                    <option value="">Filter by account status</option>
                    <option value="pending">Status Pending</option>
                    <option value="approved">Status Approved</option>
                    <option value="rejected">Status Rejected</option>
                  </select>
                  <select
                    value={roles}
                    className=" bg-[#744a65] w-full hover:bg-[#8f5e7e] rounded-md py-1 outline-[#834a7d]"
                    onChange={(e) => setRoles(e.target.value)}
                  >
                    <option value="">Filter by account roles</option>
                    <option value="66fbd508107a3d7571bf5570">
                      Roles Listener
                    </option>
                    <option value="66fba3a49365526bc7e9bd95">
                      Roles Artist
                    </option>
                    <option value="66fba3189365526bc7e9bd92">
                      Roles Leader
                    </option>
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
                    nameExcel={"users"}
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
          <div className="flex flex-row justify-start gap-2">
            {/* <i classname="bi bi-card-text text-white text-xl"></i> */}
            {/* <p className="text-white text-2xl ">List account</p> */}
          </div>
          <table className="w-full rounded-md">
            <thead>
              <tr className="border-b border-gray-500 text-left ">
                <th className="p-3 capitalize text-sm font-normal text-gray-300"></th>
                <th className="p-3 capitalize text-sm font-normal text-gray-300"></th>
                <th className="p-3 capitalize text-sm font-normal text-gray-300">
                  Roles
                </th>
                <th className="p-3 capitalize text-sm font-normal text-gray-300">
                  Status
                </th>
                <th className="p-3 capitalize text-sm font-normal text-gray-300">
                  Email Verified
                </th>
                <th className="p-3 capitalize text-sm font-normal text-gray-300">
                  Created Date
                </th>
                <th className="p-3 capitalize text-sm font-normal text-gray-300 w-2"></th>
              </tr>
            </thead>
            <tbody>
              {data?.map((user, index) => (
                <tr
                  className="text-white rounded-lg mb-2 group hover:bg-slate-700"
                  key={user?._id}
                >
                  <td className="p-3 text-sm text-white mr-2"># {index + 1}</td>
                  <td className="p-3 text-sm text-white flex flex-row items-center gap-2">
                    <img
                      src={
                        user?.profile_image
                          ? user?.profile_image
                          : "https://res.cloudinary.com/dr3f3acgx/image/upload/v1724351609/duxt59vn98gdxqcllctt.jpg"
                      }
                      alt=""
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex flex-col justify-center">
                      <p className="font-bold">{user?.username}</p>
                      <p className="text-gray-300">{user?.email}</p>
                    </div>
                  </td>
                  <td className="p-3 text-sm text-white capitalize">
                    {user?.roles?.name || "N/A"}
                  </td>
                  <td className="p-3 text-sm text-white capitalize">
                    {user?.status}
                  </td>
                  <td className="p-3 text-sm text-white">
                    {user?.isEmailVerified ? "Yes" : "No"}
                  </td>
                  <td className="p-3 text-sm text-white">
                    {new Date(user?.createdAt).toLocaleDateString()}
                  </td>
                  <td className="w-20">
                    <div className="hidden gap-3 text-sm text-white group-hover:flex space-x-2 ">
                      <Link to={`/manager-account/update/${user?._id}`}>
                        <button className=" text-white rounded ">
                          <i className="bi bi-pencil text-lg hover:text-[#EE10B0]"></i>
                        </button>
                      </Link>
                      <button
                        className=" text-white rounded "
                        onClick={() => removeUser(user?._id, user?.username)}
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
            path="manager-account"
            theme="light"
          />
        </div>
      ) : (
        <p className="text-white mt-3">No accounts found!</p>
      )}
    </AdminHome>
  );
};

export default ListAccount;
