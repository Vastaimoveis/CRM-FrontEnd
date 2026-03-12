import { createContext, useContext, useEffect, useState } from "react";
import { UserRoles, type User } from "@/shared/types/UserTypes";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }

    setLoading(false);
  }, []);

const users = [
  {
    id: "1",
    name: "Gerente Lorenzo",
    email: "gerente@crm.com",
    password: "123456",
    role: UserRoles.GERENTE
  },
  {
    id: "2",
    name: "Corretor Lorenzo",
    email: "corretor@crm.com",
    password: "654321",
    role: UserRoles.CORRETOR
  }
];

  async function login(email: string, password: string) {
    // MOCK TEMPORÁRIO

    if ((email === "gerente@crm.com" && password === "123456") || (email === "corretor@crm.com" && password === "654321")) {
      const fakeUser = users.find(user => user.email === email);

      if (!fakeUser) {
        throw new Error("Usuário não encontrado");
      }
      const fakeToken = "mock-jwt-token-123";

      setUser(fakeUser);
      console.log(user)
      setToken(fakeToken);

      localStorage.setItem("user", JSON.stringify(fakeUser));
      localStorage.setItem("token", fakeToken);
    } else {
      throw new Error("Credenciais inválidas");
    }
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
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