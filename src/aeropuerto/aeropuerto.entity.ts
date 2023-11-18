/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, MaxLength, MinLength } from "@nestjs/class-validator";
import { AerolineaEntity } from "../aerolinea/aerolinea.entity";
import { PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, Entity } from "typeorm";

@Entity()
export class AeropuertoEntity {
    @PrimaryGeneratedColumn('uuid')
    id: number;
  
    @Column()
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    @MinLength(3)
    nombre: string;
  
    @Column()
    @IsString()
    @IsNotEmpty()
    @MaxLength(3)
    @MinLength(3)
    codigo: string;

    @Column()
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    @MinLength(4)
    pais: string;

    @Column()
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    @MinLength(4)
    ciudad: string;
  
  @ManyToMany(() => AerolineaEntity, (aerolinea) => aerolinea.aeropuertos, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
    @JoinTable()
    aerolineas: AerolineaEntity[];
}
