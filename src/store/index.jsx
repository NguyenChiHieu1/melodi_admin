import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer";

const Store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat([]),
});

export default Store;
