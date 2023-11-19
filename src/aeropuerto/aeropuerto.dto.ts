/* eslint-disable prettier/prettier */
import { IsString, IsNotEmpty, MaxLength, MinLength } from "@nestjs/class-validator";

export class AeropuertoDto {

    @IsString()
    @IsNotEmpty()
    nombre: string;
  
    @IsString()
    @IsNotEmpty()
    @MaxLength(3)
    @MinLength(3)
    codigo: string;

    @IsString()
    @IsNotEmpty()
    pais: string;

    @IsString()
    @IsNotEmpty()
    ciudad: string;
}
