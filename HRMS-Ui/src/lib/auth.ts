export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
}

export interface AuthSession {
  session: {
    id: string;
    userId: string;
    expiresAt: string;
  };
  user: AuthUser;
}

interface AuthErrorResponse {
  message?: string;
  error?: {
    message?: string;
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

const requestAuth = async <T>(
  path: string,
  init?: RequestInit,
): Promise<T> => {
  const response = await fetch(`${API_URL}/api/auth${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as AuthErrorResponse;
    throw new Error(
      body.error?.message ?? body.message ?? "Authentication request failed",
    );
  }

  return (await response.json()) as T;
};

export const signIn = (email: string, password: string) =>
  requestAuth<AuthSession>("/sign-in/email", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const getSession = () =>
  requestAuth<AuthSession | null>("/get-session");

export const signOut = () =>
  requestAuth<{ success: boolean }>("/sign-out", { method: "POST" });
