import { fetchData } from "./utility.js";
import { buildSearchUrl } from "./api.js";
import { addToCart } from "./cart.js";
import { updateCartDisplay } from "./cart.js";


updateCartDisplay();


const gameList = document.getElementById("featured-list");
const saleList = document.getElementById("sale-list");
const popularList = document.getElementById("popular-list");
const featuredGameContainer = document.getElementById("featured-games");
const pageSize = 20;
const pageNumber = 1;

const url = buildSearchUrl("", pageSize, pageNumber);

export const games = await fetchData(url);

const shuffledGames = games.sort(() => 0.5 - Math.random());

const featured = shuffledGames.slice(0, 5);

const sale = shuffledGames.slice(5, 15);

const popular = shuffledGames.slice(15, 25);

function renderGameList(games, list, discountPercentage = 0) {
  for (let i = 0; i < games.length; i++) {
    const game = games[i];

    let priceHTML;
    if (discountPercentage > 0) {
      const discountedPrice = (game.price * (100 - discountPercentage)) / 100;
      priceHTML = `
      <span class="game-price-discount">${discountPercentage}% off</span>
        <div class="game-numbers">
          <span class="game-price-regular">$ ${game.price}</span>
          <span class="game-price-discounted">$ ${discountedPrice.toFixed(2)}</span>
        </div>
      `;
    } else {
      priceHTML = `
        <span>$ ${game.price}</span>
      `;
    }

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
          ${priceHTML}
          <button class="game-buy" data-id="${game.id}">Add to Cart</button>
        </div>
      </div>
    `;

    const container = gameItem.querySelector(".game-container");
    const imageUrl = game.background_image;

    list.appendChild(gameItem);

    addBackgroundImage(container, imageUrl);
  }
}

// Call the function for each list
renderGameList(featured, gameList);
renderGameList(sale, saleList, Math.floor(Math.random() * 26) + 5);
renderGameList(popular, popularList);

const addToCartButtons = document.querySelectorAll(".game-buy");

addToCartButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const gameId = event.target.dataset.id;
    const gameTitle = event.target.closest(".game-container").querySelector(".game-title").textContent;
    const gamePrice = event.target.closest(".game-container").querySelector(".game-price span").textContent.slice(2);
    const gameCover = event.target.closest(".game-container").querySelector(".game-cover").getAttribute("src");
    const gameDescription = event.target.closest(".game-container").querySelector(".game-description").textContent;

    addToCart(gameId, gameTitle, gamePrice, gameCover, gameDescription);

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


function renderSearchResults(searchResults) {
  searchResultsContainer.innerHTML = "";

  renderGameList(searchResults, searchResultsContainer);

  const addToCartButtons = searchResultsContainer.querySelectorAll(".game-buy");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      const gameId = event.target.dataset.id;
      const gameTitle = event.target.closest(".game-container").querySelector(".game-title").textContent;
      const gamePrice = event.target.closest(".game-container").querySelector(".game-price span").textContent.slice(2);
      const gameCover = event.target.closest(".game-container").querySelector(".game-cover").getAttribute("src");
      const gameDescription = event.target.closest(".game-container").querySelector(".game-description").textContent;

      addToCart(gameId, gameTitle, gamePrice, gameCover, gameDescription);

      button.classList.add("game-added");
      button.textContent = "Added";
      showCartNotification();
      updateCartDisplay();
    });
  });
}


searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const searchTerm = searchInput.value.trim();

  if (!searchTerm) {
    searchResultsContainer.innerHTML = "";
    searchResultsContainer.style.opacity = "0";
    displayContainer.style.position = "relative";
    displayContainer.style.opacity = "1";
    displayContainer.style.visibility ="visible";

    return false;
  }

  const searchUrl = buildSearchUrl(searchTerm, 50, 1);

  const searchResults = await fetchData(searchUrl);

  renderSearchResults(searchResults);

  searchResultsContainer.style.opacity = "1";
  displayContainer.style.opacity = "0";
  displayContainer.style.position = "absolute";
  displayContainer.style.visibility ="hidden";
});


function addBackgroundImage(container, imageUrl) {
  const bodyBackgrounds = document.querySelectorAll(".body-background");
  const opacity = 0.8;

  container.addEventListener("mouseover", () => {
    bodyBackgrounds.forEach((bg) => {
      bg.style.backgroundImage = `url(${imageUrl})`;
      bg.style.opacity = opacity;
      bg.style.overflowY = "hidden";
      bg.classList.add("show");
    });
  });

  container.addEventListener("mouseleave", () => {
    bodyBackgrounds.forEach((bg) => {

      bg.style.opacity = "";
      bg.style.overflowY = "";
      bg.classList.remove("show");
      setTimeout(() => {
          bg.style.backgroundImage = "";
      }, 150);
    });
  });
}



console.log("index.js loaded")


