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
const displayContainer = document.getElementById("display-container");
const pageSize = 20;
const pageNumber = 1;

const url = buildSearchUrl("", pageSize, pageNumber);



export const games = await fetchData(url);


const shuffledGames = games.sort(() => 0.5 - Math.random());

const featured = shuffledGames.slice(0, 5);

const sale = shuffledGames.slice(5, 10);

const popular = shuffledGames.slice(10, 15);

async function renderGameList(games, list, discountPercentage = 0, listType = null) {
  for (let i = 0; i < games.length; i++) {
    const game = games[i];

    let priceHTML;
    if (discountPercentage > 0) {
      const discountedPrice = (game.price * (100 - discountPercentage)) / 100;
      priceHTML = `
        <p class="game-price-discount">${discountPercentage}% off</p>
        <div class="game-numbers">
          <p class="game-price-regular">$ ${game.price}</p>
          <p class="game-price-discounted">$ ${discountedPrice.toFixed(2)}</p>
        </div>
      `;
    } else {
      priceHTML = `
        <p>$ ${game.price}</p>
      `;
    }

    const gameItem = document.createElement("div");
    gameItem.innerHTML = `
      <div class="game-container">
        <img class="game-cover" src="${game.background_image}" alt="${game.name}" data-id="${game.id}" />
        <div class="game-details">
          <h3 class="game-title">${game.name}</h3>
          <button class="view-more-btn" data-id="${game.id}">View more</button>
        </div>

        <div class="game-price">
          ${priceHTML}
        </div>
        <div class="game-genre">
          <p>${game.genres.map(genre => genre.name).join(', ')}</p>
        </div>
        <button class="game-buy-btn" data-id="${game.id}"><i class="fa-solid fa-cart-shopping fa-lg"></i>$${game.price}</button>
      </div>
    `;

    const container = gameItem.querySelector(".game-container");
    const imageUrl = game.background_image;
    const gameCovers = document.querySelectorAll('.game-cover');

    gameCovers.forEach(gameCover => {
      gameCover.removeEventListener('click', handleGameCoverClick);
      gameCover.addEventListener('click', handleGameCoverClick);
    });

    list.appendChild(gameItem);

    addBackgroundImage(container, imageUrl);

    // console.log(listType)
    // if (listType === "featured") {
    //   const gameURL = buildGameUrl(game.id);
    //   const featuredGame = await fetchGameById(gameURL);
    //   const featuredDesc = document.getElementById("featured-description");
    //   featuredDesc.innerHTML = `
    //   <div class="game-desc" data-id="${game.id}">
    //     <h3 class="game-title">${featuredGame.name}</h3>
    //     <p class="game-description">${featuredGame.description ? featuredGame.description : 'Description not available'}</p>
    //   </div>
    //   `;
    // }

  }
}



renderGameList(featured, gameList, 0, "featured");
renderGameList(sale, saleList, Math.floor(Math.random() * 26) + 5);
renderGameList(popular, popularList);

const gameCovers = document.querySelectorAll('.game-cover');




async function handleGameCoverClick(event) {
  console.log("Cover clicked");

  const gameDetailsDisplay = document.getElementById("game-details-display");
  
  gameDetailsDisplay.style.display = "flex";


  const gameId = event.target.getAttribute('data-id');
  const gameURL = buildGameUrl(gameId);
  const game = await fetchGameById(gameURL);
  fillGameDetails(game);
  console.log("Details displayed");
  console.log(game.description);
}


const addToCartButtons = document.querySelectorAll(".game-buy-btn");

addToCartButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const gameId = event.target.dataset.id;
    const gameTitle = event.target.closest(".game-container").querySelector(".game-title").textContent;
    const gamePrice = event.target.closest(".game-container").querySelector(".game-price").textContent.slice(2);
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

      addToCart(gameId, gameTitle, gamePrice, gameCover);

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

  // container.addEventListener("mouseleave", () => {
  //   bodyBackgrounds.forEach((bg) => {

  //     bg.style.opacity = "";
  //     bg.style.overflowY = "";
  //     bg.classList.remove("show");
  //     setTimeout(() => {
  //         bg.style.backgroundImage = "";
  //     }, 150);
  //   });
  // });
}





const fillGameDetails = (game) => {
  const gameDetailsDisplay = document.getElementById('game-details-container');

  const html = `
    <div class="game-container">
      <img class="game-cover" src="${game.background_image}" alt="${game.name}" data-id="${game.id}"></img>
      <button class="game-buy">Buy $${game.price}</button>
      <div class="game-info">
        <h3 class="game-title">${game.name}</h3>
        <div class="more-details">
          <p class="game-description">${game.description ? game.description : 'Description not available'}</p>

          <div class="game-details-section">
            <h4>Genre:</h4> 
            <p id="genre">${game.genres.map(genre => genre.name).join(', ')}</p>
          </div>
          <div class="game-details-section">
            <h4>Platform:</h4> 
            <p id="platform">${game.platforms.map(platform => platform.platform.name).join(', ')}</p>
          </div>
          <div class="game-details-section">
            <h4>Developer:</h4> 
            <p id="developer">${game.developers.map(developer => developer.name).join(', ')}</p>
          </div>
          <div class="game-details-section">
            <h4>Release Date:</h4> 
            <p id="release-date">${new Date(game.released).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  `;

  gameDetailsDisplay.innerHTML = html;
};

// const featuredGames = document.getElementById("featured-games");
// const featuredList = document.getElementById("featured-list");
// const gameContainers = featuredList.querySelectorAll(".game-container");
// const descriptions = featuredList.querySelectorAll(".game-desc");


// featuredList.addEventListener("scroll", () => {
//   const scrollLeft = featuredList.scrollLeft;
//   const scrollRight = scrollLeft + featuredList.offsetWidth;

//   gameContainers.forEach((container, index) => {
//     const containerLeft = container.offsetLeft;
//     const containerRight = containerLeft + container.offsetWidth;

//     // Check if container is at least partially in view
//     if (containerRight > scrollLeft && containerLeft < scrollRight) {
//       const gameId = container.querySelector(".game-desc").getAttribute("data-id");

//       // Add "visible" class to current container and description, and remove from others
//       container.classList.add("visible");
//       descriptions.forEach((desc) => {
//         if (desc.getAttribute("data-id") === gameId) {
//           desc.classList.add("visible");
//         } else {
//           desc.classList.remove("visible");
//         }
//       });
//     } else {
//       container.classList.remove("visible");
//     }
//   });
// });












console.log("index.js loaded")