// selo-fiea-frontend/src/components/AuthForm.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthForm } from '../components/AuthForm';

// --- 1. MOCKANDO O REACT-ROUTER-DOM ---
const mockNavigate = vi.fn(); 
// mockUseSearchParams foi removido, pois não é mais usado

// O módulo 'react-router-dom' é um módulo ES e precisa ser mockado assincronamente.
// A correção está no tratamento do await e do spread.
vi.mock('react-router-dom', async (importOriginal) => {
  // O tipo do retorno de importOriginal é 'unknown', por isso o erro de spread.
  // Fazemos a coerção para 'any' para permitir o spread seguro.
  const actual = await importOriginal() as any; 
  
  return {
    ...actual, // Espalha as exports originais, como <Outlet>, etc.
    useNavigate: () => mockNavigate, 
// Sobrescreve apenas o hook de navegação
    // useSearchParams foi removido
    // Mocka o <Link> para evitar que ele exija o <BrowserRouter>
    Link: ({ children, to }: any) => <a href={to}>{children}</a>, 
  };
});


describe('AuthForm (Integração de Login)', () => {
  
  // Limpa os mocks antes de cada teste
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- 2. TESTE DE SUCESSO (Login) ---
  test('deve autenticar com sucesso e navegar para o dashboard com credenciais corretas', async () => {
    // Renderiza o formulário (não há mais abas)
    render(<AuthForm />);

    // Credenciais de sucesso (hardcoded no componente AuthForm.tsx)
    const testEmail = 'gestor@selofiea.com.br';
    const testPassword = 'Password@123';
    
    // 1. Simular a digitação (busca pelo label)
    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: testEmail },
    });
    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: testPassword },
    });

    // 2. Clicar no botão de Entrar
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    
    // 3. Aguardar a resolução do delay simulado no componente e a navegação
    await waitFor(() => {
      // Verifica se a função de navegação foi chamada com a rota correta
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  // --- 3. TESTE DE FALHA (Login) ---
  test('deve exibir mensagem de erro e não navegar com credenciais incorretas', async () => {
    render(<AuthForm />);
    
    // 1. Simular a digitação de credenciais inválidas
    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: 'usuario@invalido.com.br' },
    });
    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: 'senhainvalida' },
    });

    // 2. Clicar no botão de Entrar
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    // 3. Aguardar o estado de erro
    // O erro de login no AuthForm.tsx é um elemento com role="alert"
    const errorMessage = await screen.findByRole('alert'); 

    // 4. Asserts: Verificar o conteúdo do erro e se a navegação falhou
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent("E-mail ou senha inválidos. Verifique seus dados e tente novamente."); //
    expect(mockNavigate).not.toHaveBeenCalled(); 
  });

  // --- 4. TESTE DE INTERAÇÃO (Troca de Aba) ---
  // Este teste foi REMOVIDO pois a funcionalidade de abas foi removida do AuthForm.
});