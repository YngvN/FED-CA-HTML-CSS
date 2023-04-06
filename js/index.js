import { fetchData } from "./utility.js";
import { fetchGameById } from "./utility.js";

import { buildSearchUrl } from "./api.js";
import { buildGameUrl } from "./api.js";
import { addToCart } from "./cart.js";
import { updateCartDisplay } from "./cart.js";
import { showCartNotification } from "./cart.js";



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

const sale = shuffledGames.slice(5, 10);

const popular = shuffledGames.slice(10, 15);

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
    gameItem.innerHTML = 
    `<div id="game-container-index" class="game-container">
        <img class="game-cover" src="${game.background_image}" alt="${game.name}" data-id="${game.id}" />
        <div class="game-details">
          <h3 class="game-title">${game.name}</h3>
          <p id="view-more">View more</p>
        </div>
        <div class="game-price">
        ${priceHTML}
        <button class="game-buy" data-id="${game.id}"><i class="fa-solid fa-cart-shopping fa-lg"></i></button>
      </div>
      </div>
    `;
    const container = gameItem.querySelector(".game-container");
    const imageUrl = game.background_image;
    const gameCovers = document.querySelectorAll('.game-cover');

    gameCovers.forEach(gameCover => {
      console.log(game.id)
      gameCover.removeEventListener('click', handleGameCoverClick);
      gameCover.addEventListener('click', handleGameCoverClick);
    });

    list.appendChild(gameItem);

    addBackgroundImage(container, imageUrl);
  }
}

renderGameList(featured, gameList);
renderGameList(sale, saleList, Math.floor(Math.random() * 26) + 5);
renderGameList(popular, popularList);

async function handleGameCoverClick(event) {
  console.log("Cover clicked");
  const gameId = event.target.getAttribute('data-id');
  const gameURL = buildGameUrl(gameId);
  const game = await fetchGameById(gameURL);

  console.log("Details clicked for " + game.name);
  fillGameDetails(game);
  console.log("Details displayed");
}


const addToCartButtons = document.querySelectorAll(".game-buy");

addToCartButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const gameId = event.target.dataset.id;
    const gameTitle = event.target.closest(".game-container").querySelector(".game-title").textContent;
    const gamePrice = event.target.closest(".game-container").querySelector(".game-price span").textContent.slice(2);
    const gameCover = event.target.closest(".game-container").querySelector(".game-cover").getAttribute("src");

    addToCart(gameId, gameTitle, gamePrice, gameCover);

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


function renderSearchResults(searchResults) 
{
  searchResultsContainer.innerHTML = "";

  renderGameList(searchResults, searchResultsContainer);

  const addToCartButtons = searchResultsContainer.querySelectorAll(".game-buy");
  addToCartButtons.forEach((button) => 
  {
    button.addEventListener("click", async (event) => 
    {
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





const fillGameDetails = (game) => {
  const gameDetailsDisplay = document.getElementById('game-details-display');

  const html = `
    <div class="game-container">
      <div class="game-cover" style="background-image: url(${game.background_image})">
        <button class="buy-btn">Buy $${game.price}</button>
      </div>
      <div class="game-info">
        <h3>${game.name}</h3>
        <p class="game-description">${game.description ? game.description : 'Description not available'}</p>
        <div class="more-details">
          <div>
            <h4>Genre:</h4> 
            <ul id="genre">
              ${game.genres.map(genre => `<li>${genre.name}</li>`).join('')}
            </ul>
          </div>
          <div>
            <h4>Platform:</h4> 
            <ul id="platform">
              ${game.platforms.map(platform => `<li>${platform.platform.name}</li>`).join('')}
            </ul>
          </div>
          <div>
            <h4>Developer:</h4> 
            <p id="developer">${game.developers.map(developer => developer.name).join(', ')}</p>
          </div>
          <div>
            <h4>Release Date:</h4> 
            <p id="release-date">${new Date(game.released).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  `;

  gameDetailsDisplay.innerHTML = html;
};

console.log("index.js loaded")