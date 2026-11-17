import apiClient from "./api.client";
import { AuthSession } from "@/types/auth.types";

export const authService = {
  signIn: (email: string, password: string) =>
    apiClient.post<AuthSession>("/auth/sign-in/email", { email, password }),

  signOut: () =>
    apiClient.post<{ success: boolean }>("/auth/sign-out"),

  getSession: () =>
    apiClient.get<AuthSession | null>("/auth/get-session"),

  getMe: () =>
    apiClient.get<AuthSession>("/me"),
};

export default authService;
