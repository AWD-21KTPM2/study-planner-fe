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
  id: string
  email: string
}
