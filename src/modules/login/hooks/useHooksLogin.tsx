import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";
import { useToast } from "@/app/providers/ToastProvider";
import { validatePhone } from "../utils/validatePhone";
import { registerUser } from "../services/authService";

export function useLoginForm() {

  const [mode, setMode] = useState<"login" | "register">("login");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      if (mode === "login") {

        await login(email, password);
        navigate("/funil");

      } else {

        if (!validatePhone(phone)) {
          setError("Telefone inválido");
          return;
        }

        await registerUser({
          name,
          phone,
          email,
          password,
        });

        showToast("Solicitação enviada para aprovação do gerente!");
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return {
    mode,
    setMode,

    name,
    setName,

    phone,
    setPhone,

    email,
    setEmail,

    password,
    setPassword,

    loading,
    error,

    handleSubmit
  };
}