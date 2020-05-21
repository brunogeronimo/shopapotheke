import { Injectable } from '@nestjs/common';
import { GITHUB_API } from '../../utils/config';
import axios from 'axios';
import { FilterDto } from '../../dto/filter.dto';
import { GithubService } from './interfaces/github-service.interface';
import { Repository } from '../../interfaces/repository.interface';
import { Sort } from '../../enums/sort.enum';
import { Limit } from '../../enums/limit.enum';
import { DateFilter } from './enums/date-filter.enum';

@Injectable()
export class GraphqlService implements GithubService {
  constructor(private readonly token: string) {}

  async search(filter: FilterDto): Promise<Repository[]> {
    return this.makeRequest(filter);
  }

  private async makeRequest(filter: FilterDto): Promise<Repository[]> {
    const body = this.prepareBody(filter);

    return new Promise((resolve, reject) => {
      axios.post(`${GITHUB_API}/graphql`,
        {
          query: body
        },
        {
          headers: {
            Authorization: `bearer ${this.token}`
          }
      }).then(response => {
        const github = response.data;

        const repositories: Repository[] = github.data.search.nodes.map(node => {
          return new Repository({
            createdAt: new Date(node.createdAt),
            description: node.description,
            name: node.name,
            owner: node.owner.login,
            stars: node.stargazers.totalCount,
            url: node.url
          });
        });

        resolve(repositories);
      }).catch(error => {
        console.error(error);
        reject(error);
      });
    });
  }

  private prepareBody(filter: FilterDto): string {
    let query = `${filter.text ?? ''} `;

    if (filter.languages) {
      query += `lang:${filter.languages.join(' ')} `;
    }

    if (filter.createdAfter) {
      query += `created:${DateFilter.AFTER}${filter.createdAfter} `;
    }

    if (filter.createdBefore) {
      query += `created:${DateFilter.BEFORE}${filter.createdBefore} `;
    }

    query += `sort:${filter.sortBy ?? Sort.STARS_DESC} `;

    return `
      query {
        search(query: "${query}", type: REPOSITORY, first: ${filter.limit ?? Limit.TEN}) {
          nodes {
            ... on Repository {
              name,
              owner {
                login
              },
              createdAt,
              description,
              url,
              stargazers {
                totalCount
              }
            }
          }
        }
      }
    `;
  }
}