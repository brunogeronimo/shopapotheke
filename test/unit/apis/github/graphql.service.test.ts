import axios from "axios";
import { GraphqlService } from '../../../../src/apis/github/graphql.service';
import { FilterDto } from '../../../../src/dto/filter.dto';
import { EMPTY_RESPONSE, VALID_RESPONSE } from './assets/graphql.response.mock';
import { Limit } from '../../../../src/enums/limit.enum';
import { Sort } from '../../../../src/enums/sort.enum';
import { DateFilter } from '../../../../src/apis/github/enums/date-filter.enum';

jest.mock('axios');

describe('GraphQL Service', () => {
  const TOKEN = 'foo_token';

  let graphqlService: GraphqlService;

  beforeEach(() => {
    jest.clearAllMocks();

    graphqlService = new GraphqlService(TOKEN);
  });

  it('Should authenticate requests', async () => {
    // @ts-ignore
    axios.post.mockResolvedValue({
      data: EMPTY_RESPONSE
    });

    await graphqlService.search(new FilterDto());

    expect(axios.post).toBeCalledWith(
      expect.any(String),
      expect.any(Object),
      { headers: { Authorization: `bearer ${TOKEN}` } }
    );
  });

  it('Should parse response properly', async () => {
    // @ts-ignore
    axios.post.mockResolvedValue({
      data: VALID_RESPONSE
    });

    const repositories = await graphqlService.search(new FilterDto());

    expect(axios.post).toBeCalled();
    expect(repositories).toMatchSnapshot();
  });

  it('Should not break if there are no repositories in the response', async () => {
    // @ts-ignore
    axios.post.mockResolvedValue({
      data: EMPTY_RESPONSE
    });

    const repositories = await graphqlService.search(new FilterDto());

    expect(axios.post).toBeCalled();
    expect(repositories).toMatchObject([]);
  });

  it('Should dispatch the error if something goes wrong', async (done) => {
    // @ts-ignore
    jest.spyOn(console, 'error').mockImplementation();

    const rejectionMock = jest.fn();

    // @ts-ignore
    axios.post.mockImplementationOnce(() => {
      return new Promise((resolved, rejected) => {
        rejected(rejectionMock);
      });
    });

    graphqlService.search(new FilterDto()).catch(reject => {
      expect(axios.post).toBeCalled();
      expect(console.error).toBeCalled();
      done();
    });
  });

  it.each(
    [
      [
        {
          languages: ['PHP', 'Clojure']
        },
        'lang:PHP Clojure'
      ],
      [
        {
          limit: Limit.ONE_HUNDRED
        },
        'first: 100'
      ],
      [
        {
          sortBy: Sort.STARS_DESC
        },
        'sort:stars-desc'
      ],
      [
        {
          text: 'foo text'
        },
        'foo text'
      ],
      [
        {
          createdAfter: '2012-12-12'
        },
        `${DateFilter.AFTER}2012-12-12`
      ],
      [
        {
          createdBefore: '2020-01-01'
        },
        `${DateFilter.BEFORE}2020-01-01`
      ]
    ]
  )('Adds filters to query', async (filter: Object, searchString: string) => {
    // @ts-ignore
    axios.post.mockResolvedValue({
      data: EMPTY_RESPONSE
    });

    const filterDto = new FilterDto();
    const key = Object.keys(filter)[0];

    filterDto[key] = filter[key];

    await graphqlService.search(filterDto);

    expect(axios.post).toBeCalledWith(
      expect.any(String),
      expect.objectContaining({query: expect.stringContaining(searchString)}),
      expect.any(Object)
    );
  })

});