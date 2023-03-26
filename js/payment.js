import { updateCartDisplay } from "./cart.js";
import { removeGame } from "./cart.js";

const cartDisplay = document.getElementById("cart-display");
const paymentSectionContainer = document.getElementById("payment-section-container");
const totalPriceDiv = document.createElement("div");
const paymentButton = document.createElement("button");

const createPaymentSection = (totalPrice) => {
  totalPriceDiv.classList.add("total");
  totalPriceDiv.textContent = `Total: $${totalPrice.toFixed(2)}`;

  paymentButton.textContent = "Go to Payment";
  paymentButton.addEventListener("click", () => {
    const paymentContainer = document.getElementById("payment-container");
    const body = document.getElementById("body-cart");
    paymentContainer.classList.add("show");
  });

  const paymentSection = document.createElement("div");
  paymentSection.classList.add("payment-section");
  paymentSection.appendChild(totalPriceDiv);
  paymentSection.appendChild(paymentButton);

  paymentSectionContainer.appendChild(paymentSection);
};

const updatePaymentSection = (totalPrice) => {
  totalPriceDiv.textContent = `Total: $${totalPrice.toFixed(2)}`;
  paymentButton.textContent = `Pay $${totalPrice.toFixed(2)}`;
};

const displayCartContents = () => {
  cartDisplay.innerHTML = "";

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    cartDisplay.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  const gameContainers = cart.map((game) => {
    return `
      <div class="game-container">
        <img class="game-cover" src="${game.cover}" alt="${game.name}" />
        <div class="game-details">
          <h3 class="game-title">${game.name}</h3>
          <p class="game-description">${game.description ? game.description : 'Description not available'}</p>
        </div>
        <div class="game-price">
          <span>$ ${game.price}</span>
          <button class="game-buy" data-id="${game.id}">Remove from cart</button>
        </div>
      </div>
    `;
  });

  cartDisplay.innerHTML = gameContainers.join("");

  const totalPrice = cart.reduce((total, game) => total + Number(game.price), 0);

  if (!totalPriceDiv.parentNode) {
    createPaymentSection(totalPrice);
  } else {
    updatePaymentSection(totalPrice);
  }

  const removeButtons = document.querySelectorAll(".game-buy");
  removeButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const gameId = event.target.dataset.id;
      console.log(`Removing game with ID: ${gameId}`);
      removeGame(gameId);
      displayCartContents();
      updateCartDisplay();

      const newTotalPrice = cart.reduce((total, game) => total + Number(game.price), 0);
      updatePaymentSection(newTotalPrice);
    });
  });

  const payButton = document.getElementById("pay-btn");
  payButton.textContent = `Pay $${totalPrice.toFixed(2)}`;
  payButton.addEventListener("click", () => {
    localStorage.removeItem("cart");
    alert("Thank you for your purchase!");
    window.location.reload();
  });
};

displayCartContents();
updateCartDisplay();

console.log("payment.js loaded");
