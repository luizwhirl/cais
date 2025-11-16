import { PartialType } from '@nestjs/mapped-types';
import { CreateCertificationCycleDto } from './create-certification-cycle.dto';

export class UpdateCertificationCycleDto extends PartialType(CreateCertificationCycleDto) {}
