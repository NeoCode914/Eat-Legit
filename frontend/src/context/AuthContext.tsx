import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import api from "../api/axios";
import type {
  AuthEntity,
  User,
  FoodPartner,
  UserAuthResponse,
  PartnerAuthResponse,
  UserSignupInput,
  UserLoginInput,
  PartnerSignupInput,
  PartnerLoginInput,
} from "../types";
import { LS_TOKEN_KEY, LS_AUTH_KEY } from "../types";

// ─── Context Shape ────────────────────────────────────────────────────────────

interface AuthContextValue {
  auth: AuthEntity | null;
  isLoading: boolean;
  signUpUser: (input: UserSignupInput) => Promise<User>;
  signInUser: (input: UserLoginInput) => Promise<User>;
  signUpPartner: (input: PartnerSignupInput) => Promise<FoodPartner>;
  signInPartner: (input: PartnerLoginInput) => Promise<FoodPartner>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Helper: persist auth to localStorage ────────────────────────────────────

function persistAuth(token: string, entity: AuthEntity): void {
  localStorage.setItem(LS_TOKEN_KEY, token);
  localStorage.setItem(LS_AUTH_KEY, JSON.stringify(entity));
}

function clearAuth(): void {
  localStorage.removeItem(LS_TOKEN_KEY);
  localStorage.removeItem(LS_AUTH_KEY);
}

function readAuth(): AuthEntity | null {
  try {
    const raw = localStorage.getItem(LS_AUTH_KEY);
    return raw ? (JSON.parse(raw) as AuthEntity) : null;
  } catch {
    return null;
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthEntity | null>(readAuth);
  const [isLoading, setIsLoading] = useState(false);

  const signUpUser = useCallback(async (input: UserSignupInput): Promise<User> => {
    setIsLoading(true);
    try {
      const { data } = await api.post<UserAuthResponse>("/api/auth/user/register", {
        username: input.username,
        email: input.email,
        password: input.password,
      });
      const entity: AuthEntity = { type: "user", data: data.user };
      // Backend now returns token in body for interceptor use
      persistAuth(data.token, entity);
      setAuth(entity);
      return data.user;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signInUser = useCallback(async (input: UserLoginInput): Promise<User> => {
    setIsLoading(true);
    try {
      const { data } = await api.post<UserAuthResponse>("/api/auth/user/login", {
        email: input.email,
        password: input.password,
      });
      const entity: AuthEntity = { type: "user", data: data.user };
      persistAuth(data.token, entity);
      setAuth(entity);
      return data.user;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signUpPartner = useCallback(
    async (input: PartnerSignupInput): Promise<FoodPartner> => {
      setIsLoading(true);
      try {
        const { data } = await api.post<PartnerAuthResponse>(
          "/api/auth/food-partner/register",
          {
            name: input.name,
            email: input.email,
            password: input.password,
          }
        );
        const entity: AuthEntity = { type: "partner", data: data.user };
        persistAuth(data.token, entity);
        setAuth(entity);
        return data.user;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const signInPartner = useCallback(
    async (input: PartnerLoginInput): Promise<FoodPartner> => {
      setIsLoading(true);
      try {
        const { data } = await api.post<PartnerAuthResponse>(
          "/api/auth/food-partner/login",
          {
            email: input.email,
            password: input.password,
          }
        );
        const entity: AuthEntity = { type: "partner", data: data.user };
        persistAuth(data.token, entity);
        setAuth(entity);
        return data.user;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async (): Promise<void> => {
    try {
      if (auth?.type === "partner") {
        await api.get("/api/auth/food-partner/logout");
      } else {
        await api.get("/api/auth/user/logout");
      }
    } finally {
      clearAuth();
      setAuth(null);
    }
  }, [auth]);

  return (
    <AuthContext.Provider
      value={{ auth, isLoading, signUpUser, signInUser, signUpPartner, signInPartner, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
