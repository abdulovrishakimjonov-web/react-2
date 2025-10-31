function getCart() {
  try {
    const data = JSON.parse(localStorage.getItem("cart"));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function getFavorites() {
  try {
    const data = JSON.parse(localStorage.getItem("favorites"));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCounter();
}

function saveFavorites(favorites) {
  localStorage.setItem("favorites", JSON.stringify(favorites));
  updateFavoritesCounter();
}

function updateCartCounter() {
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const mobile = document.getElementById("cart-counter-mobile");
  const desktop = document.getElementById("cart-counter-desktop");
  if (mobile) mobile.textContent = total;
  if (desktop) desktop.textContent = total;
}

function initCartSearch() {
  const inputs = [
    document.getElementById("search-input"),
    document.getElementById("menu-search-input"),
  ].filter(Boolean);

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      const query = (input.value || "").toLowerCase();
      const cart = getCart();
      const filtered = cart.filter((p) =>
        (p.description || "").toLowerCase().includes(query)
      );
      renderCart(filtered);
    });
  });
}

function renderCart(items = null) {
  const cartItemsDiv = document.getElementById("cart-items");
  if (!cartItemsDiv) return;

  const cart = items || getCart();
  cartItemsDiv.innerHTML = "";
  cartItemsDiv.className =
    "grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3";

  let total = 0;

  cart.forEach((product) => {
    const qty = product.quantity || 1;
    const price = parseFloat(product.price_uzs) || 0;
    total += price * qty;

    const favorites = getFavorites();
    const isFavorite = favorites.some((f) => f.id === product.id);

    const card = document.createElement("div");
    card.className =
      "rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col bg-white";

    card.innerHTML = `
      <div class="overflow-hidden relative">
        <img src="${product.image_url}" alt="${
      product.description
    }" class="mx-auto h-44 sm:h-48 object-cover" />
        <button class="absolute top-2 right-2 text-2xl cursor-pointer transition-colors duration-300 p-1" data-action="favorite">
         <i class="${
           isFavorite ? "fa-solid text-red-500" : "fa-regular text-gray-400"
         } fa-heart"></i>
        </button>
      </div>
      <div class="p-3 flex flex-col flex-1">
        <h3 class="text-sm sm:text-base font-medium text-gray-700 mb-1 line-clamp-2">${
          product.description
        }</h3>
        <div class="text-blue-600 font-semibold text-sm sm:text-base mb-2">${price.toLocaleString()} UZS</div>
        <div class="flex items-center gap-2 mt-2">
          <button data-action="decrease" class="px-2 py-0.5 bg-gray-200 rounded cursor-pointer">-</button>
          <span data-quantity class="w-6 h-6 flex items-center justify-center bg-blue-600 text-white font-medium rounded text-sm">${qty}</span>
          <button data-action="increase" class="px-2 py-0.5 bg-gray-200 rounded cursor-pointer">+</button>
          <button data-action="remove" class="px-2 py-0.5 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer">Удалить</button>
        </div>
      </div>
    `;

    card
      .querySelector('[data-action="increase"]')
      .addEventListener("click", () => {
        product.quantity += 1;
        saveCart(cart);
        renderCart();
      });

    card
      .querySelector('[data-action="decrease"]')
      .addEventListener("click", () => {
        if (product.quantity > 1) {
          product.quantity -= 1;
        } else {
          const idx = cart.findIndex((p) => p.id === product.id);
          if (idx > -1) cart.splice(idx, 1);
        }
        saveCart(cart);
        renderCart();
      });

    card
      .querySelector('[data-action="remove"]')
      .addEventListener("click", () => {
        const filtered = cart.filter((p) => p.id !== product.id);
        saveCart(filtered);
        renderCart();
      });


    card
      .querySelector('[data-action="favorite"]')
      .addEventListener("click", () => {
        let favorites = getFavorites();
        if (favorites.some((f) => f.id === product.id)) {
          favorites = favorites.filter((f) => f.id !== product.id);
        } else {
          favorites.push(product);
        }
        saveFavorites(favorites);
        renderCart(); 
      });

    cartItemsDiv.appendChild(card);
  });

  const totalDiv = document.getElementById("cart-total");
  if (totalDiv) totalDiv.textContent = total.toLocaleString() + " UZS";

  updateCartCounter();
}

renderCart();
initCartSearch();
