// selo-fiea-frontend/src/pages/ForgotPasswordPage.tsx

import { useState } from "react";
import { Link } from "react-router-dom";
import { LoginHeader } from "../components/LoginHeader";
import { Footer } from "../components/Footer";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(''); 

    // ! chamar a API do back-end aqui
    // try {
    //   const response = await fetch('/api/password/forgot', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email }),
    //   });
    //   // Lógica de sucesso/erro
    // } catch (error) { ... }

    // Simulação de sucesso para o front-end:
    console.log("Solicitação de recuperação para o e-mail:", email);
    setMessage('Se uma conta com este e-mail existir em nosso sistema, um link para redefinição de senha foi enviado.');
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
                    />
                  </div>
                  <div>
                    <button type="submit" className="w-full bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-800 transition-all shadow-sm">
                      Enviar Link de Recuperação
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