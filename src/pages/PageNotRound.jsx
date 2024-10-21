import React from "react";
import { Link, useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-800">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-gray-600">
          Trang Không Tìm Thấy.
        </h2>
        <p className="mt-2 text-gray-500">
          Trang bạn đang tìm kiếm không tồn tại.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="inline-block mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Trở lại
        </button>
      </div>
    </div>
  );
};

export default PageNotFound;
