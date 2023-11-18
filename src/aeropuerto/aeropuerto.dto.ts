/* eslint-disable prettier/prettier */
import { IsString, IsNotEmpty, MaxLength, MinLength } from "@nestjs/class-validator";

export class AeropuertoDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    @MinLength(3)
    nombre: string;
  
    @IsString()
    @IsNotEmpty()
    @MaxLength(3)
    @MinLength(3)
    codigo: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    @MinLength(4)
    pais: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    @MinLength(4)
    ciudad: string;
}
