
function getFavorites() {
  try {
    const data = JSON.parse(localStorage.getItem("favorites"));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function saveFavorites(favorites) {
  localStorage.setItem("favorites", JSON.stringify(favorites));
  updateFavoritesCounter();
}

function updateFavoritesCounter() {
  const total = getFavorites().length;
  const mobile = document.getElementById("favorites-counter-mobile");
  const desktop = document.getElementById("favorites-counter-desktop");
  if (mobile) mobile.textContent = total;
  if (desktop) desktop.textContent = total;
}


function createStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  let html = "";

  for (let i = 0; i < fullStars; i++) {
    html += '<i class="fa-solid fa-star text-yellow-400"></i>';
  }
  if (halfStar) html += '<i class="fa-solid fa-star-half-stroke text-yellow-400"></i>';
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  for (let i = 0; i < emptyStars; i++) {
    html += '<i class="fa-regular fa-star text-yellow-400"></i>';
  }
  return html;
}


function renderFavorites(items) {
  const favoritesSection = document.getElementById("favorites-items");
  if (!favoritesSection) return;

  const favorites = items || getFavorites();
  favoritesSection.innerHTML = "";
  favoritesSection.className = "grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

  favorites.forEach((product) => {
    const desc = product.description || "Нет описания";
    const price = parseFloat(product.price_uzs) || 0;
    const rating = Number(product.rating) || 0;
    const image = product.image_url || "https://via.placeholder.com/200x200?text=No+Image";

    const card = document.createElement("div");
    card.className = "rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-lg transition flex flex-col";

    card.innerHTML = `
      <div class="overflow-hidden relative">
        <img src="${image}" alt="${desc}" class="mx-auto h-44 sm:h-48 object-cover" />
        <button class="absolute top-2 right-2 text-2xl cursor-pointer transition-colors duration-300 p-1" data-action="favorite">
          <i class="fa-solid text-red-500 fa-heart"></i>
        </button>
      </div>
      <div class="p-3 flex flex-col flex-1">
        <h3 class="text-sm sm:text-base font-medium text-gray-700 mb-1 line-clamp-2">${desc}</h3>
        <div class="text-blue-600 font-semibold text-sm sm:text-base mb-2">${price.toLocaleString()} UZS</div>
        <div class="flex items-center mb-2 space-x-1">${createStars(rating)}</div>
        <button class="mt-auto cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-1.5 sm:py-2 rounded-lg text-sm sm:text-base transition" data-action="cart">
          В корзину
        </button>
      </div>
    `;

    card.querySelector('[data-action="favorite"]').addEventListener("click", () => {
      const updated = getFavorites().filter((p) => p.id !== product.id);
      saveFavorites(updated);
      renderFavorites();
    });

   
    card.querySelector('[data-action="cart"]').addEventListener("click", () => {
      addToCart(product); 
    });

    favoritesSection.appendChild(card);
  });

  updateFavoritesCounter();
}


function initFavoritesSearch() {
  const inputs = [
    document.getElementById("search-input"),
    document.getElementById("menu-search-input")
  ].filter(Boolean); 

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      const query = (input.value || "").toLowerCase();
      const filtered = getFavorites().filter((p) =>
        (p.description || "").toLowerCase().includes(query)
      );
      renderFavorites(filtered);
    });
  });
}


renderFavorites();     
initFavoritesSearch();  
