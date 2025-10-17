import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateReportDTO {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  lat: number;

  @IsNumber()
  long: number;

  @IsArray()
  images: string[];
}
