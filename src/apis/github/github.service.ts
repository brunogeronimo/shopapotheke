import { GITHUB_API_VERSION, GITHUB_TOKEN } from '../../utils/config';
import { GraphqlService } from './graphql.service';
import { RestService } from './rest.service';
import { GithubService } from './interfaces/github-service.interface';

export const GITHUB_SERVICE = 'GITHUB_SERVICE';

export function githubService(): GithubService {
  if (GITHUB_API_VERSION === 'GRAPHQL' && !!GITHUB_TOKEN) {
    return new GraphqlService(GITHUB_TOKEN);
  }
  return new RestService();
}