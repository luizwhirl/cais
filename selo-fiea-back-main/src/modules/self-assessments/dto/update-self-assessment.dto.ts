import { PartialType } from '@nestjs/mapped-types';
import { CreateSelfAssessmentDto } from './create-self-assessment.dto';

export class UpdateSelfAssessmentDto extends PartialType(CreateSelfAssessmentDto) {}
