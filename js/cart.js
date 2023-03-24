import { games } from "./index.js";

let cart = [];

export const addToCart = (gameId, gameTitle, gamePrice) => {
  const game = { id: gameId, name: gameTitle, price: gamePrice };

  cart.push(game);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartDisplay();
  showCartNotification();

  console.log(`Game ${gameTitle} added to cart.`);
};

const removeGame = (gameId) => {
  cart = cart.filter((game) => game.id !== gameId);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartDisplay();
};

export const updateCartDisplay = () => {
  const navCart = document.getElementById("nav-cart");
  const cartIcon = document.querySelector(".fa-cart-shopping");
  let totalPrice = 0;

  cart = JSON.parse(localStorage.getItem("cart")) || [];
  cartIcon.dataset.count = cart.length;

  if (cart.length === 0) {
    navCart.innerHTML = "<p>Cart is empty</p>";
    return;
  }

  const fragment = document.createDocumentFragment();

  cart.forEach((game) => {
    const cartItem = document.createElement("li");
    cartItem.classList.add("cart-item");
    const price = localStorage.getItem(`price_${game.id}`);
    totalPrice += Number(price);
    cartItem.innerHTML = `
      <span class="cart-text">${game.name} - $${price}</span>
      <button class="remove-game" data-id="${game.id}">
          <i class="fa-regular fa-trash-can"></i>
      </button>
    `;
    fragment.appendChild(cartItem);

    const removeButton = cartItem.querySelector(".remove-game");
    removeButton.addEventListener("click", (event) => {
      console.log(`Removing game with ID: ${game.id}`);
      removeGame(game.id);
    });
  });

  const totalPriceDiv = document.createElement("div");
  totalPriceDiv.classList.add("total");
  totalPriceDiv.textContent = `Total: $${totalPrice.toFixed(2)}`;

  const paymentButton = document.createElement("button");
  paymentButton.textContent = "Go to payment";
  paymentButton.addEventListener("click", () => {
    window.location.href = "payment.html";
  });

  fragment.appendChild(totalPriceDiv);
  fragment.appendChild(paymentButton);
  navCart.innerHTML = "";
  navCart.appendChild(fragment);
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


console.log("cart.js loaded")