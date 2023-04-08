let cart = JSON.parse(localStorage.getItem("cart")) || [];

export const addToCart = (gameId, gameTitle, gamePrice, gameCover) => {
  const game = { id: gameId, name: gameTitle, price: gamePrice, cover: gameCover};

  cart.push(game);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartDisplay();
  showCartNotification();

  console.log(`Game ${gameTitle} added to cart for ${gamePrice} .`);
};



export const removeGame = (gameId) => {
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
    navCart.innerHTML = "<h4 id='empty-cart'>Cart is empty</h4>";
    return;
  }

  const fragment = document.createDocumentFragment();

  cart.forEach((game) => {
    const cartItem = document.createElement("li");
    cartItem.classList.add("cart-item");
    const price = localStorage.getItem(`price_${game.id}`);
    totalPrice += Number(price);
    cartItem.innerHTML = `
      <p class="cart-text">${game.name} <br> - $${price}</p>
      <button class="remove-game-btn" data-id="${game.id}">
          <i class="fa-regular fa-trash-can"></i>
      </button>
    `;
    fragment.appendChild(cartItem);

    const removeButton = cartItem.querySelector(".remove-game-btn");
    removeButton.addEventListener("click", (event) => {
      console.log(`Removing game with ID: ${game.id}`);
      removeGame(game.id);
    });
  });

  const totalPriceDiv = document.createElement("div");
  totalPriceDiv.classList.add("total");
  totalPriceDiv.textContent = `Total: $${totalPrice.toFixed(2)}`;

  const paymentButton = document.createElement("button");
  paymentButton.classList.add("nav-btn");
  paymentButton.textContent = "Go to payment";
  paymentButton.addEventListener("click", () => {
    window.location.href = "cart.html";
  });

  fragment.appendChild(totalPriceDiv);
  fragment.appendChild(paymentButton);
  navCart.innerHTML = "";
  navCart.appendChild(fragment);
};

export const showCartNotification = () => {
  const cartIcon = document.querySelector(".cart-notification");
  cartIcon.classList.add("flash");

  setTimeout(() => {
    cartIcon.classList.remove("flash");
  }, 2000);
};




console.log("cart.js loaded")