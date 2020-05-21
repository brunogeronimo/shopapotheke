import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../../src/app.controller';
import { FilterDto } from '../../src/dto/filter.dto';
import { GITHUB_SERVICE, githubService } from '../../src/apis/github/github.service';
import { RestService } from '../../src/apis/github/rest.service';
import { isEmptyObject } from '../../src/utils/isEmptyObject';
import { Repository } from '../../src/interfaces/repository.interface';

jest.mock('../../src/apis/github/interfaces/github-service.interface');
jest.mock('../../src/apis/github/rest.service');
jest.mock('../../src/utils/isEmptyObject');
jest.mock('../../src/apis/github/github.service');

describe('AppController', () => {
  let appController: AppController;
  let filterDto: FilterDto;
  let restService: RestService;

  beforeEach(async () => {
    filterDto = new FilterDto();
    restService = new RestService();

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{
        provide: GITHUB_SERVICE,
        useValue: restService
      }],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('/repositories route', () => {
    it('Should return error if filter is blank"', async (done) => {
      // @ts-ignore
      isEmptyObject.mockImplementation(() => {
        return true;
      });

      appController.getRepositories(filterDto).catch((error) => {
        expect(error).toMatchSnapshot();
        done();
      });
    });

    it('Should return a valid response', async () => {
      // @ts-ignore
      isEmptyObject.mockImplementation(() => {
        return false;
      });
      // @ts-ignore
      githubService.mockImplementation(() => {
        return restService;
      });
      // @ts-ignore
      restService.search = () => {
        return Promise.resolve([
          new Repository({
            createdAt: new Date('2016-09-23T09:34:46.000Z'),
            description: "依赖于 org.common.lang 的 java 工具库",
            name: "tool",
            owner: "OrsonEx",
            stars: 77,
            url: "https://github.com/OrsonEx/tool",
          })
        ]);
      };

      const repositories = await appController.getRepositories(filterDto);

      expect(repositories).toMatchSnapshot();
    })
  });
});
