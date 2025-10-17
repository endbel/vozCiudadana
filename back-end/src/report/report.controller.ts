import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDTO } from './dtos/CreateReportDTO';
import { AuthGuard } from '@nestjs/passport';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  async create(@Body() dto: CreateReportDTO) {
    if (!dto.title) {
      throw new BadRequestException('Title is required');
    }
    if (!dto.description) {
      throw new BadRequestException('Description is required');
    }
    if (!dto.lat) {
      throw new BadRequestException('Latitude is required');
    }
    if (!dto.long) {
      throw new BadRequestException('Longitude is required');
    }

    // No necesitamos try-catch aquí, dejamos que las excepciones del servicio se propaguen
    return await this.reportService.createReport(dto);
  }

  @Get('by-zone/:lat/:long')
  async getByZone(@Param('lat') lat: string, @Param('long') long: string) {
    if (!lat) {
      throw new BadRequestException('Latitude is required');
    }
    if (!long) {
      throw new BadRequestException('Longitude is required');
    }

    // No necesitamos try-catch aquí, dejamos que las excepciones del servicio se propaguen
    return await this.reportService.getReportByCoordinates(
      Number(lat),
      Number(long),
    );
  }

  @Post('all')
  @UseGuards(AuthGuard('jwt'))
  async getAllReports() {
    return await this.reportService.getReports();
  }
}
