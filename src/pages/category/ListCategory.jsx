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

const ListCategory = () => {
  const { page = 1 } = useParams();
  const [countPage, setCountPage] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [sortValue, setSortValue] = useState("");

  const token = useSelector((state) => state.auth.loginToken);

  const fetchCategories = async () => {
    try {
      const params = {
        ...(search && { name: search }),
        ...(sortValue && { sort: sortValue }),
        page: page,
        limit: 6,
      };

      const queryParams = new URLSearchParams(params);
      const response = await axios.get(
        `${url}/api/category/categories?${queryParams.toString()}`
      );
      if (response.data.success) {
        setData(response.data.data);
        setCountPage(response.data.counts);
      }
    } catch (error) {
      toast.error("Error Occur");
    }
  };

  const removeCategory = async (id, name) => {
    try {
      if (window.confirm(`Bạn có xác nhận muốn xóa danh mục "${name}"?`)) {
        setLoading(true);
        const response = await axios.delete(`${url}/api/category/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          toast.success(response.data.message);
          setLoading(false);
          await fetchCategories();
        }
        setLoading(false);
      }
    } catch (error) {
      toast.error("Error Occur");
    }
  };

  const onSearch = async () => {
    setLoading(true);
    fetchCategories().finally(() => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    fetchCategories().finally(() => setLoading(false));
  }, [sortValue, page]);

  const headers = ["STT", "Category Name", "Description"];
  const dataForCSV =
    data?.map((category, index) => ({
      index: index + 1,
      name: category?.name || "",
      description: category?.description || "",
    })) || [];

  return (
    <AdminHome>
      <ScreenHeader>
        <div className="flex items-center space-x-10 justify-between mb-1">
          <Link to="/manager-category/add">
            <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
              <i className="bi bi-plus-lg text-lg"></i>
            </button>
          </Link>

          <div className="flex items-center space-x-4">
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
              <input
                type="text"
                placeholder="Search by category name..."
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
              value={sortValue}
              className="p-2 border rounded-lg w-44 "
              onChange={(e) => setSortValue(e.target.value)}
            >
              <option value="">Sort Name</option>
              <option value="name">Name A-Z</option>
              <option value="-name">Name Z-A</option>
            </select>

            <Excel
              dataRow={dataForCSV}
              dataHeader={headers}
              nameExcel={"categories"}
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
                  STT
                </th>
                <th className="p-3 uppercase text-sm font-medium text-gray-60 w-[15rem]">
                  Category Name
                </th>
                <th className="p-3 uppercase text-sm font-medium text-gray-600">
                  Description
                </th>
                <th className="p-3 uppercase text-sm font-medium text-gray-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.map((category, index) => (
                <tr className="odd:bg-gray-100" key={category?._id}>
                  <td className="p-3 text-sm text-gray-800">{index + 1}</td>
                  <td className="p-3 text-sm text-gray-800">
                    {category?.name}
                  </td>
                  <td className="p-3 text-sm text-gray-800">
                    {category?.description}
                  </td>
                  <td className="p-3 text-sm text-gray-800 flex space-x-2 mt-2">
                    <Link to={`/manager-category/update/${category?._id}`}>
                      <button className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-800">
                        <i className="bi bi-pencil text-lg"></i>
                      </button>
                    </Link>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() =>
                        removeCategory(category?._id, category?.name)
                      }
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
            path="manager-category"
            theme="light"
          />
        </div>
      ) : (
        "No categories!"
      )}
    </AdminHome>
  );
};

export default ListCategory;
