export interface UserDto {
  id?: number
  username: string
  fullName?: string
  email: string
  phoneNumber?: string
  role: "ADMIN" | "CASHIER" | "MANAGER" | "OWNER"
  active?: boolean
}

export interface LoginRequestDto {
  username: string
  password: string
}

export interface LoginResponseDto {
  token: string
  refreshToken: string
  user: UserDto
}

export interface RegisterRequestDto {
  username: string
  password: string
  fullName?: string
  email: string
  phoneNumber?: string
  role: "ADMIN" | "CASHIER" | "MANAGER" | "OWNER"
}

export interface ForgotPasswordRequestDto {
  email: string
}

export interface ResetPasswordRequestDto {
  token: string
  newPassword: string
}
