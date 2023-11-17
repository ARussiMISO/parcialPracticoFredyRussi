import { Injectable } from '@nestjs/common';
import { AerolineaEntity } from './aerolinea.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessLogicException, BusinessError } from 'src/shared/errors/business-errors';

@Injectable()
export class AerolineaService {
    constructor(
        @InjectRepository(AerolineaEntity)
        private readonly aerolineaRepository: Repository<AerolineaEntity>
    ) { }

    async findAll(): Promise<AerolineaEntity> {
        return await this.aerolineaRepository.find({ relations: ["aeropuertos"] });
    }

    async findOne(id: number): Promise<AerolineaEntity> {
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({ where: { id }, relations: ["aeropuertos"] });
        if (!aerolinea)
            throw new BusinessLogicException("La aerolinea con el id dado no encontrada", BusinessError.NOT_FOUND);

        return aerolinea;
    }

    async create(aerolinea: AerolineaEntity): Promise<AerolineaEntity> {
        return await this.aerolineaRepository.save(aerolinea);
    }

    async update(id: number, aerolinea: AerolineaEntity): Promise<AerolineaEntity> {
        const aerolineaGuardada: AerolineaEntity = await this.aerolineaRepository.findOne({ where: { id }, relations: ['aeropuertos'] });
        if (!aerolineaGuardada)
            throw new BusinessLogicException("La aerolinea con el id dado no encontrada", BusinessError.NOT_FOUND);

        return await this.aerolineaRepository.save({ ...aerolineaGuardada, ...aerolinea });
    }

    async delete(id: number) {
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({ where: { id } });
        if (!aerolinea)
            throw new BusinessLogicException("La aerolinea con el id dado no encontrada", BusinessError.NOT_FOUND);
        await this.aerolineaRepository.remove(aerolinea);

    }
}
