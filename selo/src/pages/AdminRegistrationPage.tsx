// selo-fiea-frontend/src/pages/AdminRegistrationPage.tsx

import { useState } from "react";
import { Link } from "react-router-dom";
import { LoginHeader } from "../components/LoginHeader";
import { Footer } from "../components/Footer";
import { CheckCircle2, XCircle } from "lucide-react";

export function AdminRegistrationPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [policy, setPolicy] = useState({
    minLength: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  const validatePassword = (pass: string) => {
    const minLength = pass.length >= 8;
    const uppercase = /[A-Z]/.test(pass);
    const lowercase = /[a-z]/.test(pass);
    const number = /[0-9]/.test(pass);
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    setPolicy({ minLength, uppercase, lowercase, number, specialChar });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    const isPolicyMet = Object.values(policy).every(Boolean);
    if (!isPolicyMet) {
      setError('A senha não atende a todos os critérios de segurança.');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      setIsLoading(false);
      return;
    }

    // ! Chamar a API de cadastro do back-end aqui
    console.log("Tentativa de cadastro com:", { name, email, phone, password });

    // Simulação de chamada de API
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Exemplo de mensagem de sucesso
    setMessage('Cadastro realizado com sucesso!');

    // Exemplo de como lidar com erro (ex: e-mail já existe)
    // setError('Este e-mail já está em uso. Tente outro.');

    setIsLoading(false);
  };

  const PolicyItem = ({ met, text }: { met: boolean; text: string }) => (
    <li className={`flex items-center ${met ? 'text-green-600' : 'text-gray-500'}`}>
      {met ? <CheckCircle2 size={16} className="mr-2" /> : <XCircle size={16} className="mr-2" />}
      {text}
    </li>
  );

  return (
    <>
      <LoginHeader />
      <main className="hero-bg flex items-center justify-center min-h-screen py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Cadastrar Administrador</h2>
              <p className="text-gray-500 mt-1">Preencha seus dados para criar uma conta.</p>
            </div>
            {message && !error && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
                <span className="block sm:inline">{message}</span>
              </div>
            )}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Seu nome completo" required disabled={isLoading} />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="seu@email.com.br" required disabled={isLoading} />
              </div>
              <div className="mb-4">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Telefone (Opcional)</label>
                <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="(XX) XXXXX-XXXX" disabled={isLoading} />
              </div>
              <div className="mb-4 text-sm">
                <ul className="space-y-1">
                  <PolicyItem met={policy.minLength} text="A senha deve conter pelo menos 8 caracteres" />
                  <PolicyItem met={policy.uppercase} text="Uma letra maiúscula" />
                  <PolicyItem met={policy.lowercase} text="Uma letra minúscula" />     
                  <PolicyItem met={policy.number} text="Um número" />                                                                 
                  <PolicyItem met={policy.specialChar} text="Um caractere especial (!@#$...)" />
                </ul>
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Crie uma Senha</label>
                <input type="password" id="password" value={password} onChange={handlePasswordChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="••••••••" required disabled={isLoading} />
              </div>
              <div className="mb-6">
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">Confirme sua Senha</label>
                <input type="password" id="confirm-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="••••••••" required disabled={isLoading} />
              </div>
              <div>
                <button type="submit" className="w-full bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-800 transition-all shadow-sm disabled:bg-blue-400" disabled={isLoading}>
                  {isLoading ? 'Cadastrando...' : 'Cadastrar'}
                </button>
              </div>
              <div className="text-center mt-6">
                <p className="text-sm text-gray-600">Já tem uma conta? <Link to="/login" className="font-medium text-blue-600 hover:underline">Faça o login</Link></p>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}