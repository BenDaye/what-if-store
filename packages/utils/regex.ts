
export const commonRegex = {
  username: /^[a-zA-Z0-9_-]{8,32}$/,
  password: /^.*(?=.{8,32})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[.-_!@#$%^&*?]).*$/,
  address: /^T[a-zA-Z0-9]{33}$/,

} as const