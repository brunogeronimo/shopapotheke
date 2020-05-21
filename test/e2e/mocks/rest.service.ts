import { GithubService } from '../../../src/apis/github/interfaces/github-service.interface';
import { FilterDto } from '../../../src/dto/filter.dto';
import { Repository } from '../../../src/interfaces/repository.interface';

export class RestService implements GithubService {
  search(filter: FilterDto): Promise<Repository[]> {
    return new Promise<Repository[]>((resolve, reject) => {
      resolve([
        new Repository({
          createdAt: new Date('2016-09-23T09:34:46.000Z'),
          description: 'Nice repository',
          name: "nice repo",
          owner: "brunogeronimo",
          stars: 999999,
          url: "https://github.com/brunogeronimo/shopapotheke",
        }),
        new Repository({
          createdAt: new Date('2012-12-12T00:00:00.000Z'),
          description: 'Foo',
          name: "nice repo",
          owner: "brunogeronimo",
          stars: 32767,
          url: "https://github.com/brunogeronimo/foo",
        })
      ]);
    });
  }
}