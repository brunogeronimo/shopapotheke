import { FilterDto } from '../../../dto/filter.dto';
import { Repository } from '../../../interfaces/repository.interface';

export interface GithubService {
  search(filter: FilterDto): Promise<Repository[]>
}