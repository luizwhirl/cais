// selo-fiea-frontend/src/pages/ForgotPasswordPage.tsx

import { useState } from "react";
import { Link } from "react-router-dom";
import { LoginHeader } from "../components/LoginHeader";
import { Footer } from "../components/Footer";
import { apiClient } from "../services/apiClient";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      // API REAL
      await apiClient.publicPost('/auth/forgot-password', { email });

      console.log("Solicitação de recuperação para o e-mail:", email);
      setMessage('Se uma conta com este e-mail existir em nosso sistema, um link para redefinição de senha foi enviado.');
    } catch (err: any) {
      console.error("Erro ao solicitar recuperação:", err);
      setError(err.message || 'Erro ao processar a solicitação.');
      // Mesmo em caso de erro, exibimos a mensagem padrão para não vazar informações
      setMessage('Se uma conta com este e-mail existir em nosso sistema, um link para redefinição de senha foi enviado.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <LoginHeader />
      <main className="hero-bg flex items-center justify-center min-h-screen py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
            {message ? (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Verifique seu E-mail</h2>
                <p className="text-gray-600">{message}</p>
                <Link to="/login" className="mt-6 inline-block text-blue-600 hover:underline">Voltar para o Login</Link>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Recuperar Senha</h2>
                  <p className="text-gray-500 mt-1">Digite seu e-mail para receber o link de redefinição.</p>
                </div>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="seu@email.com"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <button type="submit" className="w-full bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-800 transition-all shadow-sm" disabled={isLoading}>
                      {isLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}