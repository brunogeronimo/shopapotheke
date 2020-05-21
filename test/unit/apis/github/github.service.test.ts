jest.mock('../../../../src/apis/github/graphql.service');
jest.mock('../../../../src/apis/github/rest.service');

import { GraphqlService } from '../../../../src/apis/github/graphql.service';
import { githubService } from '../../../../src/apis/github/github.service';
import { GITHUB_API_VERSION, GITHUB_TOKEN } from '../../../../src/utils/config';
import * as config from "../../../../src/utils/config";
import { RestService } from '../../../../src/apis/github/rest.service';

describe('githubService function', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // @ts-ignore
    delete config['GITHUB_API_VERSION'];
    // @ts-ignore
    delete config['GITHUB_TOKEN'];
  })

  it('Should instantiate a GraphqlService if variables are properly set', () => {
    // @ts-ignore
    config['GITHUB_API_VERSION'] = 'GRAPHQL';
    // @ts-ignore
    config['GITHUB_TOKEN'] = 'foo-token';
    const service = githubService();

    expect(service).toBeInstanceOf(GraphqlService);
  });

  it('Should instantiate a RestService if required variables are not set', () => {
    // @ts-ignore
    config['GITHUB_API_VERSION'] = 'GRAPHQL';

    const service = githubService();

    expect(service).toBeInstanceOf(RestService);
  });

  it('Should instantiate a RestService if set', () => {
    // @ts-ignore
    config['GITHUB_API_VERSION'] = 'REST';

    const service = githubService();

    expect(service).toBeInstanceOf(RestService);
  });

  it('Should instantiate RestService by default', () => {
    const service = githubService();

    expect(service).toBeInstanceOf(RestService);
  })
});