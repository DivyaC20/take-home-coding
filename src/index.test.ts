import request from 'supertest';
import express from 'express';
import { getMoviesByYear, getEditorsByMovieId } from './movieService';
import { app } from './index';

jest.mock('./movieService');
const mockedGetMoviesByYear = getMoviesByYear as jest.MockedFunction<typeof getMoviesByYear>;
const mockedGetEditorsByMovieId = getEditorsByMovieId as jest.MockedFunction<typeof getEditorsByMovieId>;

describe('API Endpoint', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch movies for a specific year and page', async () => {
        const movies = [
            { id: 1, title: 'Test Movie', release_date: '2022-01-01', vote_average: 8 }
        ];
        const editors = ['Editor One', 'Editor Two'];

        mockedGetMoviesByYear.mockResolvedValue(movies);
        mockedGetEditorsByMovieId.mockResolvedValue(editors);

        const response = await request(app).get('/movies/2022?page=1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([{
            title: 'Test Movie',
            release_date: '2022-01-01',
            vote_average: 8,
            editors
        }]);
    });

    it('should handle errors gracefully and return 500 status code', async () => {
        mockedGetMoviesByYear.mockRejectedValue(new Error('API Error'));

        const response = await request(app).get('/movies/2022?page=1');

        expect(response.status).toBe(500);
        expect(response.text).toBe('An error occurred while fetching the movies.');
    });
});
