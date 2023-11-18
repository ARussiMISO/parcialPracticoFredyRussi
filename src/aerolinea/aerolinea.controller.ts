/* eslint-disable prettier/prettier */
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { AerolineaService } from './aerolinea.service';
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AerolineaDto } from './aerolinea.dto';
import { AerolineaEntity } from './aerolinea.entity';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('airlines')
export class AerolineaController {
    constructor(private readonly aerolineaService: AerolineaService) { }

    @Post()
    @HttpCode(201)
    async create(@Body() airlineDto: AerolineaDto){
        const airlineEntity: AerolineaEntity = plainToInstance(AerolineaEntity, airlineDto);
        return await this.aerolineaService.create(airlineEntity);
    }

    @Get()
    @HttpCode(200)
    async findAll() {
        return await this.aerolineaService.findAll();
    }

    @Get(':airlineId')
    @HttpCode(200)
    async findById(@Param('airlineId') airlineId: number) {
        return await this.aerolineaService.findOne(airlineId);
    }

    @Put(':airlineId')
    @HttpCode(200)
    async update(@Param('airlineId') airlineId: number, @Body() airlineDto: AerolineaDto) {
        const airlineEntity: AerolineaEntity = plainToInstance(AerolineaEntity, airlineDto);
        return await this.aerolineaService.update(airlineId, airlineEntity);
    }

    @Delete(':airlineId')
    @HttpCode(204)
    async delete(@Param('airlineId') airlineId: number) {
        return await this.aerolineaService.delete(airlineId);
    }

}
