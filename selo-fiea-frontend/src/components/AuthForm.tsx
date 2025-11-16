// selo-fiea-frontend/src/components/AuthForm.tsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiClient } from "../services/apiClient"; // Importa o cliente de API

export function AuthForm() {
  const navigate = useNavigate();
  
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLoginSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Usa o cliente de API público para fazer login
      const data = await apiClient.publicPost('/auth/login', {
        email: loginEmail,
        password: loginPassword,
      });

      // Assumindo que a API retorna um 'token' e um 'user'
      localStorage.setItem('authToken', data.token);
      
      // Opcional: Salvar dados do usuário para fácil acesso
      localStorage.setItem('user', JSON.stringify(data.user));

      console.log('Login bem-sucedido!', data.user);

      // Redireciona com base na role (ajuste 'data.user.role' conforme sua API)
      if (data.user.role === 'admin' || data.user.role === 'gestor') {
        navigate('/dashboard');
      } else if (data.user.role === 'industry' || data.user.role === 'empresa') {
        navigate('/industry/dashboard');
      } else {
        // Fallback
        navigate('/');
      }

    } catch (error: any) {
      console.error('Falha no login:', error);
      setErrorMessage(error.message || "E-mail ou senha inválidos. Verifique seus dados e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
        
        <div>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Acessar Portal</h2>
            <p className="text-gray-500 mt-1">Bem-vindo de volta!</p>
          </div>
          <form onSubmit={handleLoginSubmit}>
            {errorMessage && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
                <span className="block sm:inline">{errorMessage}</span>
              </div>
            )}
            <div className="mb-4">
              <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input 
                type="email" 
                id="login-email" 
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                placeholder="email@empresa.com.br" 
                required 
                disabled={isLoading}
              />
            </div>
            <div className="mb-6">
              <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <input 
                type="password" 
                id="login-password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                placeholder="••••••••" 
                required
                 disabled={isLoading}
              />
            </div>
            <div className="flex items-center justify-end mb-6">
              <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:underline">
                Esqueceu sua senha?
              </Link>
            </div>
            <div>
              <button type="submit" className="w-full bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-800 transition-all shadow-sm disabled:bg-blue-400" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
              </button>
            </div>
            
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">Não tem uma conta de indústria? 
                <Link to="/register" className="font-medium text-blue-600 hover:underline">
                  Cadastre-se
                </Link>
              </p>
            </div>
          </form>
        </div>

        
      </div>
      <p className="text-center text-gray-500 text-sm mt-6">
        Ao acessar o portal você concorda com nossos <a href="#" className="text-blue-600 hover:underline">Termos de Serviço</a>.
      </p>
    </div>
  );
}