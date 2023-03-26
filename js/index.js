import { fetchData } from "./utility.js";
import { buildSearchUrl } from "./api.js";
import { addToCart } from "./cart.js";
import { updateCartDisplay } from "./cart.js";


updateCartDisplay();


const gameList = document.getElementById("featured-list");
const saleList = document.getElementById("sale-list");
const featuredGameContainer = document.getElementById("featured-games");
const pageSize = 20;
const pageNumber = 1;

const url = buildSearchUrl("", pageSize, pageNumber);

export const games = await fetchData(url);

// Shuffle the games array randomly
const shuffledGames = games.sort(() => 0.5 - Math.random());

// Select the first 5 games for featured
const featured = shuffledGames.slice(0, 5);

// Select the next 10 games for sale
const sale = shuffledGames.slice(5, 15);

// Select the next 10 games for popular
const popular = shuffledGames.slice(15, 25);

// Create a new game item for each game in the featured array
for (let i = 0; i < featured.length; i++) {
  const game = featured[i];

  const gameItem = document.createElement("div");
  gameItem.innerHTML = `
    <div id="game-container-index" class="game-container">
      <img class="game-cover" src="${game.background_image}" alt="${game.name}" />
      
      <div class="game-details">
        <h3 class="game-title">${game.name}</h3>
        <p id="view-more">View more</p>
        <p class="game-description">${game.description ? game.description : 'Description not available'}</p>
      </div>
      <div class="game-price">
        <span>$ ${game.price}</span>
        <button class="game-buy" data-id="${game.id}">Add to Cart</button>
      </div>
    </div>
  `;

  // Add the new game item to the featured list
  gameList.appendChild(gameItem);
}

// Create a new game item for each game in the sale array
for (let i = 0; i < sale.length; i++) {
  const game = sale[i];

  // Generate a random discount percentage between 5 and 30%
  const discountPercentage = Math.floor(Math.random() * 26) + 5;

  // Calculate the discounted price based on the discount percentage
  const discountedPrice = (game.price * (100 - discountPercentage)) / 100;

  const gameItem = document.createElement("div");
  gameItem.innerHTML = `
    <div id="game-container-index" class="game-container">
      <img class="game-cover" src="${game.background_image}" alt="${game.name}" />
      <span class="game-price-discount">${discountPercentage}% off</span>
      <div class="game-details">
        <h3 class="game-title">${game.name}</h3>
        <p id="view-more">View more</p>
        <p class="game-description">${game.description ? game.description : 'Description not available'}</p>
      </div>
      <div class="game-price">
        <div class="game-numbers">
          <span class="game-price-regular">$ ${game.price}</span>
          <span class="game-price-discounted">$ ${discountedPrice.toFixed(2)}</span>
        </div>
        <button class="game-buy" data-id="${game.id}">Add to Cart</button>
      </div>

    </div>
  `;

  // Add the new game item to the sale list
  saleList.appendChild(gameItem);
}



// Create a new game item for each game in the popular array
for (let i = 0; i < popular.length; i++) {
  const game = popular[i];

  const gameItem = document.createElement("div");
  gameItem.innerHTML = `
    <div id="game-container-index" class="game-container">
      <img class="game-cover" src="${game.background_image}" alt="${game.name}" />
      
      <div class="game-details">
        <h3 class="game-title">${game.name}</h3>
        <p id="view-more">View more</p>
        <p class="game-description">${game.description ? game.description : 'Description not available'}</p>
      </div>
      <div class="game-price">
        <span>$ ${game.price}</span>
        <button class="game-buy" data-id="${game.id}">Add to Cart</button>
      </div>
    </div>
  `;

  // Add the new game item to the popular list
  const popularList = document.getElementById("popular-list");
  popularList.appendChild(gameItem);
}



// Add the list to the featured game container
featuredGameContainer.appendChild(gameList);

// Find the "Add to Cart" buttons
const addToCartButtons = document.querySelectorAll(".game-buy");

addToCartButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    // Get the game ID, title, price, cover, and description from the data attributes
    const gameId = event.target.dataset.id;
    const gameTitle = event.target.closest(".game-container").querySelector(".game-title").textContent;
    const gamePrice = event.target.closest(".game-container").querySelector(".game-price span").textContent.slice(2);
    const gameCover = event.target.closest(".game-container").querySelector(".game-cover").getAttribute("src");
    const gameDescription = event.target.closest(".game-container").querySelector(".game-description").textContent;

    // Add the game to the cart
    addToCart(gameId, gameTitle, gamePrice, gameCover, gameDescription);

    // Update the button text and style to indicate that the game has been added
    button.classList.add("game-added");
    button.textContent = "Added";
    showCartNotification();
    updateCartDisplay();
  });
});


const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchResultsContainer = document.getElementById("search-results-container");
const searchButton = document.getElementById("search-btn");
const displayContainer = document.getElementById("display-container");


searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Extract the search term from the input field
  const searchTerm = searchInput.value.trim();

  // If the search term is empty, show the display container and return false to prevent further execution
  if (!searchTerm) {
    searchResultsContainer.innerHTML = "";
    searchResultsContainer.style.opacity = "0";
    displayContainer.style.opacity = "1";
    return false;
  }

  // Build a search URL using the search term and a high page size value
  const searchUrl = buildSearchUrl(searchTerm, 50, 1);

  // Fetch the data using the search URL
  const searchResults = await fetchData(searchUrl);

  // Show the search results container and fade out the display container
  searchResultsContainer.style.opacity = "1";
  displayContainer.style.opacity = "0";

  // Clear the search results container
  searchResultsContainer.innerHTML = "";

  // Display the search results in a list, limiting the number of results to 20
  for (let i = 0; i < Math.min(searchResults.length, 20); i++) {
    const searchResult = searchResults[i];

    const searchResultItem = document.createElement("div");
    searchResultItem.innerHTML = `
      <div class="game-container">
        <img class="game-cover" src="${searchResult.background_image}" alt="${searchResult.name}" />
        
        <div class="game-details">
          <h3 class="game-title">${searchResult.name}</h3>
          <p id="view-more">View more</p>
          <p class="game-description">${searchResult.description ? searchResult.description : 'Description not available'}</p>
        </div>
        <div class="game-price">
          <span>$ ${searchResult.price}</span>
          <button class="game-buy" data-id="${searchResult.id}">Add to Cart</button>
        </div>
      </div>
    `;

    // Add the new search result item to the list
    searchResultsContainer.appendChild(searchResultItem);
  }

  // Find the "Add to Cart" buttons in the search results
  const addToCartButtons = searchResultsContainer.querySelectorAll(".game-buy");

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      // Get the game ID, title, price, cover, and description from the data attributes
      const gameId = event.target.dataset.id;
      const gameTitle = event.target.closest(".game-container").querySelector(".game-title").textContent;
      const gamePrice = event.target.closest(".game-container").querySelector(".game-price span").textContent.slice(2);
      const gameCover = event.target.closest(".game-container").querySelector(".game-cover").getAttribute("src");
      const gameDescription = event.target.closest(".game-container").querySelector(".game-description").textContent;

      // Add the game to the cart
      addToCart(gameId, gameTitle, gamePrice, gameCover, gameDescription);
      updateCartDisplay();
    });
  });
});


console.log("index.js loaded")


