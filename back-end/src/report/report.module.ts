import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { SupabaseService } from 'src/supabase/supabase.service';
import { GeminiService } from 'src/gemini/gemini.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [
    ReportService,
    PrismaService,
    SupabaseService,
    GeminiService,
    JwtService,
  ],
  controllers: [ReportController],
})
export class ReportModule {}
