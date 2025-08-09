import { Player } from "../../player/interfaces/player.interface";

export interface User {
  id: string;
  email: string;
  enabled: boolean;
  roles: string[];
  player: Player;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  lastName: string;
  email: string;
  dni: string;
  phoneNumber: string;
  genderType: string;
  password: string;
  confirmPassword: string;
}

