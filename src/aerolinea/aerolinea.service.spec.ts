/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { AerolineaService } from './aerolinea.service';
import { AerolineaEntity } from './aerolinea.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('AerolineaService', () => {
  let service: AerolineaService;
  let repository: Repository<AerolineaEntity>;
  let aerolineaLista: AerolineaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AerolineaService],
    }).compile();

    service = module.get<AerolineaService>(AerolineaService);
    repository = module.get<Repository<AerolineaEntity>>(
      getRepositoryToken(AerolineaEntity),
    );
    await seedDatabase();

  });

  const seedDatabase = async () => {
    repository.clear();
    aerolineaLista = [];

    for (let i = 0; i < 5; i++) {
      const aerolineaId = new AerolineaEntity();
      aerolineaId.nombre = faker.commerce.productName();
      aerolineaId.descripcion = faker.lorem.sentence();
      aerolineaId.fechaFundacion = faker.date.past({ refDate:'2023-11-15T00:00:00.000Z'});
      aerolineaId.urlPaginaWeb = faker.internet.url();
      const aerolinea: AerolineaEntity = await repository.save(aerolineaId)
      aerolineaLista.push(aerolinea);
    }

  }

  it('findAll should return all airlines', async () => {
    const airlines: AerolineaEntity[] = await service.findAll();
    expect(airlines).not.toBeNull();
    expect(airlines).toHaveLength(aerolineaLista.length);
  });

  it('findOne should return a airline by id', async () => {
    const storedAirline = aerolineaLista[0];
    const airline = await service.findOne(storedAirline.id);
    expect(airline).not.toBeNull();
    expect(airline.nombre).toEqual(storedAirline.nombre);
    expect(airline.id).toEqual(storedAirline.id);
    expect(airline.descripcion).toEqual(storedAirline.descripcion);
    expect(airline.urlPaginaWeb).toEqual(storedAirline.urlPaginaWeb);
    expect(airline.fechaFundacion).toEqual(storedAirline.fechaFundacion);

  });

  
  it('findOne should throw an exception for an invalid airline', async () => {
    await expect(() => service.findOne(0)).rejects.toHaveProperty("message", "La aerolinea con el id dado no encontrada");
  });

  it('create should return a new airline', async () => {
    const newAirline: AerolineaEntity = {
      id: 0,
      nombre: faker.company.name(),
      descripcion: faker.lorem.text(),
      fechaFundacion : faker.date.past({ refDate:'2023-11-15T00:00:00.000Z'}),
      urlPaginaWeb : faker.internet.url(),
      aeropuertos: []
    };

    const newAirlinePersisted: AerolineaEntity = await service.create(newAirline);
    expect(newAirlinePersisted).not.toBeNull();

    const airline = await service.findOne(newAirlinePersisted.id);
    expect(airline.nombre).toEqual(newAirlinePersisted.nombre);
    expect(airline.descripcion).toEqual(newAirlinePersisted.descripcion);
    expect(airline.fechaFundacion).toEqual(newAirlinePersisted.fechaFundacion);
    expect(airline.urlPaginaWeb).toEqual(newAirlinePersisted.urlPaginaWeb);


  });

  it('create should throw error for fechaFundacion later to current date', async () => {
    const newAirline: AerolineaEntity = {
      id: 0,
      nombre: faker.company.name(),
      descripcion: faker.lorem.text(),
      fechaFundacion : faker.date.future({ refDate:'2023-11-18T00:00:00.000Z'}),
      urlPaginaWeb : faker.internet.url(),
      aeropuertos: []
    };

    await expect(() => service.create(newAirline)).rejects.toHaveProperty("message", "La fecha de fundación debe ser menor a la actual");
  });

  it('update should modify a airline', async () => {
    const currentAirline = aerolineaLista[0];
    currentAirline.nombre = "Nuevo nombre";
    currentAirline.descripcion = " Nueva descripcion de prueba";

    const airlineUpdated: AerolineaEntity = await service.update(currentAirline.id, currentAirline);
    expect(airlineUpdated).not.toBeNull();
    const storedAirline : AerolineaEntity = await service.findOne(currentAirline.id);
    expect(storedAirline.nombre).toEqual(airlineUpdated.nombre);
    expect(storedAirline.descripcion).toEqual(airlineUpdated.descripcion);
    expect(storedAirline.fechaFundacion).toEqual(airlineUpdated.fechaFundacion);
    expect(storedAirline.urlPaginaWeb).toEqual(airlineUpdated.urlPaginaWeb);

  });

  it('update throw error for fechaFundacion later to current date', async () => {
    const currentAirline = aerolineaLista[0];
    currentAirline.nombre = "Nuevo nombre";
    currentAirline.descripcion = " Nueva descripcion de prueba";
    currentAirline.fechaFundacion = new Date(2024,5,12);

    await expect(() => service.update(currentAirline.id, currentAirline)).rejects.toHaveProperty("message", "La fecha de fundación debe ser menor a la actual");
  });

  it('update should throw an exception for an invalid airline', async () => {
    let airline: AerolineaEntity = aerolineaLista[0];
    airline = {
      ...airline, nombre: "New name", descripcion: " Nueva descripcion de prueba"
    }
 
    await expect(() => service.update(0, airline)).rejects.toHaveProperty("message", "La aerolinea con el id dado no encontrada");
  });

  it('delete should remove a airline', async () => {
    const airline: AerolineaEntity = aerolineaLista[0];
    await service.delete(airline.id);
    await expect(() => service.findOne(airline.id)).rejects.toHaveProperty("message",  "La aerolinea con el id dado no encontrada");

  });

  it('delete should throw an exception for an invalid airline', async () => {
    await expect(() => service.delete(0)).rejects.toHaveProperty("message", "La aerolinea con el id dado no encontrada");
  });
});
