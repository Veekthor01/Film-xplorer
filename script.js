const tmdbKey = process.env.tmdbKey;
const tmdbBaseUrl = 'https://api.themoviedb.org/3';
const playBtn = document.getElementById('playBtn');
const form = document.getElementById('form');
const select = document.getElementById('genres');

// Load liked and disliked movies from local storage
const myLikedMovies = loadLikedMovies();
const myDislikedMovies = loadDislikedMovies();

if (myLikedMovies) {
  myLikedMovies.forEach((movie) => createLikedMovie(movie));
}

if (myDislikedMovies) {
  myDislikedMovies.forEach((movie) => createDislikedMovie(movie));
}

// API calls
const getGenres = async () => {
  const genreRequestEndpoint = '/genre/movie/list';
  const requestParams = `?api_key=${tmdbKey}`;
  const urlToFetch = tmdbBaseUrl + genreRequestEndpoint + requestParams;

  try {
    const response = await fetch(urlToFetch);
    if (response.ok) {
      const jsonResponse = await response.json();
      const genres = jsonResponse.genres;
      return genres;
    }
  } catch (error) {
    console.log(error);
  }
};

const getMovies = async () => {
    const selectedGenre = getSelectedGenre();
    const discoverMovieEndpoint = '/discover/movie';
    const urlToFetch = `${tmdbBaseUrl}${discoverMovieEndpoint}?api_key=${tmdbKey}&with_genre=${selectedGenre}`;
    try {
      const response = await fetch(urlToFetch);
      if (response.ok) {
        const jsonResponse = await response.json();
        const totalResults = jsonResponse.total_results;
        const totalPages = jsonResponse.total_pages;
        const randomPage = Math.floor(Math.random() * totalPages) + 1;
        const requestParams = `?api_key=${tmdbKey}&with_genre=${selectedGenre}&page=${randomPage}`;
        const urlToFetch = `${tmdbBaseUrl}${discoverMovieEndpoint}${requestParams}`;
        const secondResponse = await fetch(urlToFetch);
        if (response.ok) {
          const jsonResponse = await response.json();
          const movies = jsonResponse.results;
          return movies;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

const getMovieInfo = async (movie) => {
  const movieId = movie.id;
  const movieEndpoint = `/movie/${movieId}`;
  const requestParams = `?api_key=${tmdbKey}`;
  const urlToFetch = tmdbBaseUrl + movieEndpoint + requestParams;

  try {
    const response = await fetch(urlToFetch);
    if (response.ok) {
      const movieInfo = await response.json();
      return movieInfo;
    }
  } catch (error) {
    console.log(error);
  }
};

// Gets a list of movies and ultimately displays the info of a random movie from the list
const showRandomMovie = async () => {
    const selectedGenre = getSelectedGenre();
    const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${tmdbKey}&with_genres=${selectedGenre}`);
    const data = await response.json();
    const randomMovie = getRandomMovie(data.results);
    displayMovie(randomMovie);
  };
  
getGenres().then(populateGenreDropdown);
playBtn.onclick = showRandomMovie;

form.addEventListener('submit', (e) => {
  e.preventDefault();
  showRandomMovie();
});
