import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailerService: MailerService) {}
    
  async sendRegistrationConfirmation(email: string, name: string, token: string): Promise<void> {
    const confirmationLink = `http://seu-frontend.com/confirm-registration?token=${token}`;
    
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Confirmação de Cadastro - Selo FIEA',
        html: `
          <h1>Olá, ${name}!</h1>
          <p>Obrigado por se cadastrar. Por favor, confirme seu email:</p>
          <a href="${confirmationLink}">Clique aqui para confirmar seu email</a>
          <p>Se você não se cadastrou, por favor, ignore este e-mail.</p>
        `,
      });
      this.logger.log(`Email de confirmação enviado com sucesso para: ${email}`);
    } catch (error) {
      this.logger.error(`Falha ao enviar email para ${email}: ${error.message}`);
      throw error;
    }
  }

  async sendResetPasswordEmail(email: string, resetLink: string): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Recuperação de Senha - Selo FIEA',
        html: this.getResetPasswordTemplate(resetLink),
      });
      this.logger.log(`Email de recuperação enviado para ${email}`);
    } catch (error) {
      this.logger.error(`Erro ao enviar email para ${email}: ${error.message}`);
      throw error;
    }
  }

  async sendPasswordChangedEmail(email: string): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Senha alterada com sucesso - Selo FIEA',
        html: this.getPasswordChangedTemplate(),
      });
      this.logger.log(`Email de confirmação enviado para ${email}`);
    } catch (error) {
      this.logger.error(`Erro ao enviar email para ${email}: ${error.message}`);
      throw error;
    }
  }
  
  async sendSelfAssessmentSubmitted(
    email: string,
    userName: string,
    cycleName: string,
  ): Promise<void> {
    const subject = 'Autoavaliação Submetida com Sucesso - Selo FIEA';
    const html = `
      <h1>Autoavaliação Submetida</h1>
      <p>Olá, ${userName}!</p>
      <p>Sua autoavaliação para o ciclo <strong>${cycleName}</strong> foi submetida com sucesso.</p>
      <p>Em breve nossa equipe irá analisar e você receberá o resultado.</p>
      <br>
      <p>Atenciosamente,<br>Equipe Selo FIEA</p>
    `;

    await this.mailerService.sendMail({
      to: email,
      subject,
      html,
    });
  }

  private getResetPasswordTemplate(resetLink: string): string {
    return `
      <h1>Recuperação de Senha</h1>
      <p>Você solicitou a recuperação de sua senha.</p>
      <p>Clique no link abaixo para redefinir sua senha (válido por 30 minutos):</p>
      <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Redefinir Senha</a>
      <p>Se você não solicitou esta recuperação, ignore este email.</p>
    `;
  }

  private getPasswordChangedTemplate(): string {
    return `
      <h1>Senha Alterada com Sucesso</h1>
      <p>Sua senha foi alterada com sucesso.</p>
      <p>Se você não realizou esta ação, entre em contato conosco imediatamente.</p>
    `;
  }
}