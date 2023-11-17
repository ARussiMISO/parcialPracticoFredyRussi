import { IsNumber, IsNotEmpty, IsString, MaxLength, MinLength, IsDate, MaxDate, IsUrl } from '@nestjs/class-validator';
import { Transform } from 'class-transformer';
import { AeropuertoEntity } from 'src/aeropuerto/aeropuerto.entity';
import { PrimaryGeneratedColumn, Column, ManyToMany, Entity } from 'typeorm';

@Entity()
export class AerolineaEntity {
    @PrimaryGeneratedColumn('uuid')
    @IsNumber()
    @IsNotEmpty()
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
    @MaxLength(100)
    @MinLength(3)
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
    aeropuertos: AeropuertoEntity[];
}
