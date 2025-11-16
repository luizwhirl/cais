import { PartialType } from '@nestjs/mapped-types';
import { CreateSeloDto } from './create-selo.dto';

export class UpdateSeloDto extends PartialType(CreateSeloDto) {}