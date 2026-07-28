import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";
import { useToast } from "@/app/providers/ToastProvider";
import { validatePhone } from "@/shared/utils/validatePhone";

export function useLoginForm() {

  const [mode, setMode] = useState<"login" | "register">("login");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const { login, erro, ErrorSetter } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    ErrorSetter("");
    setLoading(true);

    try {
      if (mode === "login") {

        const success = await login(email, password);
        if (success) { 
          navigate("/funil")
         } else {
          ErrorSetter("Erro inesperado, tente novamente")
        };
      } else {

        if (!validatePhone(phone)) {
          ErrorSetter("Telefone inválido");
          return;
        }

        /*await registerUser({
          name,
          phone,
          email,
          password,
        });*/

        showToast("Solicitação enviada para aprovação do gerente!");
      }

    } catch (err: any) {
      ErrorSetter(err.message);
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
    erro,
    handleSubmit
  };
}