import { fetchData } from "./utility.js";
import { buildSearchUrl } from "./api.js";
import { addToCart } from "./cart.js";
import { updateCartDisplay } from "./cart.js";

updateCartDisplay();

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchResultsContainer = document.getElementById("search-results-container");
const searchButton = document.getElementById("search-btn");

searchForm.addEventListener("submit", async (event) => {
    console.log("Clicked)")
      event.preventDefault();


  const searchTerm = searchInput.value.trim();

  if (!searchTerm) {
    return false;
  }

  const searchUrl = buildSearchUrl(searchTerm, 50, 1);

  const searchResults = await fetchData(searchUrl);


  searchResultsContainer.innerHTML = "";

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
          <button class="game-buy" data-id="${searchResult.id}"><i class="fa-solid fa-cart-shopping fa-lg"></i></button>
        </div>
      </div>
    `;

    searchResultsContainer.appendChild(searchResultItem);
  }

  const addToCartButtons = searchResultsContainer.querySelectorAll(".game-buy");

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const gameId = event.target.dataset.id;
      const gameTitle = event.target.closest(".game-container").querySelector(".game-title").textContent;
      const gamePrice = event.target.closest(".game-container").querySelector(".game-price span").textContent.slice(2);
      const gameCover = event.target.closest(".game-container").querySelector(".game-cover").getAttribute("src");
      const gameDescription = event.target.closest(".game-container").querySelector(".game-description").textContent;
      console.log("Adding " + gameTitle + " to cart");
      addToCart(gameId, gameTitle, gamePrice, gameCover, gameDescription);
      updateCartDisplay();
    });
  });



});


console.log("games.js loaded")