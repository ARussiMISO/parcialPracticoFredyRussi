import { Module } from '@nestjs/common';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';
import { AerolineaEntity } from 'src/aerolinea/aerolinea.entity';
import { AeropuertoEntity } from 'src/aeropuerto/aeropuerto.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:  [TypeOrmModule.forFeature([AerolineaEntity, AeropuertoEntity])],
  providers: [AerolineaAeropuertoService]
})
export class AerolineaAeropuertoModule {}
