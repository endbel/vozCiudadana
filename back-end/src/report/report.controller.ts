import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDTO } from './dtos/CreateReportDTO';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  create(@Body() dto: CreateReportDTO) {
    if (!dto.title) {
      throw new NotFoundException('Title is required');
    }
    if (!dto.description) {
      throw new NotFoundException('Description is required');
    }
    if (!dto.lat) {
      throw new NotFoundException('Latitude is required');
    }
    if (!dto.long) {
      throw new NotFoundException('Longitude is required');
    }
    try {
      return this.reportService.createReport(dto);
    } catch (error) {
      return new BadRequestException('Error creating report', error);
    }
  }

  @Get('by-zone/:lat/:long')
  getByZone(@Param('lat') lat: string, @Param('long') long: string) {
    if (!lat) {
      throw new NotFoundException('Latitude is required');
    }
    if (!long) {
      throw new NotFoundException('Longitude is required');
    }
    try {
      return this.reportService.getReportByCoordinates(
        Number(lat),
        Number(long),
      );
    } catch (err) {
      throw new BadRequestException(
        'Error fetching report by coordinates',
        err,
      );
    }
  }
}
