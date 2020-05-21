import { ApiProperty } from '@nestjs/swagger';

export interface IRepositoryParams {
  createdAt: Date,
  description?: string,
  name: string,
  owner: string,
  stars: number,
  url: string,
}

export class Repository {
  @ApiProperty()
  private readonly createdAt: Date;

  @ApiProperty()
  private readonly description?: string;

  @ApiProperty()
  private readonly name: string;

  @ApiProperty()
  private readonly owner: string;

  @ApiProperty()
  private readonly stars: number;

  @ApiProperty()
  private readonly url: string;

  public constructor(params: IRepositoryParams) {
    this.createdAt = params.createdAt;
    this.description = params.description;
    this.name = params.name;
    this.owner = params.owner;
    this.stars = params.stars;
    this.url = params.url;
  }
}