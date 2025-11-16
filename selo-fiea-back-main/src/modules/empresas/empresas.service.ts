import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empresa } from './entities/empresa.entity';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';

@Injectable()
export class EmpresasService {
  constructor(
    @InjectRepository(Empresa)
    private empresasRepository: Repository<Empresa>,
  ) {}

  private validarCNPJ(cnpj: string): boolean {
    cnpj = cnpj.replace(/[^\d]/g, '');

    if (cnpj.length !== 14) return false;

    if (/^(\d)\1+$/.test(cnpj)) return false;

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    const digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(0))) return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(1))) return false;

    return true;
  }

  async create(createEmpresaDto: CreateEmpresaDto): Promise<Empresa> {
    if (!this.validarCNPJ(createEmpresaDto.cnpj)) {
      throw new BadRequestException('CNPJ inválido');
    }

    const existingEmpresa = await this.empresasRepository.findOne({
      where: { cnpj: createEmpresaDto.cnpj },
    });

    if (existingEmpresa) {
      throw new ConflictException('CNPJ já cadastrado');
    }

    const empresa = this.empresasRepository.create({
      ...createEmpresaDto,
      isActive: true,
    });

    return this.empresasRepository.save(empresa);
  }

  async findAll(): Promise<Empresa[]> {
    return this.empresasRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Empresa> {
    const empresa = await this.empresasRepository.findOne({
      where: { id },
    });

    if (!empresa) {
      throw new NotFoundException('Empresa não encontrada');
    }

    return empresa;
  }

  async findByCnpj(cnpj: string): Promise<Empresa> {
    const cnpjSemFormatacao = cnpj.replace(/[^\d]/g, '');
    
    const empresas = await this.empresasRepository.find();
    const empresa = empresas.find(e => 
      e.cnpj.replace(/[^\d]/g, '') === cnpjSemFormatacao
    );

    if (!empresa) {
      throw new NotFoundException('Empresa não encontrada');
    }

    return empresa;
  }

  async update(id: string, updateEmpresaDto: UpdateEmpresaDto): Promise<Empresa> {
    const empresa = await this.findById(id);

    if (updateEmpresaDto.cnpj && updateEmpresaDto.cnpj !== empresa.cnpj) {
      if (!this.validarCNPJ(updateEmpresaDto.cnpj)) {
        throw new BadRequestException('CNPJ inválido');
      }

      const existingEmpresa = await this.empresasRepository.findOne({
        where: { cnpj: updateEmpresaDto.cnpj },
      });

      if (existingEmpresa && existingEmpresa.id !== id) {
        throw new ConflictException('CNPJ já cadastrado em outra empresa');
      }
    }

    Object.assign(empresa, updateEmpresaDto);
    return this.empresasRepository.save(empresa);
  }

  async remove(id: string): Promise<void> {
    const empresa = await this.findById(id);
    
    await this.empresasRepository.remove(empresa);
  }

  async toggleActive(id: string): Promise<Empresa> {
    const empresa = await this.findById(id);
    empresa.isActive = !empresa.isActive;
    return this.empresasRepository.save(empresa);
  }
}