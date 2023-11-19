/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';

@Injectable()
export class AerolineaAeropuertoService {
    constructor(
        @InjectRepository(AeropuertoEntity)
        private readonly aeropuertoRepository: Repository<AeropuertoEntity>,

        @InjectRepository(AerolineaEntity)
        private readonly aerolineaRepository: Repository<AerolineaEntity>
    ) { }

    async addAirportToAirline(aerolineaId: number, aeropuertoId: number): Promise<AerolineaEntity> {
        const aerolineaEntity: AerolineaEntity = await this.aerolineaRepository.findOne({
            where: { id: aerolineaId }, relations: ['aeropuertos']
        });
        if (!aerolineaEntity)
            throw new BusinessLogicException("La aerolinea con el id dado no encontrada", BusinessError.NOT_FOUND);

        const aeropuertoEntity: AeropuertoEntity = await this.aeropuertoRepository.findOne({ where: { id: aeropuertoId }, relations: ["aerolineas"] });
        if (!aeropuertoEntity)
            throw new BusinessLogicException("El aeropuerto con el id dado no encontrado", BusinessError.NOT_FOUND);

        aerolineaEntity.aeropuertos = [...aerolineaEntity.aeropuertos, aeropuertoEntity];
        return await this.aerolineaRepository.save(aerolineaEntity);
    }

    async findAirportFromAirline(aerolineaId: number, aeropuertoId: number): Promise<AeropuertoEntity> {
        const aerolineaEntity: AerolineaEntity = await this.aerolineaRepository.findOne({
            where: { id: aerolineaId }, relations: ['aeropuertos']
        });
        if (!aerolineaEntity)
            throw new BusinessLogicException("La aerolinea con el id dado no encontrada", BusinessError.NOT_FOUND);

        const aeropuertoEntity: AeropuertoEntity = await this.aeropuertoRepository.findOne({ where: { id: aeropuertoId }, relations: ["aerolineas"] });
        if (!aeropuertoEntity)
            throw new BusinessLogicException("El aeropuerto con el id dado no encontrado", BusinessError.NOT_FOUND);

        const aerolineaAeropuerto: AeropuertoEntity = aerolineaEntity.aeropuertos.find(e => e.id == aeropuertoId);
        if (!aerolineaAeropuerto)
            throw new BusinessLogicException("El aeropuerto con el id dado no está asociado a la aerolínea", BusinessError.NOT_FOUND);

        return aerolineaAeropuerto;

    }

    async findAirportsFromAirline(aerolineaId: number): Promise<AeropuertoEntity[]> {
        const aerolineaEntity: AerolineaEntity = await this.aerolineaRepository.findOne({
            where: { id: aerolineaId }, relations: ['aeropuertos']
        });
        if (!aerolineaEntity)
            throw new BusinessLogicException("La aerolinea con el id dado no encontrada", BusinessError.NOT_FOUND);

        return aerolineaEntity.aeropuertos
    }

    async updateAirportsFromAirline(aerolineaId: number, aeropuertos: AeropuertoEntity[]): Promise<AerolineaEntity> {
        const aerolineaEntity: AerolineaEntity = await this.aerolineaRepository.findOne({
            where: { id: aerolineaId }, relations: ['aeropuertos']
        });
        if (!aerolineaEntity)
            throw new BusinessLogicException("La aerolinea con el id dado no encontrada", BusinessError.NOT_FOUND);

        for (const aeropuerto of aeropuertos) {
            const aeropuertoEntity: AeropuertoEntity = await this.aeropuertoRepository.findOne({ where: { id: aeropuerto.id }});
            if (!aeropuertoEntity)
                throw new BusinessLogicException("El aeropuerto con el id dado no encontrado", BusinessError.NOT_FOUND);
        }

        aerolineaEntity.aeropuertos = aeropuertos;
        return await this.aerolineaRepository.save(aerolineaEntity);
    }

    async deleteAirportFromAirline(aerolineaId: number, aeropuertoId: number) {
        const aerolineaEntity: AerolineaEntity = await this.aerolineaRepository.findOne({
            where: { id: aerolineaId }, relations: ['aeropuertos']
        });
        if (!aerolineaEntity)
            throw new BusinessLogicException("La aerolinea con el id dado no encontrada", BusinessError.NOT_FOUND);

        const aeropuertoEntity: AeropuertoEntity = await this.aeropuertoRepository.findOne({ where: { id: aeropuertoId }, relations: ["aerolineas"] });
        if (!aeropuertoEntity)
            throw new BusinessLogicException("El aeropuerto con el id dado no encontrado", BusinessError.NOT_FOUND);

        const aerolineaAeropuerto: AeropuertoEntity = aerolineaEntity.aeropuertos.find(e => e.id == aeropuertoId);
        if (!aerolineaAeropuerto)
            throw new BusinessLogicException("El aeropuerto con el id dado no está asociado a la aerolínea", BusinessError.NOT_FOUND);

        aerolineaEntity.aeropuertos = aerolineaEntity.aeropuertos.filter(e => e.id != aeropuertoId );
        await this.aerolineaRepository.save(aerolineaEntity);
    }

}
