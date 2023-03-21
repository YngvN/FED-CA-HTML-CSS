document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search-input");
    const searchResults = document.getElementById("search-results-container");
    const filterContainer = document.querySelectorAll(".filter-container");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let games = [];

    const fetchData = async (searchTerm) => {
        const apiKey = "d01467e5642040a9a7fff538ed76dda7";
        const url = `https://api.rawg.io/api/games?key=${apiKey}&search=${searchTerm}&page_size=20`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            games = data.results;
            return games;
        } catch (error) {
            console.error("Error fetching data:", error);
            return [];
        }
    };

    const renderGames = (games) => {
        searchResults.innerHTML = "";
        games.forEach((game) => {
            const { background_image, name, id } = game;
            const price =
                localStorage.getItem(`price_${id}`) ||
                Math.floor(Math.random() * 51) + 10 + ".95";
            localStorage.setItem(`price_${id}`, price);

            const gameCard = `
        <div class="game-container">
          <img class="game-cover" src="${background_image}" alt="${name}"/>
          <div class="game-details">
            <h3 class="game-title">${name}</h3>
            <button class="game-more">More Details</button>
          </div>
          <div class="game-price">
            <span>$ ${price}</span>
            <button class="game-buy" data-id="${id}">Add to Cart</button>
          </div>
        </div>
      `;
            searchResults.innerHTML += gameCard;
        });
    };

    const addToCart = (game) => {
        cart.push(game);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartDisplay();
        showCartNotification();
    };

    const updateCartDisplay = () => {
        const navCart = document.getElementById("nav-cart");
        cart = JSON.parse(localStorage.getItem("cart")) || [];

        const cartIcon = document.querySelector(".fa-cart-shopping");
        cartIcon.dataset.count = cart.length;

        if (cart.length === 0) {
            navCart.innerHTML = "<p>Cart is empty</p>";
        } else {
            let totalPrice = 0;
            navCart.innerHTML = "";
            cart.forEach((game) => {
                const cartItem = document.createElement("li");
                cartItem.classList.add("cart-item");
                const price = localStorage.getItem(`price_${game.id}`);
                totalPrice += Number(price);
                cartItem.innerHTML = `
          <span>${game.name} - $${price}</span>
          <button class="remove-game" data-id="${game.id}">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        `;
                navCart.appendChild(cartItem);
            });
            const totalPriceDiv = document.createElement("div");
            totalPriceDiv.classList.add("total");
            totalPriceDiv.textContent = `Total: $${totalPrice.toFixed(2)}`;
            const paymentButton = document.createElement("button");
            paymentButton.textContent = "Go to payment";
            paymentButton.addEventListener("click", () => {
                window.location.href = "payment.html";
            });
            navCart.appendChild(totalPriceDiv);
            navCart.appendChild(paymentButton);

const removeButtons = document.querySelectorAll(".remove-game");
removeButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
        const gameId = event.currentTarget.dataset.id;
        console.log(`Removing game with ID: ${gameId}`);
        console.log(`Before removal: cart length = ${cart.length}`);
        const gameIndex = cart.findIndex((game) => game.id === gameId);
        cart.splice(gameIndex, 1);
        console.log(`After removal: cart length = ${cart.length}`);
        localStorage.setItem("cart", JSON.stringify(cart));
        event.currentTarget.parentElement.remove();
        updateCartDisplay();
    });
});




        }
    };

    const showCartNotification = () => {
        const cartIcon = document.querySelector(".fa-cart-shopping");
        const notification = document.createElement("div");
        notification.classList.add("cart-notification");
        notification.textContent = "Item added to cart";
        cartIcon.parentElement.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 2000);
    };
    searchResults.addEventListener("click", (e) => {
        if (e.target.classList.contains("game-buy")) {
            const gameContainer = e.target.closest(".game-container");
            const gameId = e.target.dataset.id;
            const game = games.find((g) => g.id == gameId);
            if (game) {
                addToCart(game);
            }
        }
    });

    const handleSearch = async (e) => {
        e.preventDefault();
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            const games = await fetchData(searchTerm);
            renderGames(games);
        }
    };
    const toggleFilter = (e) => {
        const parent = e.currentTarget.parentElement;
        parent.classList.toggle("open");
    };

    searchForm.addEventListener("submit", handleSearch);

    filterContainer.forEach((container) => {
        const legend = container.querySelector("legend");
        legend.addEventListener("click", toggleFilter);
    });

    updateCartDisplay();
});


// const apiKey = 'd01467e5642040a9a7fff538ed76dda7';
// const searchForm = document.querySelector('#search-form');
// const searchInput = document.querySelector('#search-input');
// const cart = document.querySelector('#nav-cart');
// const searchResultsContainer = document.querySelector('#search-results-container');
// const genresContainer = document.querySelector('#genres');
// const platformsContainer = document.querySelector('#platforms');


// let cartItems = [];
// const gamePrices = {};







