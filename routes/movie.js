import { Router } from 'express';
import MovieC from '../controllers/MovieC.js';

const router = Router();

// ***** MOVIE API *****
router.get('/list', MovieC.getMovieList);
router.get('/single/:movieId', MovieC.getSingleMovieData);
router.get('/countries', MovieC.getMovieCountries);

export default router;
