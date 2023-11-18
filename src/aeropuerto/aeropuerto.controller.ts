/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { AeropuertoService } from './aeropuerto.service';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { AeropuertoDto } from './aeropuerto.dto';
import { AeropuertoEntity } from './aeropuerto.entity';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('airports')
export class AeropuertoController {

    constructor(private readonly aeropuertoService: AeropuertoService) { }

    @Post()
    @HttpCode(201)
    async create(@Body() airportDto: AeropuertoDto){
        const airportEntity: AeropuertoEntity = plainToInstance(AeropuertoEntity, airportDto);
        return await this.aeropuertoService.create(airportEntity);
    }

    @Get()
    @HttpCode(200)
    async findAll() {
        return await this.aeropuertoService.findAll();
    }

    @Get(':airportId')
    @HttpCode(200)
    async findById(@Param('airportId') airportId: number) {
        return await this.aeropuertoService.findOne(airportId);
    }

    @Put(':airportId')
    @HttpCode(200)
    async update(@Param('airportId') airportId: number, @Body() airportDto: AeropuertoDto) {
        const airportEntity: AeropuertoEntity = plainToInstance(AeropuertoEntity, airportDto);
        return await this.aeropuertoService.update(airportId, airportEntity);
    }

    @Delete(':airportId')
    @HttpCode(204)
    async delete(@Param('airportId') airportId: number) {
        return await this.aeropuertoService.delete(airportId);
    }
}
