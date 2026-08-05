import { createContext, useCallback, useContext, useEffect, useMemo, useState, type Dispatch } from "react";
import { UserRoles, type User } from "@/shared/types/UserTypes";
import { loginRequest } from "@/services/auth/authService";
import { mapLoginResponseToUser } from "@/services/auth/authMapper"
import useRequestLock from "@/shared/utils/useRequestLock";
import { SYSTEM_ROLES } from "@/services/roles/roleTypes";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  visualUser: User | null;
  setVisualUser: Dispatch<React.SetStateAction<User | null>>;
  requestUser: User | null;
  logout: () => void;
  loading: boolean;
  erro: string;
  ErrorSetter: (text: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [visualUser, setVisualUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const runLockLogin = useRequestLock();

 const CAN_SWITCH_USER_ROLES: SYSTEM_ROLES[] = [ SYSTEM_ROLES.ADMIN, SYSTEM_ROLES.GERENTE, ];
  const canSwitchUser = useMemo(() => {

    const roleName =
      user?.role?.name; return roleName ?
        CAN_SWITCH_USER_ROLES
          .includes(roleName) : false;
  }
    , [user]);

  const requestUser = useMemo(() => {
    if (canSwitchUser && visualUser) {
      return visualUser;
    }
    return user;
  }, [canSwitchUser, visualUser, user]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("accessToken");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (visualUser) {
      localStorage.setItem("visualUser", JSON.stringify(visualUser));
    } else {
      localStorage.removeItem("visualUser");
    }
  }, [visualUser]);

  function ErrorSetter(text: string) {
    setErro(text);
  }

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const success =
        runLockLogin(async () => {
          setLoading(true);
          const response = await loginRequest({
            email,
            password,
          });

          if (!response.success || !response.data) {
            console.log(response);
            setErro(response.text);
            return false;
          }
          console.log(response.data);
          const user = mapLoginResponseToUser(response.data);

          const token = response.data.accessToken;
          console.log(response.data)
          setUser(user);
          setToken(token);

          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem(
            "accessToken",
            token
          );

          localStorage.setItem(
            "refreshToken",
            response.data.refreshToken
          );


          return response.success
        })
      return success;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.text ||
        error?.message ||
        "Erro ao realizar login"
      );
    } finally {
      setLoading(false);
    }
  }, [
    setLoading,
    loginRequest,
    mapLoginResponseToUser,
    setUser,
    setToken,
    localStorage,
    Error,
  ])

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setVisualUser(null);

    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("visualUser");
  }, [setUser, setToken, setVisualUser, localStorage]);

  useEffect(() => {
    if (location.pathname === "/login") {
      logout();
    }
  }, [location.pathname, logout]);


  const value = useMemo(() => ({
    user, token, login, ErrorSetter, erro, logout, visualUser, setVisualUser, requestUser, loading
  }), [user, token, login, ErrorSetter, erro, logout, visualUser, setVisualUser, requestUser, loading])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}