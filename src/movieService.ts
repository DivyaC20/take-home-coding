import axios from 'axios';

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export const getMoviesByYear = async (year: number, page: number) => {
    console.log(API_KEY);
    const response = await axios.get(`${BASE_URL}/discover/movie`, {
        params: {
            api_key: API_KEY,
            language: 'en-US',
            primary_release_year: year,
            sort_by: 'popularity.desc',
            page: page
        }
    });
    return response.data.results;
};

export const getEditorsByMovieId = async (movieId: number) => {
    try {
       // console.log(API_KEY);
        const response = await axios.get(`${BASE_URL}/movie/${movieId}/credits`, {
            params: {
                api_key: API_KEY
            }
        });
        const editors = response.data.crew.filter((member: any) => member.known_for_department === 'Editing').map((member: any) => member.name);
        return editors;
    } catch (error) {
        //console.error(`error fetching editors : ${error}`);
        // Return an empty list if the request fails
        return [];
    }
};
