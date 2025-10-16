import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReportModule } from './report/report.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [ReportModule, PrismaModule, ReportModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
