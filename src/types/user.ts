export type UserType = 'guest' | 'google' | 'regular';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  title: string;
  username: string;
  userType: UserType;
  isAuthenticated: boolean;
}
