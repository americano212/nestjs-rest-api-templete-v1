export interface JwtSign {
  access_token: string;
  refresh_token: string;
}

export interface Payload {
  user_id: number;
  username?: string;
  roles?: string[];
}
