export interface JwtSign {
  accessToken: string;
  refreshToken: string;
}

export interface Payload {
  userId: number;
  username?: string;
  roles?: RoleName[];
}

export interface JwtPayload {
  sub: number;
  username?: string;
  roles?: RoleName[];
}

export interface RoleName {
  roleName: string;
}
