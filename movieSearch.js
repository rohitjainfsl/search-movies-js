const form = document.querySelector("form");
const movieName = document.querySelector("input");
form.onsubmit = (e) => {
  e.preventDefault();
  fetch(
    "https://api.themoviedb.org/3/search/movie?api_key=8125db8f67d23da1d30f6063b1b794b8&language=en-US&query=" +
      movieName.value +
      "&page=1&include_adult=false"
  )
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      console.log(result.results);
      showMovies(result.results);
    });
};

function showMovies(data) {
  const resultsDiv = document.querySelector("#results");
  resultsDiv.innerHTML = "";
  if (data.length === 0) {
    const noMovieDiv = document.createElement("h2");
    noMovieDiv.innerHTML =
      "Nothing found by this name. Search something else...";
    resultsDiv.append(noMovieDiv);
  } else {
    data.forEach((movie) => {
      const movieDiv = document.createElement("div");
      movieDiv.classList.add("movie");
      const poster = document.createElement("img");
      const name = document.createElement("h3");

      poster.src = movie.poster_path
        ? "https://image.tmdb.org/t/p/original" + movie.poster_path
        : "no-poster-available.jpg";
      name.innerHTML = trimName(movie.original_title);

      fetch(
        "https://api.themoviedb.org/3/movie/" +
          movie.id +
          "/videos?api_key=8125db8f67d23da1d30f6063b1b794b8&language=en-US"
      )
        .then((response) => {
          return response.json();
        })
        .then((result) => {
          if (result.results.length > 0) {
            const trailerKey = findTrailer(result.results);
            if (trailerKey) movieDiv.append(getPlayTrailerButton(trailerKey));
          }
        });

      movieDiv.append(poster);
      movieDiv.append(name);
      resultsDiv.append(movieDiv);
    });
  }
}

function trimName(name) {
  return name.length > 50 ? name.slice(0, 50) + "..." : name;
}

function findTrailer(data) {
  const videoObject = data.find(
    (obj) => obj.site === "YouTube" && obj.type === "Trailer"
  );
  if (videoObject === "undefined") return false;
  else return videoObject.key;
}

function getPlayTrailerButton(key) {
  const anchor = document.createElement("a");
  anchor.href = "https://youtube.com/embed/" + key;
  anchor.target = "_blank";
  anchor.innerHTML = "Play Trailer";
  return anchor;
}
