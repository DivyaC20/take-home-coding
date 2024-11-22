import axios from 'axios';
import { getMoviesByYear, getEditorsByMovieId } from './movieService';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Movie Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch movies by year and page', async () => {
        const movies = [{ id: 1, title: 'Test Movie', release_date: '2022-01-01', vote_average: 8 }];
        mockedAxios.get.mockResolvedValue({ data: { results: movies } });

        const result = await getMoviesByYear(2022, 1);

        expect(mockedAxios.get).toHaveBeenCalledWith(
            'https://api.themoviedb.org/3/discover/movie',
            expect.objectContaining({
                params: expect.objectContaining({
                    primary_release_year: 2022,
                    page: 1,
                }),
            })
        );
        expect(result).toEqual(movies);
    });

    it('should fetch editors by movie id', async () => {
        const crew = [
            { name: 'Editor One', known_for_department: 'Editing' },
            { name: 'Director One', known_for_department: 'Directing' },
        ];
        mockedAxios.get.mockResolvedValue({ data: { crew } });

        const editors = await getEditorsByMovieId(1);

        expect(mockedAxios.get).toHaveBeenCalledWith(
            'https://api.themoviedb.org/3/movie/1/credits',
            expect.objectContaining({
                params: expect.objectContaining({
                    api_key: process.env.TMDB_API_KEY,
                }),
            })
        );
        expect(editors).toEqual(['Editor One']);
    });

    it('should return an empty list if the movie credits API fails', async () => {
        mockedAxios.get.mockRejectedValue(new Error('API Error'));

        const editors = await getEditorsByMovieId(1);

        expect(editors).toEqual([]);
    });
});
