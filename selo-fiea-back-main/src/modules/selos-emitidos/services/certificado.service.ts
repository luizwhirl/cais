import { Injectable } from '@nestjs/common';
import { QRCodeService } from './qrcode.service';

@Injectable()
export class CertificadoService {
  constructor(private qrcodeService: QRCodeService) {}

  async gerarSeloDigital(seloEmitido: any): Promise<string> {
    // Gera dados do selo para o QRCode
    const seloData = this.qrcodeService.generateSeloData(seloEmitido);
    
    // Gera QRCode como Data URL
    const qrCodeDataURL = await this.qrcodeService.generateQRCode(seloData);

    // Gera HTML do selo digital (pode ser convertido para PDF depois)
    const html = this.gerarHtmlSelo(seloEmitido, qrCodeDataURL);

    return html;
  }

  private gerarHtmlSelo(seloEmitido: any, qrCodeDataURL: string): string {
    const dataEmissao = new Date(seloEmitido.dataEmissao).toLocaleDateString('pt-BR');
    const dataValidade = new Date(seloEmitido.dataValidade).toLocaleDateString('pt-BR');
    const percentual = seloEmitido.percentualAtingido.toFixed(2);

    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Selo Digital FIEA</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Arial', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
    }
    
    .certificate {
      background: white;
      border-radius: 20px;
      padding: 60px;
      max-width: 800px;
      width: 100%;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      position: relative;
      overflow: hidden;
    }
    
    .certificate::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 10px;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    }
    
    .header {
      text-align: center;
      margin-bottom: 40px;
    }
    
    .logo {
      font-size: 48px;
      font-weight: bold;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 10px;
    }
    
    .title {
      font-size: 32px;
      color: #333;
      margin: 20px 0;
      font-weight: bold;
    }
    
    .subtitle {
      font-size: 18px;
      color: #666;
    }
    
    .content {
      text-align: center;
      margin: 40px 0;
    }
    
    .company-name {
      font-size: 28px;
      font-weight: bold;
      color: #333;
      margin: 20px 0;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin: 40px 0;
      text-align: left;
    }
    
    .info-item {
      padding: 15px;
      background: #f8f9fa;
      border-radius: 10px;
    }
    
    .info-label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 5px;
    }
    
    .info-value {
      font-size: 18px;
      color: #333;
      font-weight: bold;
    }
    
    .qrcode-section {
      text-align: center;
      margin: 40px 0;
      padding: 30px;
      background: #f8f9fa;
      border-radius: 15px;
    }
    
    .qrcode-title {
      font-size: 14px;
      color: #666;
      margin-bottom: 15px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .qrcode-img {
      max-width: 200px;
      height: auto;
    }
    
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e9ecef;
      color: #666;
      font-size: 14px;
    }
    
    .seal-badge {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 15px 30px;
      border-radius: 50px;
      font-size: 16px;
      font-weight: bold;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="header">
      <div class="logo">FIEA</div>
      <div class="subtitle">Federação das Indústrias do Estado de Alagoas</div>
      <h1 class="title">Certificado de Excelência</h1>
    </div>
    
    <div class="content">
      <p style="font-size: 18px; color: #666;">Certificamos que</p>
      <div class="company-name">${seloEmitido.empresa?.razaoSocial || 'Empresa'}</div>
      <p style="font-size: 18px; color: #666; margin-top: 20px;">
        Atende aos requisitos de qualidade, sustentabilidade e inovação, recebendo o
      </p>
      <div class="seal-badge">${seloEmitido.selo?.nome || 'Selo FIEA'}</div>
    </div>
    
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Data de Emissão</div>
        <div class="info-value">${dataEmissao}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Válido até</div>
        <div class="info-value">${dataValidade}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Pontuação Obtida</div>
        <div class="info-value">${percentual}%</div>
      </div>
      <div class="info-item">
        <div class="info-label">Certificado Nº</div>
        <div class="info-value">${seloEmitido.id.substring(0, 8).toUpperCase()}</div>
      </div>
    </div>
    
    <div class="qrcode-section">
      <div class="qrcode-title">Validar Autenticidade</div>
      <img src="${qrCodeDataURL}" alt="QR Code" class="qrcode-img" />
      <p style="margin-top: 15px; color: #666; font-size: 12px;">
        Escaneie o QR Code para verificar a autenticidade deste certificado
      </p>
    </div>
    
    <div class="footer">
      <p>Este certificado é válido até ${dataValidade}</p>
      <p style="margin-top: 5px;">ID: ${seloEmitido.id}</p>
    </div>
  </div>
</body>
</html>
    `;
  }
}