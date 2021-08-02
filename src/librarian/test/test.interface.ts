export interface TAccessToken {
  token_info: string;
  expireIn: string;
  role: string;
}

export interface TRefreshToken {
  refreshToken_Cookie: string;
  refreshToken: string;
}
