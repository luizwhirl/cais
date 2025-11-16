import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Upload } from './entities/upload.entity';

@Injectable()
export class UploadsService {
  constructor(
    @InjectRepository(Upload)
    private uploadsRepository: Repository<Upload>,
  ) {}

  async create(file: Express.Multer.File): Promise<Upload> {
    const newFile = this.uploadsRepository.create({
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
    });
    return this.uploadsRepository.save(newFile);
  }

  async findOne(id: number): Promise<Upload> {
    return this.uploadsRepository.findOne({ where: { id } });
  }
}