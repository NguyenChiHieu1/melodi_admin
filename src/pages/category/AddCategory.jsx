import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import AdminHome from "../../components/AdminHome";
import Spinner from "../../components/Spinner";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { url } from "../../App";

const AddCategory = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.loginToken);

  const [value, setValue] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  // Hàm validate dữ liệu nhập vào
  const validate = (category) => {
    if (!category.name || category.name.trim().length < 3) {
      toast.error(
        "Invalid category name. Name must be at least 3 characters long."
      );
      return false;
    }
    return true;
  };

  // Hàm xử lý submit form
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (validate(value)) {
        const response = await axios.post(`${url}/api/category`, value, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          toast.success("Category added successfully");
          setValue({
            name: "",
            description: "",
          });
        } else {
          toast.error("Failed to add category");
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  // Hàm xử lý thay đổi input
  const onChangeHandler = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  return (
    <AdminHome>
      {loading ? (
        <Spinner />
      ) : (
        <div className="flex items-center justify-center">
          <form
            onSubmit={onSubmitHandler}
            className="flex flex-col justify-center gap-4 w-[90%] text-white"
          >
            <div className="mb-4">
              <div className="flex items-center gap-2">
                {/* Icon quay lại */}
                <i
                  className="bi bi-arrow-left text-3xl cursor-pointer text-gray-200 hover:text-gray-400"
                  onClick={() => {
                    navigate(-1);
                  }}
                ></i>
                {/* Tiêu đề thêm danh mục */}
                <h1 className="text-xl font-medium ml-[23rem]">
                  Create New Category
                </h1>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 w-full">
              {/* Nhập tên danh mục */}
              <div className="flex flex-col gap-2">
                <p>Category Name</p>
                <input
                  name="name"
                  onChange={onChangeHandler}
                  value={value.name}
                  className="bg-transparent outline-[#834a7d] rounded-md border-2 border-gray-400 p-2.5 w-full"
                  type="text"
                  placeholder="Type category name here"
                />
              </div>

              {/* Mô tả danh mục */}
              <div className="flex flex-col gap-2.5">
                <p>Category Description</p>
                <input
                  name="description"
                  onChange={onChangeHandler}
                  value={value.description}
                  className="bg-transparent outline-[#834a7d] rounded-md border-2 border-gray-400 p-2.5 w-full"
                  type="text"
                  placeholder="Type category description here"
                />
              </div>
            </div>

            {/* Nút thêm danh mục */}
            <div className="col-span-3 flex justify-center mt-4">
              <button
                type="submit"
                className="text-base bg-[#834a7d] hover:bg-[#8d548d] text-white py-2.5 px-14 cursor-pointer rounded-md"
              >
                Add Category
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminHome>
  );
};

export default AddCategory;
