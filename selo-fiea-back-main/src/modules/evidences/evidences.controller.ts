import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  Res,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { extname } from 'path';
import { EvidencesService } from './evidences.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/roles.enum';

@Controller('evidences')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EvidencesController {
  constructor(private readonly evidencesService: EvidencesService) {}

  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
      fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|pdf|doc|docx|xls|xlsx/;
        const extName = allowedTypes.test(extname(file.originalname).toLowerCase());
        const mimeType = allowedTypes.test(file.mimetype);

        if (extName && mimeType) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Tipo de arquivo não permitido'), false);
        }
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('questionId') questionId?: string,
    @Query('selfAssessmentId') selfAssessmentId?: string,
  ) {
    return this.evidencesService.create(
      file,
      questionId ? +questionId : undefined,
      selfAssessmentId ? +selfAssessmentId : undefined,
    );
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.GESTOR, UserRole.AUDITOR)
  findAll(
    @Query('questionId') questionId?: string,
    @Query('selfAssessmentId') selfAssessmentId?: string,
  ) {
    if (questionId) {
      return this.evidencesService.findByQuestionId(+questionId);
    }
    if (selfAssessmentId) {
      return this.evidencesService.findBySelfAssessmentId(+selfAssessmentId);
    }
    return this.evidencesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.evidencesService.findOne(+id);
  }

  @Get(':id/download')
  async downloadFile(@Param('id') id: string, @Res() res: Response) {
    const filePath = await this.evidencesService.getFilePath(+id);
    const evidence = await this.evidencesService.findOne(+id);

    res.setHeader('Content-Type', evidence.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${evidence.originalName}"`);
    res.sendFile(filePath, { root: '.' });
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.GESTOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.evidencesService.remove(+id);
  }
}