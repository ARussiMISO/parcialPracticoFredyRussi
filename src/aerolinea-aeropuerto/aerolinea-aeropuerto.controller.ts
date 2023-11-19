/* eslint-disable prettier/prettier */
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { AeropuertoDto } from 'src/aeropuerto/aeropuerto.dto';
import { AeropuertoEntity } from 'src/aeropuerto/aeropuerto.entity';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('airlines')
export class AerolineaAeropuertoController {
    constructor(
        private readonly aerolineaAeropuertoService: AerolineaAeropuertoService,
    ) { }

    @Post(':airlineId/airports/:airportId')
    @HttpCode(201)
    async addAirportToAirline(
        @Param('airlineId') airlineId: number,
        @Param('airportId') airportId: number,
    ) {
        return await this.aerolineaAeropuertoService.addAirportToAirline(
            airlineId,
            airportId,
        );
    }

    @Get(':airlineId/airports/:airportId')
    @HttpCode(200)
    async findAirportFromAirline(
        @Param('airlineId') airlineId: number,
        @Param('airportId') airportId: number,
    ) {
        return await this.aerolineaAeropuertoService.findAirportFromAirline(
            airlineId,
            airportId,
        );
    }

    @Get(':airlineId/airports')
    @HttpCode(200)
    async findAirportsFromAirline(@Param('airlineId') airlineId: number) {
        return await this.aerolineaAeropuertoService.findAirportsFromAirline(
            airlineId,
        );
    }

    @Put(':airlineId/airports')
    @HttpCode(200)
    async updateAirportsFromAirline(
        @Param('airlineId') airlineId: number,
        @Body() airportsDto: AeropuertoDto[],
    ) {
        const airportsEntity: AeropuertoEntity[] = plainToInstance(
            AeropuertoEntity,
            airportsDto,
        );
        return await this.aerolineaAeropuertoService.updateAirportsFromAirline(
            airlineId,
            airportsEntity,
        );
    }

    @Delete(':airlineId/airports/:airportId')
    @HttpCode(204)
    async deleteAirportFromAirline(
        @Param('airlineId') airlineId: number,
        @Param('airportId') airportId: number,
    ) {
        return await this.aerolineaAeropuertoService.deleteAirportFromAirline(
            airlineId,
            airportId,
        );
    }
}
