import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import "./login.scss";
import { validateEmail, validatePassword } from "../../validate/login_register";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { url } from "../../App";
import Loading from "../loading/Loading";
import { useDispatch } from "react-redux";
import { setToken } from "../../store/reducer/authReducer";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState({
    email: "",
    password: "",
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Hàm xử lý khi thay đổi giá trị trong input
  const handleChange = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const validate = async (v) => {
    if (!validateEmail(v.email)) {
      toast.error("Invalid email");
      return false;
    }
    if (!validatePassword(v.password)) {
      toast.error("Invalid password");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setLoading(true);

    const check = await validate(value);
    if (!check) return;

    try {
      // setTimeout(() => {
      // }, 2000);
      const response = await axios.post(`${url}/api/user/login`, value);
      console.log(response.data); // Log phản hồi để kiểm tra
      if (response.data && response.data.success) {
        if (response.data.roles === "listener") {
          toast.error(
            "Your account does not have permission to access this page!!!"
          );
        } else {
          toast.success("Login success!!!");
          localStorage.setItem("token", response.data.token);
          dispatch(setToken(response.data.token));
          navigate("/manager-album");
        }
      } else {
        toast.error(response.data.message || "Login failed!");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      {loading ? (
        <Loading />
      ) : (
        <div className="login">
          <div className="login-content">
            <div className="login-main">
              <div className="login-top">
                <img src="./logo.svg" alt="Melodies Logo" />
                <h1>Molodies</h1>
              </div>
              <div className="login-form">
                <form onSubmit={handleSubmit}>
                  <h1>Login To Continue</h1>
                  <input
                    type="text"
                    name="email"
                    className="form-control email"
                    placeholder="E-Mail"
                    onChange={handleChange}
                  />
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      placeholder="Password"
                      name="password"
                      onChange={handleChange}
                    />
                    <i
                      className={`${
                        showPassword ? "bi bi-eye-slash" : "bi bi-eye"
                      } input-group-text`}
                      onClick={togglePasswordVisibility}
                    ></i>
                  </div>
                  <div className="forgot-password">
                    <span>
                      <h4>Forgot password</h4>
                      <i className="bi bi-chevron-compact-right"></i>
                    </span>
                    <button type="submit">Login</button>
                  </div>
                </form>
              </div>
              <div className="login-bottom">
                <div>
                  <img src="./devicon_google.svg" alt="Google Logo" />
                  <p>Google Login</p>
                </div>
                <div>
                  <img src="./logos_facebook.svg" alt="Facebook Logo" />
                  <p>Facebook</p>
                </div>
              </div>
            </div>
            <div className="login-sign">
              <span>
                <h2>Don't Have An Account</h2>
                <p>Sign Up Here</p>
              </span>
              <div className="sign-up">
                <Link to={"/sign-up"}>
                  <h4>Sign Up</h4>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
