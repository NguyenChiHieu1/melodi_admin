import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const token = verifyToken("token");
const authReducer = createSlice({
  name: "auth",
  initialState: {
    loginToken: token,
    loginInfo: token ? safeJwtDecode(token) : null,
  },
  reducers: {
    setToken: (state, action) => {
      state.loginToken = action.payload;
      state.loginInfo = jwtDecode(action.payload);
    },
    logout: (state, action) => {
      localStorage.removeItem(action.payload);
      state.loginToken = null;
      state.loginInfo = null;
    },
  },
});

function verifyToken(keyName) {
  const storage = localStorage.getItem(keyName);
  if (storage) {
    const decodeToken = jwtDecode(storage);
    // console.log("decodeToken:", decodeToken);
    const expiresIn = new Date(decodeToken.exp * 1000);
    if (new Date() > expiresIn) {
      localStorage.removeItem(keyName);
      return null;
    } else {
      return storage;
    }
  } else {
    return null;
  }
}

// Hàm an toàn để decode token
function safeJwtDecode(token) {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Lỗi khi decode token:", error);
    return null; // Trả về null nếu token không hợp lệ
  }
}

export const { setToken, logout } = authReducer.actions;
export default authReducer.reducer;
