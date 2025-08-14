import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

// hydrate from localStorage
const user = JSON.parse(
  localStorage.getItem("user") || localStorage.getItem("user") || "null"
);
const initialState = {
  user,
  accessToken: localStorage.getItem("accessToken") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  isLoading: false,
  isError: false,
  message: "",
};

// Thunks
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const { data } = await api.post("/auth/register", userData);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      const { data } = await api.post("/auth/login", userData);
      localStorage.setItem("user", JSON.stringify(data.safeUser));
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      return data;
    } catch (err) {
      console.log(err);
      const msg = err.response?.data?.message || "Login failed";
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
    refreshSucceeded: (state, { payload }) => {
      state.accessToken = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // register
      .addCase(registerUser.pending, (s) => {
        s.isLoading = true;
        s.isError = false;
        s.message = "";
      })
      .addCase(registerUser.fulfilled, (s, { payload }) => {
        s.isLoading = false;
        s.user = payload.user;
        s.accessToken = payload.accessToken;
        s.refreshToken = payload.refreshToken;
      })
      .addCase(registerUser.rejected, (s, { payload }) => {
        s.isLoading = false;
        s.isError = true;
        s.message = payload;
      })
      // login
      .addCase(loginUser.pending, (s) => {
        s.isLoading = true;
        s.isError = false;
        s.message = "";
      })
      .addCase(loginUser.fulfilled, (s, { payload }) => {
        s.isLoading = false;
        s.user = payload.user;
        s.accessToken = payload.accessToken;
        s.refreshToken = payload.refreshToken;
      })
      .addCase(loginUser.rejected, (s, { payload }) => {
        s.isLoading = false;
        s.isError = true;
        s.message = payload;
      });
  },
});

export const { logout, refreshSucceeded } = authSlice.actions;
export default authSlice.reducer;
