import { Test, TestingModule } from '@nestjs/testing';
import { MailModule } from './mail.module'; 
import { MailService } from './mail.service';
import { MailerService } from '@nestjs-modules/mailer';

// ATENÇÃO:
// 1. Você DEVE garantir que as variáveis de ambiente (MAIL_USER, MAIL_PASSWORD, etc.)
//    estejam carregadas no ambiente em que este teste será executado (pelo seu Jest ou CLI).
// 2. O email de destino deve ser um endereço real que você possa verificar.

describe('MailService (Configuration Test)', () => {
  let mailService: MailService;
  let mailerService: MailerService; // Opcional, para mocks mais avançados

  beforeAll(async () => {
    // A MailModule deve ser configurada com forRootAsync para ler as VAs (Variáveis de Ambiente)
    const module: TestingModule = await Test.createTestingModule({
      imports: [MailModule], 
    }).compile();

    mailService = module.get<MailService>(MailService);
    mailerService = module.get<MailerService>(MailerService);
  });

  it('Deve ser definido (o serviço deve estar disponível)', () => {
    expect(mailService).toBeDefined();
  });

  // --- O TESTE CRÍTICO DE CONEXÃO E ENVIO ---

  it('Deve ser capaz de se conectar ao Gmail e enviar um email sem erros', async () => {
    // Definindo o número de assertions esperadas
    expect.assertions(1); 
    
    const TEST_EMAIL = 'seu.email.aqui@gmail.com'; 
    const TEST_NAME = 'Usuário Teste';
    const TEST_TOKEN = 'token-de-teste-123';

    try {
      await mailService.sendRegistrationConfirmation(
        TEST_EMAIL,
        TEST_NAME,
        TEST_TOKEN,
      );
      // Se não lançar exceção, o envio foi bem-sucedido.
      expect(true).toBe(true); 

    } catch (error) {
      // Se houver um erro de conexão/autenticação, ele será capturado aqui.
      console.error("ERRO DE CONFIGURAÇÃO DE EMAIL ENCONTRADO:", error);
      
      // O Jest falhará automaticamente se o 'await' lançar um erro. 
      // Se você chegou aqui e o erro não foi relançado no service, force a falha.
      // throw new Error(`Falha no envio de e-mail. Verifique suas credenciais do Gmail: ${error.message}`);
      
      // Para o propósito deste teste de configuração, relançar é a melhor opção se não estiver já no service
      throw error; 
    }
  }, 30000); // Aumentar o timeout para 30 segundos, pois a comunicação de rede é mais lenta.
});