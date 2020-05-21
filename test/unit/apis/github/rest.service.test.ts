import { RestService } from '../../../../src/apis/github/rest.service';
import { EMPTY_RESPONSE, VALID_RESPONSE } from './assets/rest.respose.mock';
import { FilterDto } from '../../../../src/dto/filter.dto';
import axios from "axios";
import { Limit } from '../../../../src/enums/limit.enum';
import { Sort } from '../../../../src/enums/sort.enum';
import { DateFilter } from '../../../../src/apis/github/enums/date-filter.enum';

jest.mock('axios');

describe('REST Service', () => {
  let restService: RestService;

  beforeEach(() => {
    jest.clearAllMocks();

    restService = new RestService();
  });

  it('Should parse response properly', async () => {
    // @ts-ignore
    axios.get.mockResolvedValue({
      data: VALID_RESPONSE
    });

    const repositories = await restService.search(new FilterDto());

    expect(axios.get).toBeCalledWith(
      expect.any(String),
      expect.objectContaining({params: {
          per_page: "10",
          q: "sort:stars-desc"
      }})
    );
    expect(repositories).toMatchSnapshot();
  });

  it('Should not break if there are no repositories in the response', async () => {
    // @ts-ignore
    axios.get.mockResolvedValue({
      data: EMPTY_RESPONSE
    });

    const repositories = await restService.search(new FilterDto());

    expect(axios.get).toBeCalled();
    expect(repositories).toMatchObject([]);
  });

  it('Should dispatch the error if something goes wrong', async (done) => {
    // @ts-ignore
    jest.spyOn(console, 'error').mockImplementation();

    const rejectionMock = jest.fn();

    // @ts-ignore
    axios.get.mockImplementationOnce(() => {
      return new Promise((resolved, rejected) => {
        rejected(rejectionMock);
      });
    });

    restService.search(new FilterDto()).catch(reject => {
      expect(axios.get).toBeCalled();
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
          sortBy: Sort.STARS_DESC
        },
        'sort:stars-desc'
      ],
      [
        {
          limit: Limit.ONE_HUNDRED
        },
        '100'
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
    axios.get.mockResolvedValue({
      data: EMPTY_RESPONSE
    });

    const filterDto = new FilterDto();
    const key = Object.keys(filter)[0];

    filterDto[key] = filter[key];

    await restService.search(filterDto);

    let validation;

    if (filterDto.limit) {
      validation = { per_page: expect.stringContaining(searchString) }
    } else {
      validation = { q: expect.stringContaining(searchString) }
    }

    expect(axios.get).toBeCalledWith(
      expect.any(String),
      expect.objectContaining({
        params: expect.objectContaining(validation)
      })
    );
  })

});