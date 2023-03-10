// const apiKey = 'd01467e5642040a9a7fff538ed76dda7';
// const url = `https://api.rawg.io/api/`;
// const searchForm = document.querySelector('#search-form');
// const searchInput = document.querySelector('#search-input');
// const cart = document.querySelector('#nav-cart');
// const searchResultsContainer = document.querySelector('#search-results-container');
// const genresContainer = document.querySelector('#genres');
// const platformsContainer = document.querySelector('#platforms');


// let cartItems = [];
// let genres = {};
// let platforms = {};



// searchForm.addEventListener('submit', async (event) => {
//     event.preventDefault();

//     clearSearchResults();

//     const query = searchInput.value;
//     const response = await fetch(`${url}games?search=${query}&key=${apiKey}`);
//     const data = await response.json();

//     const results = data.results.slice(0, 10);

//     for (const game of results) {
//         const gameId = game.id;

//         const gameElement = await createGameContainer(gameId);

//         searchResultsContainer.appendChild(gameElement);

//         game.genres.forEach(genre => {
//             if (!genres[genre.slug]) {
//                 genres[genre.slug] = genre.name;
//                 addFilterOption(genre.slug, genre.name, 'genre');
//             }
//         });
//     }
// });

// async function createGameContainer(gameId) {
//   const response = await fetch(`${url}games/${gameId}?key=${apiKey}`);
//   const data = await response.json();

//   const title = data.name;
//   const coverUrl = data.background_image;
//   const gameGenres = data.genres.map(genre => genre.slug);

//   const gameElement = document.createElement('div');
//   gameElement.classList.add('game-container', ...gameGenres.map(genre => `genre-${genre}`));
//   gameElement.innerHTML = `
//     <img src="${coverUrl}" alt="${title}" class="game-cover">
//     <div class="game-details">
//       <h2 class="game-title">${title}</h2>
//       <button class="game-buy">Add to cart</button>
//     </div>
//   `;

//   // Add genres to filter
//   gameGenres.forEach(genre => {
//     if (!genres[genre]) {
//       genres[genre] = data.genres.find(g => g.slug === genre).name;
//       addFilterOption(genre, genres[genre], 'genre');
//     }
//   });

//   return gameElement;
// }

// function addFilterOption(value, label, name) {
//   const filterOption = document.createElement('li');
//   filterOption.classList.add('filter-option');

//   const checkbox = document.createElement('input');
//   checkbox.type = 'checkbox';
//   checkbox.id = `genre-${value}`;
//   checkbox.value = value;
//   checkbox.addEventListener('change', handleFilterChange);

//   const checkboxLabel = document.createElement('label');
//   checkboxLabel.htmlFor = `genre-${value}`;
//   checkboxLabel.textContent = `${label}`;

//   filterOption.appendChild(checkbox);
//   filterOption.appendChild(checkboxLabel);

//   genresContainer.appendChild(filterOption);
// }

// function handleFilterChange(event) {
//   const checkbox = event.target;
//   const filterType = 'genre';
//   const filterValue = checkbox.value;

//   const games = document.querySelectorAll('.game-container');
//   for (const game of games) {
//     if (game.classList.contains(`${filterType}-${filterValue}`)) {
//       game.classList.toggle('hidden', !checkbox.checked);
//     }
//   }
// }

// function clearSearchResults() {
//   searchResultsContainer.innerHTML = '';
//   genresContainer.innerHTML = '';
//   genres = {};
//   platforms = {};
// }


















const apiKey = 'd01467e5642040a9a7fff538ed76dda7';
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const cart = document.querySelector('#nav-cart');
const searchResultsContainer = document.querySelector('#search-results-container');
const genresContainer = document.querySelector('#genres');
const platformsContainer = document.querySelector('#platforms');


let cartItems = [];
const gamePrices = {};



searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();
    clearResults();
  const searchTerm = searchInput.value.trim();
  if (!searchTerm) return;
  const url = `https://api.rawg.io/api/games?key=${apiKey}&search=${searchTerm}&page_size=20`;
  const response = await fetch(url);
  const { results } = await response.json();
  searchResultsContainer.innerHTML = '';
  const genres = new Set();
  results.forEach((game) => {
    game.genres.forEach((genre) => genres.add(genre.name));
    const { background_image, name, id } = game;
    const priceKey = `price_${id}`;
    let price = localStorage.getItem(priceKey);
    if (!price) {
      price = Math.floor(Math.random() * 51) + 10 + '.95';
      localStorage.setItem(priceKey, price);
    }
    const gameContainer = document.createElement('div');
    gameContainer.classList.add('game-container');
    gameContainer.innerHTML = `
      <img class="game-cover" src="${background_image}" alt="${name}">
      <div class="game-details">
        <h2 class="game-title">${name}</h2>
        <div class="game-price"><p>$${price}</p>
        <button class="game-buy" data-id="${id}">Add to cart</button>
        </div>

      </div>`;
    const buyButton = gameContainer.querySelector('.game-buy');
    buyButton.addEventListener('click', () => {
      cartItems.push({ id, name, price });
      updateCart();
    });
    gameContainer.addEventListener('click', async () => {
      const url = `https://api.rawg.io/api/games/${id}?key=${apiKey}`;
      const response = await fetch(url);
      const { description_raw, website, released } = await response.json();
      const modal = document.createElement('div');
      modal.classList.add('game-modal');
      modal.innerHTML = `
        <div class="game-modal-content">
          <span class="game-modal-close">X</span>
          <h2 class="game-modal-title">${name}</h2>
          <p class="game-modal-description">${description_raw}</p>
          <a class="game-modal-website" href="${website}" target="_blank">Visit Website</a>
          <p class="game-modal-released">Released: ${released}</p>
        </div>`;
      const closeButton = modal.querySelector('.game-modal-close');
      closeButton.addEventListener('click', () => modal.style.display = 'none');
      document.body.appendChild(modal);
      modal.style.display = 'block';
    });
    gameContainer.dataset.genres = JSON.stringify(game.genres.map(g => g.name));
    searchResultsContainer.appendChild(gameContainer);
  });
    const fieldset = document.querySelector('fieldset');
    const genresList = fieldset.querySelector('#genres');
    genresList.innerHTML = '';
    genres.forEach(genre => {
  const toggleBox = document.createElement('li');
  toggleBox.classList.add('filter-option');
  toggleBox.innerHTML = `
    <label class="filter-option-label">
      <input type="checkbox" name="genre" value="${genre}" class="filter-option-checkbox">
      <span>${genre}</span>
    </label>`;
  toggleBox.addEventListener('change', () => {
    const selectedGenres = Array.from(document.querySelectorAll('.filter-option input[type="checkbox"]:checked'))
      .map(cb => cb.value);
    Array.from(document.querySelectorAll('.game-container')).forEach(gameContainer => {
      const gameGenres = JSON.parse(gameContainer.dataset.genres);
      gameContainer.style.display = selectedGenres.length === 0 || selectedGenres.some(g => gameGenres.includes(g)) ? 'block' : 'none';
    });
  });
  const inputElement = toggleBox.querySelector('.filter-option-checkbox');
  inputElement.addEventListener('change', () => {
    if (inputElement.checked) {
      toggleBox.classList.add('active');
    } else {
      toggleBox.classList.remove('active');
    }
  });
  genresList.appendChild(toggleBox);
});



fieldset.insertBefore(legend, genresList);

updateCart();
});



function updateCart() {
    if (cartItems.length > 0) {
        cart.innerHTML = '';
        cartItems.forEach(({ name }) => {
            const game = document.createElement('div');
            game.textContent = name;
            cart.appendChild(game);
        });
    } else {
    cart.innerHTML = '<p>Cart is empty</p>';
    }
}

window.addEventListener('load', () => {
updateCart();
});

function clearResults() {
  searchResultsContainer.innerHTML = '';
  genresContainer.innerHTML = '';
}



