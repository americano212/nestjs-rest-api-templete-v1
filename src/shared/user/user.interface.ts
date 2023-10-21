export interface User {
  user_id: number;
  username?: string | undefined;
  email: string;
  roles?: string[];
}
