import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { LoginResponseDto, UserDto } from "@/types/auth"

type AuthState = {
  user: UserDto | null
  token: string | null
  isAuthenticated: boolean
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
}

export const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<LoginResponseDto>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
    },
    updateUser: (state, action: PayloadAction<UserDto>) => {
      state.user = action.payload
    },
  },
})

export const { login, logout, updateUser } = auth.actions
export default auth.reducer
