/* eslint-disable prettier/prettier */
import { IsDate, IsNotEmpty, IsString, IsUrl, MaxDate } from '@nestjs/class-validator';
import { Transform } from 'class-transformer';

export class AerolineaDto {

    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    descripcion: string;

    @IsNotEmpty()
    @Transform(({ value }) => new Date(value))
    @IsDate()
    @MaxDate(new Date())
    fechaFundacion: Date;

    @IsNotEmpty()
    @IsUrl()
    urlPaginaWeb: string;
}
