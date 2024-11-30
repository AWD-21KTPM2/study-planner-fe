export interface UserDTO {
  email: string
  password: string
}

export interface LoginResponse {
  message: string
  data: {
    id: string
    email: string
    token: string
  }
}

export interface UserInformation {
  id: string
  email: string
}
