/* eslint-disable react-refresh/only-export-components */
import { createContext, useMemo, type ReactNode } from "react";
import type { AuthContextType } from "./types";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STUB_USER: AuthContextType["user"] = {
  id: "stub-user-001",
  name: "Demo User",
  email: "demo@atomic.supply",
  picture: null,
  phoneNumber: null,
  role: "USER",
  customerId: "atomic",
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const contextValue = useMemo<AuthContextType>(
    () => ({
      isLoading: false,
      isAuthenticated: true,
      error: null,
      idToken: "stub-id-token",
      hasIdToken: true,
      user: STUB_USER,
    }),
    []
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// Re-export types for convenience
export type { AuthContextType } from "./types";
