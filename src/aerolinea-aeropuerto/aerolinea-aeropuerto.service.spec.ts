/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AerolineaService } from '../aerolinea/aerolinea.service';
import { AeropuertoService } from '../aeropuerto/aeropuerto.service';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { faker } from '@faker-js/faker';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('AerolineaAeropuertoService', () => {
  let service: AerolineaAeropuertoService;
  let repositoryAirport: Repository<AeropuertoEntity>;
  let repositoryAirline: Repository<AerolineaEntity>;
  let airportList: AeropuertoEntity[];
  let airline: AerolineaEntity;



  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AerolineaAeropuertoService, AerolineaService, AeropuertoService],
    }).compile();

    service = module.get<AerolineaAeropuertoService>(AerolineaAeropuertoService);
    repositoryAirline = module.get<Repository<AerolineaEntity>>(
      getRepositoryToken(AerolineaEntity),
    );
    repositoryAirport = module.get<Repository<AeropuertoEntity>>(
      getRepositoryToken(AeropuertoEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {

    repositoryAirport.clear()
    airportList = [];

    for (let i = 0; i < 5; i++) {
      const airport = new AeropuertoEntity();
      airport.nombre = faker.commerce.productName();
      airport.ciudad = faker.lorem.sentence();
      airport.pais = faker.lorem.sentence();
      airport.codigo = faker.string.alphanumeric({ length: 3 });
      const newAirport: AeropuertoEntity = await repositoryAirport.save(airport);
      airportList.push(newAirport);
    }

    airline = await repositoryAirline.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.text(),
      fechaFundacion: faker.date.past({ refDate: '2023-11-15T00:00:00.000Z' }),
      urlPaginaWeb: faker.internet.url(),
      aeropuertos: airportList
    }
    );


  }

  it('addAirportToAirline should add an airport to a airline', async () => {

    const newAirport: AeropuertoEntity = await repositoryAirport.save({
      nombre: faker.company.name(),
      ciudad : faker.lorem.sentence(),
      pais : faker.lorem.sentence(),
      codigo : faker.string.alphanumeric({length: 3}),
      aerolineas: []
    });

    const newAirline: AerolineaEntity = await repositoryAirline.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.text(),
      fechaFundacion : faker.date.past({ refDate:'2023-11-15T00:00:00.000Z'}),
      urlPaginaWeb : faker.internet.url(),
      aeropuertos: []
    });

    const result: AerolineaEntity = await service.addAirportToAirline(newAirline.id, newAirport.id);

    expect(result.aeropuertos.length).toBe(1);
    expect(result.aeropuertos[0]).not.toBeNull();
    expect(result.aeropuertos[0].nombre).toEqual(newAirport.nombre);
    expect(result.aeropuertos[0].ciudad).toEqual(newAirport.ciudad);
    expect(result.aeropuertos[0].codigo).toEqual(newAirport.codigo);
    expect(result.aeropuertos[0].pais).toEqual(newAirport.pais);
  });

  it('addAirportToAirline should thrown exception for an invalid airport', async () => {

    const newAirline: AerolineaEntity = await repositoryAirline.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.text(),
      fechaFundacion : faker.date.past({ refDate:'2023-11-15T00:00:00.000Z'}),
      urlPaginaWeb : faker.internet.url(),
      aeropuertos: []
    });

    await expect(() => service.addAirportToAirline(newAirline.id, 0)).rejects.toHaveProperty("message", "El aeropuerto con el id dado no encontrado");
  });

  it('addAirportToAirline should thrown exception for an invalid airline', async () => {

    const newAirport: AeropuertoEntity = await repositoryAirport.save({
      nombre: faker.company.name(),
      ciudad : faker.lorem.sentence(),
      pais : faker.lorem.sentence(),
      codigo : faker.string.alphanumeric({length: 3}),
      aerolineas: []
    });

    await expect(() => service.addAirportToAirline(0, newAirport.id)).rejects.toHaveProperty("message", "La aerolinea con el id dado no encontrada");

  });

  it('findAirportFromAirline should return airport by airline', async () => {
    const airport: AeropuertoEntity = airportList[0];
    const storedAirport: AeropuertoEntity = await service.findAirportFromAirline(airline.id, airport.id);
    expect(storedAirport).not.toBeNull();
    expect(storedAirport.nombre).toEqual(airport.nombre);
    expect(storedAirport.ciudad).toEqual(airport.ciudad);
    expect(storedAirport.codigo).toEqual(airport.codigo);
    expect(storedAirport.pais).toEqual(airport.pais);

  });

  it('findAirportFromAirline should throw an exception for an invalid airport', async () => {
    await expect(() => service.findAirportFromAirline(airline.id, 0)).rejects.toHaveProperty("message", "El aeropuerto con el id dado no encontrado");
  });

  it('findAirportFromAirline should throw an exception for an invalid airline', async () => {
    await expect(() => service.findAirportFromAirline(0, airportList[0].id)).rejects.toHaveProperty("message", "La aerolinea con el id dado no encontrada");
  });

});
