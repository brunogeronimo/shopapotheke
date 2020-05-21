import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { GITHUB_SERVICE } from '../../src/apis/github/github.service';
import { RestService } from './mocks/rest.service';
import { AppController } from '../../src/app.controller';

describe('E2E - GET /repositories', () => {
  let app: INestApplication;

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: GITHUB_SERVICE,
          useValue: new RestService()
        }
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({
      transform: true,
      whitelist: true
    }));

    await app.init();
  });

  it('Should return an error if filters are not set', () => {
    return request(app.getHttpServer())
      .get('/repositories')
      .expect(400)
      .expect({message: "At least one filter has to be set."});
  });

  it.each([
    [
      'languages=bla',
      'languages must be an array'
    ],
    [
      'limit=wrong',
      'limit must be a valid enum value'
    ],
    [
      'sortBy=wrong',
      'sortBy must be a valid enum value'
    ],
    [
      'createdAfter=INVALID-DATE',
      'createdAfter must be a valid ISO 8601 date string'
    ],
    [
      'createdBefore=INVLAID-DATE',
      'createdBefore must be a valid ISO 8601 date string'
    ]
  ])('Should return errors if fields have an incorrect format', (params, result) => {
    return request(app.getHttpServer())
      .get(`/repositories?${params}`)
      .expect(400)
      .expect({
        statusCode: 400,
        message: [
          result
        ],
        error: 'Bad Request'
      });
  });

  it('Should return a proper response', () => {
    return request(app.getHttpServer())
      .get(`/repositories?text=foo`)
      .expect(200)
      .expect([
        {
          createdAt: '2016-09-23T09:34:46.000Z',
          description: 'Nice repository',
          name: "nice repo",
          owner: "brunogeronimo",
          stars: 999999,
          url: "https://github.com/brunogeronimo/shopapotheke",
        },
        {
          createdAt: '2012-12-12T00:00:00.000Z',
          description: 'Foo',
          name: 'nice repo',
          owner: 'brunogeronimo',
          stars: 32767,
          url: 'https://github.com/brunogeronimo/foo'
        }
      ]);
  })
});
