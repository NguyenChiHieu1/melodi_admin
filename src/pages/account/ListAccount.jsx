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

const ListAccount = () => {
  const { page = 1 } = useParams();
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
        limit: 6,
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
        <div className="flex items-center space-x-10 justify-between mb-1">
          {/* Nút "Create" */}
          <Link to="/manager-account/add">
            <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
              <i className="bi bi-plus-lg text-lg"></i>
            </button>
          </Link>

          <div className="flex items-center space-x-4">
            {/* Ô tìm kiếm */}
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
              <input
                type="text"
                placeholder="Search by username..."
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
            <div className="flex flex-end">
              <select
                value={status}
                className="p-2 border rounded-lg w-52"
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Filter by account status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="flex flex-end">
              <select
                value={roles}
                className="p-2 border rounded-lg w-52"
                onChange={(e) => setRoles(e.target.value)}
              >
                <option value="">Filter by account roles</option>
                <option value="66fbd508107a3d7571bf5570">Listener</option>
                <option value="66fba3a49365526bc7e9bd95">Artist</option>
                <option value="66fba3189365526bc7e9bd92">Leader</option>
              </select>
            </div>
            {/* Nút "Export" */}
            <Excel
              dataRow={dataForCSV}
              dataHeader={headers}
              nameExcel={"users"}
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
                  Profile Image
                </th>
                <th className="p-3 uppercase text-sm font-medium text-gray-600">
                  Username
                </th>
                <th className="p-3 uppercase text-sm font-medium text-gray-600">
                  Email
                </th>
                <th className="p-3 uppercase text-sm font-medium text-gray-600">
                  Roles
                </th>
                <th className="p-3 uppercase text-sm font-medium text-gray-600">
                  Status
                </th>
                <th className="p-3 uppercase text-sm font-medium text-gray-600">
                  Email Verified
                </th>
                <th className="p-3 uppercase text-sm font-medium text-gray-600">
                  Created Date
                </th>
                <th className="p-3 uppercase text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.map((user) => (
                <tr className="odd:bg-gray-100" key={user?._id}>
                  <td className="p-3 text-sm text-gray-800">
                    <img
                      src={user?.profile_image}
                      alt=""
                      className="w-12 object-cover"
                    />
                  </td>
                  <td className="p-3 text-sm text-gray-800">
                    {user?.username}
                  </td>
                  <td className="p-3 text-sm text-gray-800">{user?.email}</td>
                  <td className="p-3 text-sm text-gray-800 capitalize">
                    {user?.roles?.name || "N/A"}
                  </td>
                  <td className="p-3 text-sm text-gray-800 capitalize">
                    {user?.status}
                  </td>
                  <td className="p-3 text-sm text-gray-800">
                    {user?.isEmailVerified ? "Yes" : "No"}
                  </td>
                  <td className="p-3 text-sm text-gray-800">
                    {new Date(user?.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-sm text-gray-800 flex space-x-2">
                    <Link to={`/manager-account/update/${user?._id}`}>
                      <button className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-800">
                        <i className="bi bi-pencil text-lg"></i>
                      </button>
                    </Link>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => removeUser(user?._id, user?.username)}
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
            perPage={6}
            count={countPage}
            path="manager-account"
            theme="light"
          />
        </div>
      ) : (
        "No accounts found!"
      )}
    </AdminHome>
  );
};

export default ListAccount;
