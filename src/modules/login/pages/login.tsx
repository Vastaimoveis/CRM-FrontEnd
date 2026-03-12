import logo from "/logo.png"
import { formatPhone } from "../utils/formatPhone";
import { useLoginForm } from "../hooks/useHooksLogin";

export default function Login() {

  const {
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
  } = useLoginForm();


  return (
    <div className="min-h-screen flex">
      {/* Lado esquerdo - Branding */}
      <div className="hidden md:flex w-1/2 bg-white items-center justify-center text-black">
        <div className="text-center px-10 place-items-center">
          <img src={logo} alt="Logo Vasta Imoveis" className="w-100" />

          <p className="text-lg opacity-80">
            CRM:
            Gerencie clientes, oportunidades e resultados em um só lugar.
          </p>
        </div>
      </div>

      {/* Lado direito - Login */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-950">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 p-8 rounded-xl shadow-lg w-96"
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
            {mode === "login" ? "Entrar" : "Criar conta"}
          </h2>

          {error && (
            <div className="mb-4 text-sm text-red-500 text-center">
              {error}
            </div>
          )}

          {/* NOME (só no cadastro) */}
          {mode === "register" && (
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">
                Nome
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          {/* TELEFONE */}
          {mode === "register" && (
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">
                Telefone
              </label>
              <input
                type="tel"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="(00) 00000-0000"
                value={phone}
                inputMode="numeric"
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                required
              />
            </div>
          )}

          {/* EMAIL */}
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">
              E-mail
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="seuemail@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* SENHA */}
          <div className="mb-6">
            <label className="block text-sm text-gray-600 mb-1">
              Senha
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* BOTÃO */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition duration-200 disabled:opacity-60"
          >
            {loading
              ? "Carregando..."
              : mode === "login"
                ? "Entrar"
                : "Solicitar cadastro"}
          </button>

          {/* TOGGLE LOGIN/CADASTRO */}
          <div className="mt-6 text-center text-sm text-gray-600">
            {mode === "login" ? (
              <>
                Não possui conta?{" "}
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className="text-blue-600 hover:underline"
                >
                  Solicitar cadastro
                </button>
              </>
            ) : (
              <>
                Já possui conta?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-blue-600 hover:underline"
                >
                  Entrar
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
