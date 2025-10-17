import { IsNumber, IsString } from 'class-validator';

export class ResponseReportDTO {
  @IsString()
  id: string;
  @IsString()
  title: string;
  @IsString()
  description: string;
  @IsNumber()
  lat: number;
  @IsNumber()
  long: number;
}
