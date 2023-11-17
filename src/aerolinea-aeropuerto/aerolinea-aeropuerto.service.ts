/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AerolineaEntity } from 'src/aerolinea/aerolinea.entity';
import { AeropuertoEntity } from 'src/aeropuerto/aeropuerto.entity';
import { BusinessLogicException, BusinessError } from 'src/shared/errors/business-errors';
import { Repository } from 'typeorm';

@Injectable()
export class AerolineaAeropuertoService {
    constructor(
        @InjectRepository(AeropuertoEntity)
        private readonly aeropuertoRepository: Repository<AeropuertoEntity>,

        @InjectRepository(AerolineaEntity)
        private readonly aerolineaRepository: Repository<AerolineaEntity>
    ) { }

    async addAeropuertoToAerolinea(aerolineaId: number, aeropuertoId: number): Promise<AerolineaEntity> {
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

    async findAeropuertoByAerolineaIdAeropuertoId(aerolineaId: number, aeropuertoId: number): Promise<AeropuertoEntity> {
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

    async findAeropuertosByAerolineaId(aerolineaId: number): Promise<AeropuertoEntity[]> {
        const aerolineaEntity: AerolineaEntity = await this.aerolineaRepository.findOne({
            where: { id: aerolineaId }, relations: ['aeropuertos']
        });
        if (!aerolineaEntity)
            throw new BusinessLogicException("La aerolinea con el id dado no encontrada", BusinessError.NOT_FOUND);

        return aerolineaEntity.aeropuertos
    }

    async updateAeropuertosAerolinea(aerolineaId: number, aeropuertos: AeropuertoEntity[]): Promise<AerolineaEntity> {
        const aerolineaEntity: AerolineaEntity = await this.aerolineaRepository.findOne({
            where: { id: aerolineaId }, relations: ['aeropuertos']
        });
        if (!aerolineaEntity)
            throw new BusinessLogicException("La aerolinea con el id dado no encontrada", BusinessError.NOT_FOUND);

        for (const aeropuerto of aeropuertos) {
            const aeropuertoEntity: AeropuertoEntity = await this.aeropuertoRepository.findOne({ where: { id: aeropuerto.id }, relations: ["aerolineas"] });
            if (!aeropuertoEntity)
                throw new BusinessLogicException("El aeropuerto con el id dado no encontrado", BusinessError.NOT_FOUND);
        }

        aerolineaEntity.aeropuertos = aeropuertos;
        return await this.aerolineaRepository.save(aerolineaEntity);
    }

    async deleteAeropuertoAerolinea(aerolineaId: number, aeropuertoId: number) {
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
