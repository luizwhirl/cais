import { IsString, IsEmail, Length, IsOptional, Matches, IsObject, IsEnum } from 'class-validator';

export class CreateEmpresaDto {
  @IsString({ message: 'CNPJ é obrigatório' })
  @Matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, {
    message: 'CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX',
  })
  cnpj: string;

  @IsString({ message: 'Razão social deve ser uma string' })
  @Length(3, 255, {
    message: 'Razão social deve ter entre 3 e 255 caracteres',
  })
  razaoSocial: string;

  @IsOptional()
  @IsString({ message: 'Nome fantasia deve ser uma string' })
  @Length(3, 255, {
    message: 'Nome fantasia deve ter entre 3 e 255 caracteres',
  })
  nomeFantasia?: string;

  @IsOptional()
  @IsString()
  @Length(3, 100)
  setor?: string;

  @IsOptional()
  @IsEnum(['Pequeno', 'Médio', 'Grande'], {
    message: 'Porte deve ser: Pequeno, Médio ou Grande',
  })
  porte?: string;

  @IsOptional()
  @IsString()
  endereco?: string;

  @IsOptional()
  @IsObject()
  contatos?: {
    telefones?: string[];
    emails?: string[];
  };

  @IsString({ message: 'CNAE é obrigatório' })
  @Matches(/^\d{4}-\d\/\d{2}$/, {
    message: 'CNAE deve estar no formato XXXX-X/XX',
  })
  cnae: string;

  @IsOptional()
  @IsString()
  cidade?: string;

  @IsOptional()
  @IsString()
  @Length(2, 2, { message: 'Estado deve ter 2 caracteres (UF)' })
  estado?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{5}-\d{3}$/, {
    message: 'CEP deve estar no formato XXXXX-XXX',
  })
  cep?: string;

  @IsString({ message: 'Nome do responsável é obrigatório' })
  @Length(3, 100, {
    message: 'Nome do responsável deve ter entre 3 e 100 caracteres',
  })
  nomeResponsavel: string;

  @IsEmail({}, { message: 'Email do responsável inválido' })
  emailResponsavel: string;

  @IsOptional()
  @IsString()
  @Matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, {
    message: 'Telefone deve estar no formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX',
  })
  telefoneResponsavel?: string;

  @IsOptional()
  @IsEnum(['Ativo', 'Inativo', 'Pendente'], {
    message: 'Status deve ser: Ativo, Inativo ou Pendente',
  })
  status?: string;
}