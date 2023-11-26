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

// TODO Payload로 통합하는 방향 생각해보기
export interface SocialUser {
  username: string;
  email: string;
  social_id: string;
  vendor: string;
}
