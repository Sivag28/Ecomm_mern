import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: { user: null },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      localStorage.setItem("token", action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      localStorage.clear();
    },
  },
});

export const { loginSuccess, logout } = userSlice.actions;
export default userSlice.reducer;
