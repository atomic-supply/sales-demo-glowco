export interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
  idToken: string | undefined;
  hasIdToken: boolean;
  user: {
    id: string | null;
    name: string | null;
    email: string | null;
    picture: string | null;
    phoneNumber: string | null;
    role: string | null;
    customerId: string | null;
  } | null;
}
