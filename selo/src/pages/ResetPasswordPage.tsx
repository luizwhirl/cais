// selo-fiea-frontend/src/pages/ResetPasswordPage.tsx

import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { LoginHeader } from "../components/LoginHeader";
import { Footer } from "../components/Footer";

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (!tokenFromUrl) {
      setError('Token de redefinição inválido ou ausente. Por favor, solicite um novo link.');
    }
    setToken(tokenFromUrl);
  }, [searchParams]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    if (!token) {
        setError('Token inválido.');
        return;
    }

    // ! Chamar a API do back-end aqui
    // Exemplo:
    // try {
    //   const response = await fetch('/api/password/reset', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ token, newPassword: password }),
    //   });
    //   // if (response.ok) ...
    // } catch (error) { ... }

    // Simulação de sucesso para o front-end:
    console.log("Redefinindo senha com o token:", token);
    setMessage('Senha redefinida com sucesso! Você será redirecionado para o login.');
    
    setTimeout(() => {
        navigate('/login');
    }, 3000); // Redireciona após 3 segundos
  };

  return (
    <>
      <LoginHeader />
      <main className="hero-bg flex items-center justify-center min-h-screen py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Redefinir sua Senha</h2>
            </div>
            
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            {message && <p className="text-green-600 text-center mb-4">{message}</p>}

            {token && !message && (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">Confirme a Nova Senha</label>
                  <input
                    type="password"
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <button type="submit" className="w-full bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-800 transition-all shadow-sm">
                    Salvar Nova Senha
                  </button>
                </div>
              </form>
            )}
            
            {!token && (
                 <Link to="/login" className="mt-6 inline-block text-blue-600 hover:underline">Voltar para o Login</Link>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}