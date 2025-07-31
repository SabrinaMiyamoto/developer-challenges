import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MachinesModule } from './machines/machines.module';
import { MonitoringPointsModule } from './monitoring-points/monitoring-points.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsersModule, MachinesModule, MonitoringPointsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule { }