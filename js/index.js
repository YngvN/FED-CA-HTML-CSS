import { fetchData } from "./utility.js";
import { buildSearchUrl } from "./api.js";
import { addToCart } from "./cart.js";
import { updateCartDisplay } from "./cart.js";

updateCartDisplay();


const gameList = document.getElementById("featured-list");
const saleList = document.getElementById("sale-list");
const featuredGameContainer = document.getElementById("featured-games");
const pageSize = 15;
const pageNumber = 1;

const url = buildSearchUrl("", pageSize, pageNumber);

export const games = await fetchData(url);

for (let i = 0; i < games.length; i++) {
  const randomGame = games[i];

  const gameItem = document.createElement("div");
  gameItem.innerHTML = `
    <div id="game-container-index" class="game-container">
      <img class="game-cover" src="${randomGame.background_image}" alt="${randomGame.name}" />
      
      <div class="game-details">
      <h3 class="game-title">${randomGame.name}</h3>
        <p class="game-description">${randomGame.description ? randomGame.description : 'Description not available'}</p>
      </div>
      <div class="game-price">
        <span>$ ${randomGame.price}</span>
        <button class="game-buy" data-id="${randomGame.id}">Add to Cart</button>
      </div>
    </div>
  `;

  // Add the new game item to the list
  if (i < 5) {
    gameList.appendChild(gameItem);
  } else {
    saleList.appendChild(gameItem);
  }
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
    console.log("Adding " + gameTitle + " to cart");
    // Add the game to the cart
    addToCart(gameId, gameTitle, gamePrice, gameCover, gameDescription);
    updateCartDisplay();
  });
});


console.log("index.js loaded")



