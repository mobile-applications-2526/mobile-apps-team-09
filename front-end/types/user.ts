import { PlantCollectionItem } from "./profile";

export interface UserResponse {
  id: number;
  email: string;
  username: string;
  full_name: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  plants?: PlantCollectionItem[];
}

export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string | null;
}

export interface UserUpdateRequest {
    email?: string;
    username?: string;
    full_name?: string;
    password?: string;
}