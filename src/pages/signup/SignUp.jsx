import React, { useState } from "react";
import "./signup.scss";
import { Link, useNavigate } from "react-router-dom";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "../../validate/login_register";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { url } from "../../App";
import Loading from "../loading/Loading";
import { useDispatch } from "react-redux";

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(true);
  const [loading, setLoading] = useState(false);

  // const [showPhone, setShowPhone] = useState(false);
  const [value, setValue] = useState({
    username: "",
    email: "",
    password: "",
    roles: "66fba3a49365526bc7e9bd95",
  });
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // const togglePhoneVisibility = () => {
  //   setShowPhone(!showPhone);
  // };

  const validate = (v) => {
    if (!validateName(v.username)) {
      toast.error("Login name must be greater than 3 characters");
      return false;
    }

    if (!validateEmail(v.email)) {
      toast.error("Invalid email");
      return false;
    }
    if (!validatePassword(v.password)) {
      toast.error(
        "Password must contain numbers and special characters and must be longer than 6 characters!!!"
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (validate(value)) {
        const response = await axios.post(`${url}/api/user/register`, value);
        if (response.data && response.data.success) {
          setLoading(true);
        } else {
          toast.error(response.data.message || "Sign in failed!");
        }
        // toast.success("Khonog loi");
        // console.log(value);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        // Đảm bảo message hiển thị đúng thông báo lỗi từ backend
        console;
        toast.error(error.response.data.message || "Sign up failed!");
      } else {
        // Nếu không có phản hồi từ server, hiển thị lỗi chung
        toast.error("Something went wrong, please try again.");
      }
    }
  };
  return loading ? (
    <Loading
      time={3000}
      route={"/login"}
      notification="Thank you for registering an account, please log in to use the Melodies website. !!!"
    />
  ) : (
    <div className="signup">
      <div className="signup-content">
        <div className="signup-top">
          <img src="./logo.svg" alt="Melodies Logo" className="logo" />
          <h1>Melodies</h1>
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="return-icon">
            <i
              className="bi bi-arrow-left"
              onClick={() => {
                navigate(-1);
              }}
            ></i>
            <h1>Sign In To Continue</h1>
            <ToastContainer />
          </div>

          <input
            type="text"
            className="form-control no-group"
            placeholder="Name"
            name="username"
            onChange={(e) =>
              setValue({ ...value, [e.target.name]: e.target.value })
            }
          />

          <input
            type="email"
            className="form-control no-group"
            placeholder="E-Mail"
            name="email"
            onChange={(e) =>
              setValue({ ...value, [e.target.name]: e.target.value })
            }
          />

          <div className="input-group">
            <input
              type={showPassword ? "password" : "text"}
              className="form-control"
              placeholder="Password"
              name="password"
              onChange={(e) =>
                setValue({ ...value, [e.target.name]: e.target.value })
              }
            />
            <i
              className={`${
                showPassword ? "bi bi-eye-slash" : "bi bi-eye"
              } input-group-text`}
              onClick={togglePasswordVisibility}
            ></i>
          </div>

          {/* <div className="input-group">
            <input
              type={showPhone ? "password" : "text"}
              className="form-control"
              placeholder="Phone Number"
            />
            <i
              className={`${
                showPhone ? "bi bi-eye-slash" : "bi bi-eye"
              } input-group-text`}
              onClick={togglePhoneVisibility}
            ></i>
          </div> */}

          <div className="button-register">
            <button type="submit" className="btn-signup">
              Create an account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
