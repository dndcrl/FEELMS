const swiper = new Swiper('.swiper-container', {
    direction: 'horizontal',
    rtl: false,
    loop: false,
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    spaceBetween: 20,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    effect: 'coverflow',
    coverflowEffect: {
        rotate: 20,
        stretch: 0,
        depth: 500,
        modifier: 1,
        slideShadows: true,
    },
    on: {
        slideChangeTransitionEnd: function () {
            updateMovieInfo(this.activeIndex);
        }
    }
});

const API_KEY = '9f6076fcc8d60ea3d15d26eda84a5730'; 
const LIST_ID = '8517584';
const API_URL = `https://api.themoviedb.org/4/list/${LIST_ID}?api_key=${API_KEY}`;

const swiperWrapper = document.querySelector('.swiper-wrapper');
const movieInfo = document.querySelector('.movieinfo');

let movies = [];


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; 
    }
}

async function fetchMovies() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            console.error("No movies found.");
            return;
        }

        movies = data.results;
        shuffleArray(movies);

        movies.forEach((movie) => {
            if (movie.poster_path) { 
                const slide = document.createElement('div');
                slide.classList.add('swiper-slide');

                slide.innerHTML = `
                    <div class="card">
                        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                        <h2>${movie.title}</h2>
                    </div>
                `;

                swiperWrapper.appendChild(slide);
            }
        });

        swiper.update();
        updateMovieInfo(0);

    } catch (error) {
        console.error("Error fetching movies:", error);
    }
}

async function fetchDirector(movieId) {
    const creditsUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}`;

    try {
        const response = await fetch(creditsUrl);
        const data = await response.json();
        
        if (data.crew) {
            const director = data.crew.find(person => person.job === "Director");
            return director ? director.name : "Unknown Director";
        }

        return "Unknown Director";
    } catch (error) {
        console.error("Error fetching director info:", error);
        return "Unknown Director";
    }
}


async function fetchWatchProviders(movieId) {
    const region = "US"
    const watchUrl = `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${API_KEY}`;

    try {
        const response = await fetch(watchUrl);
        const data = await response.json();

        if (data.results && data.results[region] && data.results[region].flatrate) {
            return data.results[region].flatrate.map(provider => ({
                name: provider.provider_name,
                logo: `https://image.tmdb.org/t/p/w92${provider.logo_path}`
            }));
        }

        return [];
    } catch (error) {
        console.error("Error fetching watch providers:", error);
        return [];
    }
}


async function updateMovieInfo(index) {
    if (movies.length > 0 && movies[index]) {
        const selectedMovie = movies[index];
        const rating = selectedMovie.vote_average ? selectedMovie.vote_average.toFixed(1) : "N/A";
        const director = await fetchDirector(selectedMovie.id);
        const watchProviders = await fetchWatchProviders(selectedMovie.id);

        let watchProvidersHTML = `<p><strong>Where to Watch (Streaming Services in US Region):</strong> Not available</p>`;

        if (watchProviders.length > 0) {
            watchProvidersHTML = `
                <p><strong>Where to Watch (Streaming Services in US Region):</strong></p>
                <div class="watch-providers">
                    ${watchProviders.map(provider => `
                        <div class="provider">
                            <img src="${provider.logo}" alt="${provider.name}" title="${provider.name}">
                        </div>
                    `).join('')}
                </div>
            `;
        }

        movieInfo.innerHTML = `
            <p><strong>Rating:</strong> ⭐ ${rating}/10</p>
            <p><strong>Director:</strong>  ${director}</p>
            <p>${selectedMovie.overview || "No description available."}</p>
            ${watchProvidersHTML}
        `;
    }
}

fetchMovies();
