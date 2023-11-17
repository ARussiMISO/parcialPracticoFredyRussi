/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { AeropuertoService } from './aeropuerto.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AeropuertoEntity } from './aeropuerto.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('AeropuertoService', () => {
  let service: AeropuertoService;
  let repository: Repository<AeropuertoEntity>;
  let aeropuertoLista: AeropuertoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AeropuertoService],
    }).compile();

    service = module.get<AeropuertoService>(AeropuertoService);
    repository = module.get<Repository<AeropuertoEntity>>(
      getRepositoryToken(AeropuertoEntity),
    );
    await seedDatabase();

  });

  const seedDatabase = async () => {
    repository.clear
    aeropuertoLista = [];

    for (let i = 0; i < 5; i++) {
      const airport = new AeropuertoEntity();
      airport.nombre = faker.commerce.productName();
      airport.ciudad = faker.lorem.sentence();      
      airport.pais = faker.lorem.sentence();
      airport.codigo = faker.string.alphanumeric({length: 3});
      const newAirport: AeropuertoEntity = await repository.save(airport)
      aeropuertoLista.push(newAirport);
    }

  }

  it('findAll should return all airports', async () => {
    const airports: AeropuertoEntity[] = await service.findAll();
    expect(airports).not.toBeNull();
    expect(airports).toHaveLength(aeropuertoLista.length);
  });

  it('findOne should return a airport by id', async () => {
    const storedAirport = aeropuertoLista[0];
    const airport = await service.findOne(storedAirport.id);
    expect(airport).not.toBeNull();
    expect(airport.nombre).toEqual(storedAirport.nombre);
    expect(airport.id).toEqual(storedAirport.id);
    expect(airport.ciudad).toEqual(storedAirport.ciudad);
    expect(airport.codigo).toEqual(storedAirport.codigo);
    expect(airport.pais).toEqual(storedAirport.pais);

  });

  it('findOne should throw an exception for an invalid airport', async () => {
    await expect(() => service.findOne(0)).rejects.toHaveProperty("message", "El aeropuerto con el id dado no encontrado");
  });

  it('create should return a new airport', async () => {
    const newAirport: AeropuertoEntity = {
      id: 9,
      nombre: faker.company.name(),
      ciudad : faker.lorem.sentence(),
      pais : faker.lorem.sentence(),
      codigo : faker.string.alphanumeric({length: 3}),
      aerolineas: []
    };

    const newAirportPersisted: AeropuertoEntity = await service.create(newAirport);
    expect(newAirportPersisted).not.toBeNull();

    const airport = await service.findOne(newAirportPersisted.id);
    expect(airport.nombre).toEqual(newAirportPersisted.nombre);
    expect(airport.ciudad).toEqual(newAirportPersisted.ciudad);
    expect(airport.pais).toEqual(newAirportPersisted.pais);
    expect(airport.codigo).toEqual(newAirportPersisted.codigo);


  });

  it('create should throw error for codigo lenght != 3', async () => {
    const newAirport: AeropuertoEntity = {
      id: 9,
      nombre: faker.company.name(),
      ciudad : faker.lorem.sentence(),
      pais : faker.lorem.sentence(),
      codigo : faker.string.alphanumeric({length: 4}),
      aerolineas: []
    };

    await expect(() => service.create(newAirport)).rejects.toHaveProperty("message", "La longitud del codigo del aeropuerto debe ser igual a 3");
  });

  it('update should modify a airport', async () => {
    const currentAirport = aeropuertoLista[0];
    currentAirport.nombre = "Nuevo nombre";
    currentAirport.ciudad = " Nueva ciudad";

    const airportUpdated: AeropuertoEntity = await service.update(currentAirport.id, currentAirport);
    expect(airportUpdated).not.toBeNull();
    const storedAirport : AeropuertoEntity = await service.findOne(currentAirport.id);
    expect(storedAirport.nombre).toEqual(airportUpdated.nombre);
    expect(storedAirport.ciudad).toEqual(airportUpdated.ciudad);
    expect(storedAirport.pais).toEqual(airportUpdated.pais);
    expect(storedAirport.codigo).toEqual(airportUpdated.codigo);

  });

  it('update throw error for codigo lenght != 3', async () => {
    const currentAirline = aeropuertoLista[0];
    currentAirline.nombre = "Nuevo nombre";
    currentAirline.pais = " Nuevo pais";
    currentAirline.codigo = faker.string.alphanumeric({length: 4});

    await expect(() => service.update(currentAirline.id, currentAirline)).rejects.toHaveProperty("message", "La longitud del codigo del aeropuerto debe ser igual a 3");
  });

  it('update should throw an exception for an invalid airport', async () => {
    let airport: AeropuertoEntity = aeropuertoLista[0];
    airport = {
      ...airport, nombre: "New name", codigo: faker.string.alphanumeric({length: 3})
    }
 
    await expect(() => service.update(0, airport)).rejects.toHaveProperty("message", "El aeropuerto con el id dado no encontrado");
  });

  it('delete should remove a airport', async () => {
    const airport: AeropuertoEntity = aeropuertoLista[0];
    await service.delete(airport.id);
    await expect(() => service.findOne(airport.id)).rejects.toHaveProperty("message",  "El aeropuerto con el id dado no encontrado");

  });

  it('delete should throw an exception for an invalid airport', async () => {
    await expect(() => service.delete(0)).rejects.toHaveProperty("message", "El aeropuerto con el id dado no encontrado");
  });

});
