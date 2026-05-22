export type UserRole = 'Admin' | 'Editor' | 'Viewer';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}
