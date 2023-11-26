export interface JwtSign {
  access_token: string;
  refresh_token: string;
}

export interface Payload {
  user_id: number;
  username?: string;
  roles?: string[];
}

export interface JwtPayload {
  sub: number;
  username?: string;
  roles?: string[];
}

// TODO 여기 있는게 맞나 생각해보기 user interface쪽으로?
export interface SocialUser {
  username: string;
  email: string;
  social_id: string;
  vendor: string;
}
