import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
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
  ): Promise<ResponseReportDTO[]> {
    const EARTH_RADIUS_METERS = 6371000; // Radio de la Tierra en metros
    const now = new Date();
    const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

    const query = Prisma.sql`
     WITH ReportWithDistance AS (
        SELECT
          r.id, 
          r.title, 
          r.description,
          r.lat, 
          r.long, 
          r.images,
          r.category,
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

    const reports = (await this.prisma.$queryRaw(query)) as any[];

    // Convertir los resultados raw al DTO ResponseReportDTO
    return reports.map(
      (report) =>
        ({
          id: report.id,
          title: report.title,
          description: report.description,
          lat: report.lat,
          long: report.long,
          images: report.images,
          category: report.category,
        }) as ResponseReportDTO,
    );
  }

  async createReport(data: CreateReportDTO) {
    try {
      const textModeration = await this.geminiService.generateText(
        data.description,
      );
      if (!textModeration.approved) {
        throw new BadRequestException(
          `La descripción del reporte fue rechazada: ${textModeration.reason}`,
        );
      }
      for (const imageDataUrl of data.images) {
        // Verificar si es una Data URL
        if (!imageDataUrl.startsWith('data:image/')) {
          throw new BadRequestException(
            'Invalid image format. Expected Data URL.',
          );
        }

        // Extraer el MIME type y los datos base64
        const [header, base64Data] = imageDataUrl.split(',');
        const mimeType = header.match(/data:([^;]+)/)?.[1] || 'image/jpeg';

        // Convertir base64 a buffer
        const buffer = Buffer.from(base64Data, 'base64');

        const imageModeration = await this.geminiService.moderateImage(
          buffer,
          mimeType,
        );

        if (!imageModeration.approved) {
          throw new BadRequestException(
            `Una de las imágenes fue rechazada: ${imageModeration.reason}`,
          );
        }

        const uploadedImageUrl = await this.supabaseService.uploadImage(
          buffer,
          mimeType,
          'voz-ciudadana-bucket',
        );

        const index = data.images.indexOf(imageDataUrl);
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
      // Si es una BadRequestException (error de validación), la re-lanzamos tal como está
      if (error instanceof BadRequestException) {
        throw error;
      }

      // Para otros errores, lanzamos un error interno del servidor
      console.error('Unexpected error creating report:', error);
      throw new InternalServerErrorException(
        'Error interno del servidor al procesar el reporte',
      );
    }
  }
}
