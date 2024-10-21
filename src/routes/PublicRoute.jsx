import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const PublicRoute = () => {
  const loginToken = useSelector((state) => state.auth.loginToken);

  return loginToken ? <Navigate to="/manager-album" /> : <Outlet />;
};

export default PublicRoute;
