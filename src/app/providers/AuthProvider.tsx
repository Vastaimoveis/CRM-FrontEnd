import { createContext, useContext, useEffect, useState, type Dispatch } from "react";
import { type User } from "@/shared/types/UserTypes";
import { loginRequest } from "@/services/auth/authService";
import { mapLoginResponseToUser } from "@/services/auth/authMapper"

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  selectedUser: User | null;
  setSelectedUser: Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [visualUser, setVisualUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("accessToken");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }

    setLoading(false);
  }, []);

  async function login(email: string, password: string) {
    try {
      setLoading(true);

      const response = await loginRequest({
        email,
        password,
      });

      const user = mapLoginResponseToUser(response);

      const token = response.data.accessToken;

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
      
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.text ||
        error?.message ||
        "Erro ao realizar login"
      );
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setUser(null);
    setToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, selectedUser: visualUser, setSelectedUser: setVisualUser, loading }}>
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