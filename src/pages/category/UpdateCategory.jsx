import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import AdminHome from "../../components/AdminHome";
import Spinner from "../../components/Spinner";
import { url } from "../../App";

const UpdateCategory = () => {
  const { id } = useParams(); // Lấy ID category từ URL
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.loginToken);

  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState({
    name: "",
    description: "",
  });

  // Hàm lấy thông tin chi tiết của category từ API
  const fetchCategory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/api/category/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setCategory(response.data.data);
      } else {
        toast.error("Failed to fetch category details.");
      }
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, [id]);

  // Xử lý thay đổi giá trị của các trường trong form
  const onChangeHandler = (e) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
  };

  // Xử lý khi submit form cập nhật category
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(`${url}/api/category/${id}`, category, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        toast.success("Category updated successfully!");
        setTimeout(() => {
          navigate("/manager-category");
        }, 1000);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    <AdminHome>
      {loading ? (
        <Spinner />
      ) : (
        <div className="flex items-center justify-center">
          <form
            onSubmit={onSubmitHandler}
            className="flex flex-col justify-center gap-1 w-[90%]"
          >
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <i
                  className="bi bi-arrow-left text-3xl cursor-pointer text-gray-600 hover:text-gray-800"
                  onClick={() => navigate(-1)}
                ></i>
                <h1 className="text-2xl font-bold text-gray-800">
                  Update Category
                </h1>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p>Category Name</p>
              <input
                name="name"
                onChange={onChangeHandler}
                value={category.name}
                className="bg-transparent outline-green-600 border-2 border-gray-400 p-2 w-full"
                type="text"
                placeholder="Enter category name"
              />
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <p>Category Description</p>
              <textarea
                name="description"
                onChange={onChangeHandler}
                value={category.description}
                className="bg-transparent outline-green-600 border-2 border-gray-400 p-2 w-full"
                rows="4"
                placeholder="Enter category description"
              ></textarea>
            </div>

            <div className="col-span-3 flex justify-center mt-6">
              <button
                type="submit"
                className="text-base bg-[#834a7d] hover:bg-[#8d548d] text-white py-2 px-14 cursor-pointer rounded-md"
              >
                Update Category
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminHome>
  );
};

export default UpdateCategory;
