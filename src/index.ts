import express from 'express';
import dotenv from 'dotenv';
import { getMoviesByYear, getEditorsByMovieId } from './movieService';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.get('/movies/:year', async (req, res) => {
    const year = parseInt(req.params.year, 10);
    const page = parseInt(req.query.page as string, 10) || 1;

    try {
        const movies = await getMoviesByYear(year, page);
        const movieDetails = await Promise.all(movies.map(async (movie: any) => {
            const editors = await getEditorsByMovieId(movie.id);
            return {
                title: movie.title,
                release_date: movie.release_date,
                vote_average: movie.vote_average,
                editors
            };
        }));
        res.json(movieDetails);
    } catch (error) {
        //console.error(`error fetching movies : ${error}`);
        res.status(500).send('An error occurred while fetching the movies.');
    }
});
/*
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});*/
export {app};