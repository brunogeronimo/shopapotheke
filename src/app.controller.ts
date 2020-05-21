import { Controller, Get, HttpException, HttpStatus, Inject, Query } from '@nestjs/common';
import { isEmptyObject } from './utils/isEmptyObject';
import { GithubService } from './apis/github/interfaces/github-service.interface';
import { FilterDto } from './dto/filter.dto';
import { Repository } from './interfaces/repository.interface';
import { GITHUB_SERVICE } from './apis/github/github.service';
import { ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(@Inject(GITHUB_SERVICE) private readonly githubService: GithubService) {}

  @Get("repositories")
  @ApiResponse({ status: HttpStatus.OK, description: 'Successful request' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Error' })
  @ApiResponse({ type: Repository })
  async getRepositories(@Query() parameters: FilterDto): Promise<Repository[] | Object> {
    if (isEmptyObject(parameters)) {
      throw new HttpException({
        message: 'At least one filter has to be set.'
      }, HttpStatus.BAD_REQUEST);
    }

    return await this.githubService.search(parameters);
  }
}