// searchForm.addEventListener('submit', async (event) => {
//   event.preventDefault();
//     clearResults();
//   const searchTerm = searchInput.value.trim();
//   if (!searchTerm) return;
//   const url = `https://api.rawg.io/api/games?key=${apiKey}&search=${searchTerm}&page_size=20`;
//   const response = await fetch(url);
//   const { results } = await response.json();
//   searchResultsContainer.innerHTML = '';
//   const genres = new Set();
//   results.forEach((game) => {
//     game.genres.forEach((genre) => genres.add(genre.name));
//     const { background_image, name, id } = game;
//     const priceKey = `price_${id}`;
//     let price = localStorage.getItem(priceKey);
//     if (!price) {
//       price = Math.floor(Math.random() * 51) + 10 + '.95';
//       localStorage.setItem(priceKey, price);
//     }
//     const gameContainer = document.createElement('div');
//     gameContainer.classList.add('game-container');
//     gameContainer.innerHTML = `
//       <img class="game-cover" src="${background_image}" alt="${name}">
//       <div class="game-details">
//         <h2 class="game-title">${name}</h2>
//         <div class="game-price"><p>$${price}</p>
//         <button class="game-buy" data-id="${id}">Add to cart</button>
//         </div>

//       </div>`;
//     const buyButton = gameContainer.querySelector('.game-buy');
//     buyButton.addEventListener('click', () => {
//       cartItems.push({ id, name, price });
//       updateCart();
//     });
//     gameContainer.addEventListener('click', async () => {
//       const url = `https://api.rawg.io/api/games/${id}?key=${apiKey}`;
//       const response = await fetch(url);
//       const { description_raw, website, released } = await response.json();
//       const modal = document.createElement('div');
//       modal.classList.add('game-modal');
//       modal.innerHTML = `
//         <div class="game-modal-content">
//           <span class="game-modal-close">X</span>
//           <h2 class="game-modal-title">${name}</h2>
//           <p class="game-modal-description">${description_raw}</p>
//           <a class="game-modal-website" href="${website}" target="_blank">Visit Website</a>
//           <p class="game-modal-released">Released: ${released}</p>
//         </div>`;
//       const closeButton = modal.querySelector('.game-modal-close');
//       closeButton.addEventListener('click', () => modal.style.display = 'none');
//       document.body.appendChild(modal);
//       modal.style.display = 'block';
//     });
//     gameContainer.dataset.genres = JSON.stringify(game.genres.map(g => g.name));
//     searchResultsContainer.appendChild(gameContainer);
//   });
//     const fieldset = document.querySelector('fieldset');
//     const genresList = fieldset.querySelector('#genres');
//     genresList.innerHTML = '';
//     genres.forEach(genre => {
//   const toggleBox = document.createElement('li');
//   toggleBox.classList.add('filter-option');
//   toggleBox.innerHTML = `
//     <label class="filter-option-label">
//       <input type="checkbox" name="genre" value="${genre}" class="filter-option-checkbox">
//       <span>${genre}</span>
//     </label>`;
//   toggleBox.addEventListener('change', () => {
//     const selectedGenres = Array.from(document.querySelectorAll('.filter-option input[type="checkbox"]:checked'))
//       .map(cb => cb.value);
//     Array.from(document.querySelectorAll('.game-container')).forEach(gameContainer => {
//       const gameGenres = JSON.parse(gameContainer.dataset.genres);
//       gameContainer.style.display = selectedGenres.length === 0 || selectedGenres.some(g => gameGenres.includes(g)) ? 'block' : 'none';
//     });
//   });
//   const inputElement = toggleBox.querySelector('.filter-option-checkbox');
//   inputElement.addEventListener('change', () => {
//     if (inputElement.checked) {
//       toggleBox.classList.add('active');
//     } else {
//       toggleBox.classList.remove('active');
//     }
//   });
//   genresList.appendChild(toggleBox);
//     });



//     fieldset.insertBefore(legend, genresList);

//     updateCart();
// });



// function updateCart() {
//     if (cartItems.length > 0) {
//         cart.innerHTML = '';
//         cartItems.forEach(({ name }) => {
//             const game = document.createElement('div');
//             game.textContent = name;
//             cart.appendChild(game);
//         });
//     } else {
//     cart.innerHTML = '<p>Cart is empty</p>';
//     }
// }

// window.addEventListener('load', () => {
// updateCart();
// });

// function clearResults() {
//   searchResultsContainer.innerHTML = '';
//   genresContainer.innerHTML = '';
// }


// const fieldset = document.querySelector('fieldset');
// const dropdown = fieldset.querySelector('.filter-dropdown');
// const toggleIcon = fieldset.querySelector('.toggle-icon');

// toggleIcon.addEventListener('click', () => {
//   dropdown.classList.toggle('open');
//   fieldset.classList.toggle('open');
// });

// genres.forEach(genre => {
//   const toggleBox = document.createElement('li');
//   toggleBox.classList.add('filter-option');
//   toggleBox.innerHTML = `
//     <label class="filter-option-label">
//       <input type="checkbox" name="genre" value="${genre}" class="filter-option-checkbox">
//       <span>${genre}</span>
//     </label>`;
//   toggleBox.addEventListener('change', () => {
//     const selectedGenres = Array.from(document.querySelectorAll('.filter-option input[type="checkbox"]:checked'))
//       .map(cb => cb.value);
//     Array.from(document.querySelectorAll('.game-container')).forEach(gameContainer => {
//       const gameGenres = JSON.parse(gameContainer.dataset.genres);
//       gameContainer.style.display = selectedGenres.length === 0 || selectedGenres.some(g => gameGenres.includes(g)) ? 'block' : 'none';
//     });
//   });
//   const inputElement = toggleBox.querySelector('.filter-option-checkbox');
//   inputElement.addEventListener('change', () => {
//     if (inputElement.checked) {
//       toggleBox.classList.add('active');
//     } else {
//       toggleBox.classList.remove('active');
//     }
//   });
//   genresContainer.appendChild(toggleBox);
// });
