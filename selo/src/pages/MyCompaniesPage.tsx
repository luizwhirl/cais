import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Footer } from "../components/Footer";
import { PlusCircle } from "lucide-react";
import { CompanyModal, type Company } from "../components/CompanyModal";


// Dados mocados para simular a API
const MOCKED_COMPANIES: Company[] = [
  {
    id: 1,
    razao_social: 'Indústria Alfa Ltda.',
    nome_fantasia: 'Alfa Metais',
    cnpj: '00.000.000/0001-00',
    setor: 'Metalurgia',
    porte: 'Médio',
    status: 'Ativa',
    endereco: 'Rua das Industias - Distrito Industrial, Maceió - AL',
    email: 'contato@alfametais.com.br',
    telefone: '(11) 11111-1111'
  },
  {
    id: 2,
    razao_social: 'Indústria Beta Ltda.',
    nome_fantasia: 'Beta Alimentos',
    cnpj: '11.111.111/0001-11',
    setor: 'Alimentício',
    porte: 'Grande',
    status: 'Ativa',
    endereco: 'Rua das Industias - Distrito Industrial, Maceió - AL',
    email: 'contato@betaalimentos.com.br',
    telefone: '(22) 22222-2222'
  },
  {
    id: 3,
    razao_social: 'Indústria Gama Ltda.',
    nome_fantasia: 'Gama Têxtil',
    cnpj: '22.222.222/0001-22',
    setor: 'Têxtil',
    porte: 'Pequeno',
    status: 'Desativada',
    endereco: 'Rua das Industias - Distrito Industrial, Maceió - AL',
    email: 'contato@gamatextil.com.br',
    telefone: '(33) 33333-3333'
  },
];


export function MyCompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);


  useEffect(() => {
    const fetchCompanies = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // ! Substituir com chamada real à API para buscar as empresas
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay da API
        setCompanies(MOCKED_COMPANIES);
      } catch (err) {
        setError('Erro ao carregar as empresas.');
        console.error('Falha ao buscar empresas:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleOpenModal = (company: Company | null) => {
    setEditingCompany(company);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCompany(null);
  };

  const handleSaveCompany = (companyToSave: Company) => {
    if (editingCompany) { // Editando
      setCompanies(companies.map(c => c.id === companyToSave.id ? companyToSave : c));
      console.log('Atualizando empresa:', companyToSave);
    } else { // Criando
      const newCompany = { ...companyToSave, id: Math.max(0, ...companies.map(c => c.id)) + 1 };
      setCompanies([...companies, newCompany]);
      console.log('Criando nova empresa:', newCompany);
    }
    handleCloseModal();
  };
  const handleDeactivateCompany = (companyId: number) => {
    if (window.confirm('Tem certeza que deseja desativar esta empresa? Esta ação não poderá ser desfeita.')) {
      // ! Substituir com chamada real à API para desativar a empresa (PATCH/PUT)
      setCompanies(companies.map(company => 
        company.id === companyId ? { ...company, status: 'Desativada' } : company
      ));
      console.log('Desativando empresa com ID:', companyId);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-6 py-4">
            <Link to="/" className="text-sm font-semibold text-blue-600 hover:underline">← Voltar ao Início</Link>
            <h1 className="text-3xl font-bold text-gray-800 mt-2">Minhas Empresas</h1>
            <p className="text-gray-600 mt-1">Visualize e gerencie as indústrias associadas à sua conta.</p>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8">
          <div className="flex justify-end mb-6">
            <button
              onClick={() => handleOpenModal(null)}
              className="bg-blue-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors flex items-center"
            >
              <PlusCircle size={20} className="mr-2" />
              Cadastrar Nova Empresa
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            {isLoading && <p className="text-center text-gray-600">Carregando empresas...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
            {!isLoading && !error && (
              companies.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Razão Social</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome Fantasia</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CNPJ</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {companies.map((company) => ( 
                        <tr key={company.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{company.razao_social}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.nome_fantasia || '--'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.cnpj}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              company.status === 'Ativa' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {company.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button onClick={() => handleOpenModal(company)} className="text-blue-600 hover:text-blue-900 mr-4">Editar</button>
                            {company.status === 'Ativa' && (
                              <button onClick={() => handleDeactivateCompany(company.id)} className="text-red-600 hover:text-red-900">Desativar</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="mt-1 text-gray-500">Nenhuma empresa encontrada.</p>
                  <Link to="/register-company" className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Cadastrar Nova Empresa
                  </Link>
                </div>
              )
            )}
          </div>
        </main>
      </div>
      {isModalOpen && (
        <CompanyModal
          company={editingCompany}
          onClose={handleCloseModal}
          onSave={handleSaveCompany}
        />
      )}
      <Footer />
    </>
  );
}