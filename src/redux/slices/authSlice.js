import { createSlice } from "@reduxjs/toolkit";
const userFromStorage = JSON.parse(localStorage.getItem('user'));
const tokenFromStorage = localStorage.getItem('token');

const initialState = {
  isAuthenticated: !!tokenFromStorage,
  user: userFromStorage || null,
  token: tokenFromStorage || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signIn: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    signOut: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});

export const { signIn, signOut } = authSlice.actions;

export default authSlice.reducer;

export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
