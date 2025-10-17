import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReportDTO } from './dtos/CreateReportDTO';
import { ResponseReportDTO } from './dtos/ResponseReportDTO';
import { Category, Prisma } from '@prisma/client';
import { SupabaseService } from 'src/supabase/supabase.service';
import { GeminiService } from 'src/gemini/gemini.service';

@Injectable()
export class ReportService {
  constructor(
    private prisma: PrismaService,
    private supabaseService: SupabaseService,
    private geminiService: GeminiService,
  ) {}

  async getReports() {
    return await this.prisma.report.findMany({});
  }

  async getReportById(id: string) {
    return await this.prisma.report.findUnique({
      where: { id },
    });
  }

  async getReportByCoordinates(
    lat: number,
    long: number,
    radiusInMeters: number = 300,
  ) {
    const EARTH_RADIUS_METERS = 6371000; // Radio de la Tierra en metros
    const now = new Date();
    const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

    const query = Prisma.sql`
     WITH ReportWithDistance AS (
        SELECT
          r.id, 
          r.title, 
          r.lat, 
          r.long, 
          r."createdAt",
          -- 1. Calcular la distancia en una columna temporal
          (${EARTH_RADIUS_METERS} * ACOS(
            COS(RADIANS(${lat})) * COS(RADIANS(r.lat)) *
            COS(RADIANS(r.long) - RADIANS(${long})) +
            SIN(RADIANS(${lat})) * SIN(RADIANS(r.lat))
          )) AS distance_meters
        FROM
          "Report" r
        WHERE
          -- 2. Aplicar el filtro temporal (donde no necesitamos la distancia)
          r."createdAt" >= ${fortyEightHoursAgo}
      )
      
      -- 3. Seleccionar los resultados del CTE y aplicar el filtro de distancia
      SELECT *
      FROM ReportWithDistance
      WHERE
        distance_meters <= ${radiusInMeters}
      ORDER BY
        distance_meters ASC;
    `;

    const reports = await this.prisma.$queryRaw(query);
    return reports;
  }

  async createReport(data: CreateReportDTO) {
    try {
      const textApproved = await this.geminiService.generateText(
        data.description,
      );
      if (!textApproved) {
        throw new BadRequestException('Text content not approved');
      }
      for (const imageUrl of data.images) {
        const response = await fetch(imageUrl);
        const buffer = await response.arrayBuffer();
        const mimeType = response.headers.get('content-type') || 'image/jpeg';
        const imageApproved = await this.geminiService.moderateImage(
          Buffer.from(buffer),
          mimeType,
        );

        if (!imageApproved) {
          throw new BadRequestException('One or more images not approved');
        }
        const uploadedImageUrl = await this.supabaseService.uploadImage(
          Buffer.from(buffer),
          mimeType,
          'voz-ciudadana-bucket',
        );
        const index = data.images.indexOf(imageUrl);
        data.images[index] = uploadedImageUrl;
      }

      const report = await this.prisma.report.create({
        data: {
          title: data.title,
          description: data.description,
          lat: data.lat,
          long: data.long,
          images: data.images,
          category: data.category as Category,
        },
      });

      return {
        id: report.id,
        title: report.title,
        description: report.description,
        category: report.category,
        lat: report.lat,
        long: report.long,
        images: report.images,
      } as ResponseReportDTO;
    } catch (error) {
      throw new Error('Error creating report: ' + error.message);
    }
  }
}
