export interface User {
  user_id: number;
  username?: string | undefined;
  roles?: string[];
}

export interface SNSUser {
  username: string;
  email: string;
  social_id: string;
  vendor: string;
}
