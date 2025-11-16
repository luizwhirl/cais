// selo-fiea-frontend/src/pages/ManagerRegistrationPage.tsx

import { useState } from "react";
import { Link } from "react-router-dom";
import { LoginHeader } from "../components/LoginHeader";
import { Footer } from "../components/Footer";
import { CheckCircle2, XCircle } from "lucide-react";
import { apiClient } from "../services/apiClient"; 

export function ManagerRegistrationPage() {
  // Campos da empresa
  const [razaoSocial, setRazaoSocial] = useState('');
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [cnae, setCnae] = useState(''); // CNAE não está na API de /empresas, mas vou manter
  const [endereco, setEndereco] = useState('');
  const [setor, setSetor] = useState(''); 
  const [porte, setPorte] = useState<'Pequeno' | 'Médio' | 'Grande'>('Pequeno'); 
  const [telefoneEmpresa, setTelefoneEmpresa] = useState(''); 
  const [emailEmpresa, setEmailEmpresa] = useState(''); 

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

    try {
      // API REAL
      const payload = {
        company: {
          razao_social: razaoSocial,
          nome_fantasia: nomeFantasia,
          cnpj,
          cnae, // Este campo não está na API de /empresas, mas estava no form
          setor,
          porte,
          endereco,
          email: emailEmpresa,
          telefone: telefoneEmpresa,
        },
        user: {
          name: responsavel,
          email, // E-mail de login do gestor
          phone, // Telefone do gestor
          password,
          role: 'industry' // Define a role
        }
      };

      console.log("Tentativa de cadastro com:", payload);

      // Usando o endpoint público de registro
      await apiClient.publicPost('/auth/register', payload);

      setMessage('Cadastro realizado com sucesso! Um e-mail de confirmação pode ter sido enviado. Você já pode fazer o login.');

    } catch (err: any) {
      console.error("Falha no cadastro da indústria:", err);
      setError(err.message || 'Erro ao realizar cadastro. Verifique se o CNPJ ou E-mail já estão em uso.');
    } finally {
      setIsLoading(false);
    }
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
              <fieldset className="border p-4 rounded-lg">
                <legend className="text-lg font-semibold px-2">Dados da Empresa</legend>
                <div className="space-y-4 p-2">
                  <input type="text" value={razaoSocial} onChange={(e) => setRazaoSocial(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Razão Social" required disabled={isLoading} />
                  <input type="text" value={nomeFantasia} onChange={(e) => setNomeFantasia(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Nome Fantasia" required disabled={isLoading} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" value={cnpj} onChange={(e) => setCnpj(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="CNPJ (XX.XXX.XXX/XXXX-XX)" required disabled={isLoading} />
                    <input type="text" value={cnae} onChange={(e) => setCnae(e.target.value.replace(/\D/g, ''))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="CNAE (apenas números)" required disabled={isLoading} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" value={setor} onChange={(e) => setSetor(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Setor de Atuação" required disabled={isLoading} />
                    <select value={porte} onChange={(e) => setPorte(e.target.value as typeof porte)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" required disabled={isLoading}>
                      <option value="Pequeno">Pequeno Porte</option>
                      <option value="Médio">Médio Porte</option>
                      <option value="Grande">Grande Porte</option>
                    </select>
                  </div>
                  <input type="text" value={endereco} onChange={(e) => setEndereco(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Endereço Completo" required disabled={isLoading} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="email" value={emailEmpresa} onChange={(e) => setEmailEmpresa(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="E-mail da Empresa" required disabled={isLoading} />
                    <input type="tel" value={telefoneEmpresa} onChange={(e) => setTelefoneEmpresa(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Telefone da Empresa" required disabled={isLoading} />
                  </div>
                </div>
              </fieldset>
              
              {/* Dados do Responsável */}
               <fieldset className="border p-4 rounded-lg">
                <legend className="text-lg font-semibold px-2">Dados do Gestor (Login)</legend>
                <div className="space-y-4 p-2">
                  <input type="text" value={responsavel} onChange={(e) => setResponsavel(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus-border-blue-500" placeholder="Nome do Responsável" required disabled={isLoading} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="E-mail de Acesso (Login)" required disabled={isLoading} />
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Telefone do Responsável" required disabled={isLoading} />
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
                </div>
              </fieldset>
              
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