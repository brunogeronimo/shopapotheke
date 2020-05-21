import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { GITHUB_API } from '../../utils/config';
import { FilterDto } from '../../dto/filter.dto';
import { GithubService } from './interfaces/github-service.interface';
import { Repository } from '../../interfaces/repository.interface';
import { DateFilter } from './enums/date-filter.enum';
import { Sort } from '../../enums/sort.enum';
import { Limit } from '../../enums/limit.enum';

@Injectable()
export class RestService implements GithubService {
  search(filter: FilterDto): Promise<Repository[]> {
    return this.makeRequest(filter);
  }

  private makeRequest(filter: FilterDto): Promise<Repository[]> {
    return new Promise((resolve, reject) => {
      let query = `${filter.text ?? ''}`;

      if (filter.languages) {
        query += `lang:${filter.languages.join(' ')} `;
      }

      if (filter.createdBefore) {
        query += `created:${DateFilter.BEFORE}${filter.createdBefore} `;
      }

      if (filter.createdAfter) {
        query += `created:${DateFilter.AFTER}${filter.createdAfter} `;
      }

      query += `sort:${filter.sortBy ?? Sort.STARS_DESC}`;

      const params = {
        q: query,
        per_page: filter.limit ?? Limit.TEN
      }

      axios.get(`${GITHUB_API}/search/repositories`, { params })
        .then(response => {
          const github = response.data;

          const repositories: Repository[] = github.items.map(item => {
            return new Repository({
              createdAt: new Date(item.created_at),
              description: item.description,
              name: item.name,
              owner: item.owner.login,
              stars: item.stargazers_count,
              url: item.url
            })
          });

          resolve(repositories);
      }).catch(error => {
        console.error(error);
        reject(error);
      });
    })
  }
}