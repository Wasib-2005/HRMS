import { authService } from "@/services/auth.service";
import { AuthUser, AuthSession } from "@/types/auth.types";

export type { AuthUser, AuthSession };

export const signIn = authService.signIn;
export const getSession = authService.getSession;
export const signOut = authService.signOut;
export const getMe = authService.getMe;

export default authService;
