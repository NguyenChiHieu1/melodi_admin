import React, { useEffect } from "react";
import "./loading.scss"; // Import file SCSS
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const Loading = ({ time, route, notification }) => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log(time, route);
    if (time && route) {
      toast.success(notification);
      setTimeout(() => {
        navigate(`${route}`);
      }, time);
    }
  }, [time, route]);

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <ToastContainer />
        <img src="./logo.svg" alt="Melodies Logo" className="logo" />
        <div>
          <div className="loading-text">Loading</div>
          <img
            src="./loading.svg"
            alt="Loading Spinner"
            className="loading-spinner"
          />
        </div>
      </div>
    </div>
  );
};

export default Loading;
