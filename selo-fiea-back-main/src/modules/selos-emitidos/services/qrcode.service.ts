import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';

@Injectable()
export class QRCodeService {
  async generateQRCode(data: string): Promise<string> {
    try {
      // Gera QRCode como Data URL (base64)
      const qrCodeDataURL = await QRCode.toDataURL(data, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        width: 300,
        margin: 1,
      });

      return qrCodeDataURL;
    } catch (error) {
      throw new Error(`Erro ao gerar QRCode: ${error.message}`);
    }
  }

  async generateQRCodeBuffer(data: string): Promise<Buffer> {
    try {
      // Gera QRCode como Buffer
      const buffer = await QRCode.toBuffer(data, {
        errorCorrectionLevel: 'H',
        type: 'png',
        width: 300,
        margin: 1,
      });

      return buffer;
    } catch (error) {
      throw new Error(`Erro ao gerar QRCode buffer: ${error.message}`);
    }
  }

  generateSeloUrl(seloEmitidoId: string, frontendUrl: string): string {
    // URL para validação pública do selo
    return `${frontendUrl}/validar-selo/${seloEmitidoId}`;
  }

  generateSeloData(seloEmitido: any): string {
    // Dados do selo em formato JSON para o QRCode
    return JSON.stringify({
      id: seloEmitido.id,
      empresa: seloEmitido.empresa?.razaoSocial || seloEmitido.empresaId,
      selo: seloEmitido.selo?.nome || seloEmitido.seloId,
      dataEmissao: seloEmitido.dataEmissao,
      dataValidade: seloEmitido.dataValidade,
      percentual: seloEmitido.percentualAtingido,
      validationUrl: this.generateSeloUrl(
        seloEmitido.id,
        process.env.FRONTEND_URL || 'http://localhost:3000',
      ),
    });
  }
}