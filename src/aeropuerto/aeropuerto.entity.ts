/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, Length} from "@nestjs/class-validator";
import { AerolineaEntity } from "../aerolinea/aerolinea.entity";
import { PrimaryGeneratedColumn, Column, ManyToMany, Entity } from "typeorm";

@Entity()
export class AeropuertoEntity {
    @PrimaryGeneratedColumn()
    @IsNotEmpty()
    id: number;
  
    @Column()
    @IsString()
    @IsNotEmpty()
    nombre: string;
  
    @Column()
    @IsString()
    @IsNotEmpty()
    @Length(3)
    codigo: string;

    @Column()
    @IsString()
    @IsNotEmpty()
    pais: string;

    @Column()
    @IsString()
    @IsNotEmpty()
    ciudad: string;
  
  @ManyToMany(() => AerolineaEntity, (aerolinea) => aerolinea.aeropuertos, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
    aerolineas: AerolineaEntity[];
}
