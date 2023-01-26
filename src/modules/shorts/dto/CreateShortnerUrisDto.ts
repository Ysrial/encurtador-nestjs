import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class CreateShortnerUrisDto {
  @IsUrl({}, { message: 'url inválida' })
  @ApiProperty({
    name: 'url',
    description: 'URL que será encurtada',
    required: true,
  })
  url: string;
}
