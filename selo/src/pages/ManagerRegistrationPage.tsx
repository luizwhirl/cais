// selo-fiea-frontend/src/pages/ManagerRegistrationPage.tsx

import { useState } from "react";
import { Link } from "react-router-dom";
import { LoginHeader } from "../components/LoginHeader";
import { Footer } from "../components/Footer";
import { CheckCircle2, XCircle } from "lucide-react";

export function ManagerRegistrationPage() {
  // Campos da empresa
  const [razaoSocial, setRazaoSocial] = useState('');
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [cnae, setCnae] = useState('');
  const [endereco, setEndereco] = useState('');

  // Campos do gestor (usuário)
  const [responsavel, setResponsavel] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Estado da UI
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
    // O back-end deve validar se o CNPJ já existe para impedir duplicidade.
    console.log("Tentativa de cadastro com:", { razaoSocial, nomeFantasia, cnpj, cnae, endereco, responsavel, email, phone, password });

    // Simulação de chamada de API
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Exemplo de mensagem de sucesso
    setMessage('Cadastro realizado com sucesso! Um e-mail de confirmação foi enviado.');

    // Exemplo de como lidar com erro (ex: CNPJ já existe)
    // setError('Este CNPJ já está cadastrado em nosso sistema.');

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
        <div className="w-full max-w-lg">
          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Cadastro de Gestor da Indústria</h2>
              <p className="text-gray-500 mt-1">Preencha os dados para iniciar o processo de certificação.</p>
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
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Dados da Empresa */}
              <input type="text" value={razaoSocial} onChange={(e) => setRazaoSocial(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Razão Social" required disabled={isLoading} />
              <input type="text" value={nomeFantasia} onChange={(e) => setNomeFantasia(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Nome Fantasia" required disabled={isLoading} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" value={cnpj} onChange={(e) => setCnpj(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="CNPJ" required disabled={isLoading} />
                <input type="text" value={cnae} onChange={(e) => setCnae(e.target.value.replace(/\D/g, ''))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="CNAE (apenas números)" required disabled={isLoading} />
              </div>
              <input type="text" value={endereco} onChange={(e) => setEndereco(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Endereço Completo" required disabled={isLoading} />
              
              {/* Dados do Responsável */}
              <hr className="my-4"/>
              <input type="text" value={responsavel} onChange={(e) => setResponsavel(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus-border-blue-500" placeholder="Nome do Responsável" required disabled={isLoading} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="E-mail de Acesso" required disabled={isLoading} />
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Telefone" required disabled={isLoading} />
              </div>

              {/* Política de Senha */}
              <div className="text-sm">
                <ul className="space-y-1">
                  <PolicyItem met={policy.minLength} text="A senha deve conter pelo menos 8 caracteres" />
                  <PolicyItem met={policy.uppercase} text="Uma letra maiúscula" />
                  <PolicyItem met={policy.lowercase} text="Uma letra minúscula" />     
                  <PolicyItem met={policy.number} text="Um número" />                                                                 
                  <PolicyItem met={policy.specialChar} text="Um caractere especial (!@#$...)" />
                </ul>
              </div>
              <input type="password" value={password} onChange={handlePasswordChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Crie uma Senha" required disabled={isLoading} />
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Confirme sua Senha" required disabled={isLoading} />
              
              <div>
                <button type="submit" className="w-full bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-800 transition-all shadow-sm disabled:bg-blue-400" disabled={isLoading}>
                  {isLoading ? 'Cadastrando...' : 'Finalizar Cadastro'}
                </button>
              </div>
              <div className="text-center mt-4">
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
