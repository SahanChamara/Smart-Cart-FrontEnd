import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { LoginRequestDto, LoginResponseDto, UserDto } from "@/types/auth";
import { loginUser } from "@/services/authService";

type AuthState = {
  user: UserDto | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const loginUserAPI = createAsyncThunk<
  LoginResponseDto,
  LoginRequestDto,
  {
    rejectValue: {
      message: string;
      error: string;
    };
  }
>("loginUserAPI", async (credentials: LoginRequestDto, { rejectWithValue }) => {
  try {
    const response = await loginUser(credentials);
    console.log("Login Response ->> ",response);

    if (response.success && response.data) {
      localStorage.setItem('user', String(response.data.user.id ?? ""));
      localStorage.setItem("secure_access", response.data.token);
      return response.data;
    }

    // Handle API-level errors (success: false but with 200 status)
    return rejectWithValue({
      message: response.message ?? response.result ?? "Login failed",
      error: response.error ?? "Unknown error",
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return rejectWithValue({
      message: "Login Falied..please try again",
      error: error.response?.data ?? error.message,
    });
  }
});

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    /*     login: (state, action: PayloadAction<LoginResponseDto>) => {
          state.user = action.payload.user
          state.token = action.payload.token
          state.isAuthenticated = true
        }, */
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    /*     updateUser: (state, action: PayloadAction<UserDto>) => {
          state.user = action.payload
        }, */
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUserAPI.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        loginUserAPI.fulfilled,
        (state, action: PayloadAction<LoginResponseDto>) => {
          state.loading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.refreshToken = action.payload.refreshToken ?? null;
          state.isAuthenticated = true;
        }
      )
      .addCase(loginUserAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message ?? "Login Failed";
        state.isAuthenticated = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
