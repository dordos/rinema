import React, { SetStateAction, useCallback, useEffect } from 'react';
import { useState } from 'react';
import './style.scss';
// import MovieModal from '../../components/MovieModal';
import axios from 'axios';
import MovieModal from '../../components/MovieModal';
// import MoviePreview from '../../components/MovieModal';

const Movies = () => {
  // MovieModal
  const [movieModalState, setMovieModalState] = useState(false);
  const [selectMovie, setSelectMovie] = useState();

  const [movieInfo, setMovieInfo] = useState([]);
  const API_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=ko-KR&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate`;
  const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

  useEffect(() => {
    async function movieData() {
      const response = await axios.get(API_URL);
      setMovieInfo(response.data.results);
    }
    movieData();
    // writeUserData('eieie', 'eieiei', 'eie');
  }, []);

  const onMovieDetail = (id: SetStateAction<undefined>) => {
    const selectMovie = `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=ko-KR`;
    const response = axios.get(selectMovie);
    setMovieModalState(!movieModalState);
    setSelectMovie(id);
  };

  const closeModal = () => setMovieModalState(false);

  return (
    <>
      <ul className='moviesContainer'>
        {movieInfo.map((movie: any) => (
          <li
            key={movie.id}
            onClick={() => {
              onMovieDetail(movie.id);
            }}
          >
            <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt='' />
          </li>
        ))}
      </ul>
      {movieModalState && (
        <MovieModal
          selectMovie={selectMovie}
          movieModalState={movieModalState}
          closeModal={closeModal}
        />
      )}
    </>
  );
};

export default Movies;
