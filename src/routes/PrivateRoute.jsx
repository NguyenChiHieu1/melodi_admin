import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const loginToken = useSelector((state) => state.auth.loginToken);

  return loginToken ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
