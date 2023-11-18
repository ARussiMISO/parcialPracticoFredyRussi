/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { AeropuertoEntity } from './aeropuerto.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';

@Injectable()
export class AeropuertoService {
    constructor(
        @InjectRepository(AeropuertoEntity)
        private readonly aeropuertoRepository: Repository<AeropuertoEntity>
    ) { }

    async findAll(): Promise<AeropuertoEntity[]> {
        return await this.aeropuertoRepository.find({ relations: ["aerolineas"] });
    }

    async findOne(id: number): Promise<AeropuertoEntity> {
        const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({ where: { id }, relations: ["aerolineas"] });
        if (!aeropuerto)
            throw new BusinessLogicException("El aeropuerto con el id dado no encontrado", BusinessError.NOT_FOUND);

        return aeropuerto;
    }

    async create(aeropuerto: AeropuertoEntity): Promise<AeropuertoEntity> {
        if (aeropuerto.codigo.length != 3)
            throw new BusinessLogicException("La longitud del codigo del aeropuerto debe ser igual a 3", BusinessError.PRECONDITION_FAILED);
        return await this.aeropuertoRepository.save(aeropuerto);
    }

    async update(id: number, aeropuerto: AeropuertoEntity): Promise<AeropuertoEntity> {
        const aeropuertoGuardado: AeropuertoEntity = await this.aeropuertoRepository.findOne({ where: { id }, relations: ['aerolineas'] });
        if (!aeropuertoGuardado)
            throw new BusinessLogicException("El aeropuerto con el id dado no encontrado", BusinessError.NOT_FOUND);

        if (aeropuerto.codigo.length != 3)
            throw new BusinessLogicException("La longitud del codigo del aeropuerto debe ser igual a 3", BusinessError.PRECONDITION_FAILED);
        return await this.aeropuertoRepository.save({ ...aeropuertoGuardado, ...aeropuerto });
    }

    async delete(id: number) {
        const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({ where: { id } });
        if (!aeropuerto)
            throw new BusinessLogicException("El aeropuerto con el id dado no encontrado", BusinessError.NOT_FOUND);
        await this.aeropuertoRepository.remove(aeropuerto);

    }
}
