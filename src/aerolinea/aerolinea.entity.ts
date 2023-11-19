/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, IsDate, MaxDate, IsUrl } from '@nestjs/class-validator';
import { Transform } from 'class-transformer';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { PrimaryGeneratedColumn, Column, ManyToMany, Entity, JoinTable } from 'typeorm';

@Entity()
export class AerolineaEntity {
    @PrimaryGeneratedColumn('uuid')
    @IsNotEmpty()
    id: number;

    @Column()
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @Column()
    @IsString()
    @IsNotEmpty()
    descripcion: string;

    @Column()
    @IsNotEmpty()
    @Transform(({ value }) => new Date(value))
    @IsDate()
    @MaxDate(new Date())
    fechaFundacion: Date;

    @Column()
    @IsNotEmpty()
    @IsUrl()
    urlPaginaWeb: string;

    @ManyToMany(() => AeropuertoEntity, (aeropuerto) => aeropuerto.aerolineas, {
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
    })
    @JoinTable()
    aeropuertos: AeropuertoEntity[];
}
