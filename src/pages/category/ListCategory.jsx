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

const ListCategory = () => {
  const { page = 1 } = useParams();
  const navigate = useNavigate();

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
        <div className="flex items-center space-x-10 w-full mb-1">
          <div className="flex items-center space-x-4 justify-between w-full">
            <div className="flex items-center bg-slate-600 rounded-2xl overflow-hidden">
              <input
                type="text"
                placeholder="Search by category name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="py-2 px-4 w-80 bg-slate-600 placeholder-gray-400 text-white rounded-r-2xl h-full pl-2 focus:outline-none"
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
                    onClick={() => navigate("/manager-category/add")}
                  >
                    <p>Add new category</p>
                  </div>
                </div>
                <div className="flex justify-start items-start flex-col gap-2 text-gray-200 mb-2 border-t-2">
                  <div className="flex flex-row items-center gap-2">
                    <i className="bi bi-filter-square text-lg "></i>
                    <p className="font-bold text-white">Filter</p>
                  </div>
                  <select
                    value={sortValue}
                    className="bg-[#744a65] hover:bg-[#8f5e7e] rounded-md py-1 outline-[#834a7d]"
                    onChange={(e) => setSortValue(e.target.value)}
                  >
                    <option value="">Sort Name</option>
                    <option value="name">Name A-Z</option>
                    <option value="-name">Name Z-A</option>
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
                    nameExcel={"categories"}
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
                <th className="p-3 capitalize text-sm font-normal text-gray-300"></th>
                <th className="p-3 capitalize text-sm font-normal text-gray-300 w-[15rem]">
                  Category Name
                </th>
                <th className="p-3 capitalize text-sm font-normal text-gray-300">
                  Description
                </th>
                <th className="p-3 capitalize text-sm font-normal text-gray-300"></th>
              </tr>
            </thead>
            <tbody>
              {data?.map((category, index) => (
                <tr
                  className="text-white rounded-lg mb-2 group hover:bg-slate-700"
                  key={category?._id}
                >
                  <td className="p-3 text-sm text-white mr-2 w-20">
                    # {index + 1}
                  </td>
                  <td className="p-3 text-sm text-white">{category?.name}</td>
                  <td className="p-3 text-sm text-white">
                    {category?.description}
                  </td>
                  <td className="w-20">
                    <div className="hidden gap-3 text-sm text-white group-hover:flex space-x-2">
                      <Link to={`/manager-category/update/${category?._id}`}>
                        <button className="text-white rounded">
                          <i className="bi bi-pencil text-lg hover:text-[#EE10B0]"></i>
                        </button>
                      </Link>
                      <button
                        className="text-white rounded"
                        onClick={() =>
                          removeCategory(category?._id, category?.name)
                        }
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
            perPage={6}
            count={countPage}
            path="manager-category"
            theme="light"
          />
        </div>
      ) : (
        <p className="text-white mt-3">No categories!</p>
      )}
    </AdminHome>
  );
};

export default ListCategory;
