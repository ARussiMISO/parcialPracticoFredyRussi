/* eslint-disable prettier/prettier */
import { IsDate, IsNotEmpty, IsString, IsUrl, MaxDate, MaxLength, MinLength } from '@nestjs/class-validator';
import { Transform } from 'class-transformer';

export class AerolineaDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    @MinLength(3)
    nombre: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    @MinLength(3)
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
