import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import bookReducer from "./slices/bookSlice";
import borrowReducer from "./slices/borrowSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    books: bookReducer,
    borrows: borrowReducer,
  },
});

export default store;
