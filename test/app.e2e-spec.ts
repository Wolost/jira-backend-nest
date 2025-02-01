import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Integration Test (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/tasks (GET)', () => {
    return request(app.getHttpServer()).get('/tasks').expect(401);
  });

  it('/tasks (POST)', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'jane.doe@example.com', password: 'securepassword' });

    const token = loginResponse.body.access_token;

    return request(app.getHttpServer())
      .post('/tasks/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'New Task',
        description: 'Integration Test',
        projectId: 1,
        priorityId: 1,
        typeId: 1,
        assigneeId: 1,
      })
      .expect(201);
  });

  afterAll(async () => {
    await app.close();
  });
});
