// Interface for the data sent during login
export interface UserDTO {
  email: string
  password: string
}

// Interface for the response received from the login API
export interface LoginResponse {
  data: {
    id: string
    email: string
    accessToken: string
    refreshToken: string
  }
  message: string
}

// Interface for user information after login
export interface UserInformation {
  id?: string
  name?: string
  email?: string
  phone?: string
  country?: string
  bio?: string
}

export interface DecodedJwtToken {
  id: string
  email: string
  iat: number
  exp: number
}

export interface JwtRefreshDTO {
  id: string
  email: string
  accessToken: string
  refreshToken: string
}
