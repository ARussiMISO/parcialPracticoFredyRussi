import { Module } from '@nestjs/common';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';
import { AerolineaEntity } from 'src/aerolinea/aerolinea.entity';
import { AeropuertoEntity } from 'src/aeropuerto/aeropuerto.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AerolineaAeropuertoController } from './aerolinea-aeropuerto.controller';

@Module({
  imports:  [TypeOrmModule.forFeature([AerolineaEntity, AeropuertoEntity])],
  providers: [AerolineaAeropuertoService],
  controllers: [AerolineaAeropuertoController]
})
export class AerolineaAeropuertoModule {}
