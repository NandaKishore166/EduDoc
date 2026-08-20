export type UserRole = "student" | "faculty" | "admin";

export interface AppUser {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  role: UserRole;
  createdAt?: Date;
}