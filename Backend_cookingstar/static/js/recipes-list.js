document.addEventListener("DOMContentLoaded", () => {

  if (typeof window.showToast !== 'function') {
    window.showToast = function(message, duration = 2800) {
      let toast = document.getElementById("toast");

      if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        document.body.appendChild(toast);
      }

      toast.textContent = message;
      toast.classList.add("show");

      setTimeout(() => {
        toast.classList.remove("show");
      }, duration);
    };
  }

  if (typeof window.isFavorite !== 'function') {

    window.isFavorite = function(id) {
      try {
        const favs = JSON.parse(
          localStorage.getItem("cookingStar_favorites") || "[]"
        );

        return favs.includes(id);

      } catch (e) {
        return false;
      }
    };

    window.addFavorite = function(id) {

      const favs = JSON.parse(
        localStorage.getItem("cookingStar_favorites") || "[]"
      );

      if (!favs.includes(id)) {

        favs.push(id);

        localStorage.setItem(
          "cookingStar_favorites",
          JSON.stringify(favs)
        );

        return true;
      }

      return false;
    };

    window.removeFavorite = function(id) {

      let favs = JSON.parse(
        localStorage.getItem("cookingStar_favorites") || "[]"
      );

      favs = favs.filter(fid => fid !== id);

      localStorage.setItem(
        "cookingStar_favorites",
        JSON.stringify(favs)
      );
    };
  }

  setupSearch();
  setupFilters();
  loadRecipes();
  spawnGlitterStars();
});

function syncFavButtons() {

  document.querySelectorAll(".fav-btn").forEach(btn => {

    const recipeId = btn.dataset.id;

    if (
      typeof window.isFavorite === "function" &&
      window.isFavorite(recipeId)
    ) {

      markFav(btn);

    } else {

      unmarkFav(btn);
    }

    btn.removeEventListener("click", handleFavClick);
    btn.addEventListener("click", handleFavClick);
  });
}

function handleFavClick(event) {

  const btn = event.currentTarget;
  toggleFav(btn);
}

function toggleFav(btn) {

  const id = btn.dataset.id;

  if (!id) return;

  if (
    typeof window.isFavorite === "function" &&
    window.isFavorite(id)
  ) {

    if (typeof window.removeFavorite === "function") {
      window.removeFavorite(id);
    }

    unmarkFav(btn);

    if (typeof window.showToast === "function") {
      window.showToast("Removed from favourites!");
    }

  } else {

    if (typeof window.addFavorite === "function") {
      window.addFavorite(id);
    }

    markFav(btn);

    if (typeof window.showToast === "function") {
      window.showToast("Added to favourites!");
    }
  }
}

function markFav(btn) {

  btn.textContent = "Remove from Fav";
  btn.classList.remove("btn-secondary");
  btn.classList.add("btn-danger");
}

function unmarkFav(btn) {

  btn.textContent = "Add to Fav";
  btn.classList.remove("btn-danger");
  btn.classList.add("btn-secondary");
}

function setupSearch() {

  const input = document.getElementById("recipe-search");

  if (!input) return;

  input.addEventListener("input", applyFilters);
}

function setupFilters() {

  document.querySelectorAll(".filter-chip").forEach(chip => {

    chip.addEventListener("click", () => {

      document
        .querySelectorAll(".filter-chip")
        .forEach(c => c.classList.remove("active"));

      chip.classList.add("active");

      applyFilters();
    });
  });
}

function applyFilters() {

  const query =
    document
      .getElementById("recipe-search")
      ?.value
      .toLowerCase()
      .trim() || "";

  const course =
    document
      .querySelector(".filter-chip.active")
      ?.dataset
      .filter || "all";

  const cards =
    document.querySelectorAll(".recipe-card-tile");

  let visible = 0;

  cards.forEach(card => {

    const recipeName =
      (card.dataset.name || "").toLowerCase();

    const recipeCourse =
      card.dataset.course || "";

    const matchSearch =
      recipeName.includes(query);

    const matchCourse =
      course === "all" ||
      recipeCourse === course;

    if (matchSearch && matchCourse) {

      card.style.display = "block";
      visible++;

    } else {

      card.style.display = "none";
    }
  });

  const noResults =
    document.getElementById("no-results");

  if (noResults) {

    noResults.style.display =
      visible === 0 ? "block" : "none";
  }
}
function spawnGlitterStars() {

  const STARS = [
    '✦','✧','★','☆','✨','💫','⭐','🌟',
    '🥄','🍕','🍭','🍩','🍪','🍇',
    '🍓','🍒','🍫','🍴','🍧','🌶️'
  ];

  const container =
    document.getElementById('glitter-container');

  if (!container) return;

  function spawnOne() {

    const el = document.createElement('div');

    el.className = 'glitter-star';

    el.textContent =
      STARS[Math.floor(Math.random() * STARS.length)];

    el.style.left = Math.random() * 100 + 'vw';

    el.style.fontSize =
      (0.6 + Math.random() * 1.4) + 'rem';

    el.style.animationDuration =
      (5 + Math.random() * 8) + 's';

    el.style.animationDelay =
      (Math.random() * 3) + 's';

    const colors = [
      '#ff5c8a',
      '#ffd700',
      '#ff007f',
      '#ffb347',
      '#ff99bb',
      '#fff176'
    ];

    el.style.color =
      colors[Math.floor(Math.random() * colors.length)];

    container.appendChild(el);

    setTimeout(() => {
      el.remove();
    }, 14000);
  }

  setInterval(spawnOne, 600);

  for (let i = 0; i < 12; i++) {
    setTimeout(spawnOne, i * 200);
  }
}

async function loadRecipes() {

  const recipesContainer =
    document.getElementById("recipes-grid");

  if (!recipesContainer) return;

  try {

    const response =
      await fetch("/api/recipes/");

    const data =
      await response.json();

    const recipes =
      Array.isArray(data)
        ? data
        : Array.isArray(data.results)
          ? data.results
          : [];

    recipesContainer.innerHTML = "";

    if (recipes.length === 0) {

      recipesContainer.innerHTML = `
        <div style="padding:20px;">
          No recipes found
        </div>
      `;

      return;
    }

    recipes.forEach(recipe => {

      recipesContainer.innerHTML += `
        <div class="recipe-card-tile"
             data-name="${recipe.title.toLowerCase()}"
             data-course="${recipe.course || 'all'}"
             style="
                background:white;
                padding:20px;
                margin:20px;
                border-radius:20px;
                border:2px solid pink;
        ">

            <h2>${recipe.title}</h2>

            <p>${recipe.description || ""}</p>

            <p>
              <strong>Course:</strong>
              ${recipe.course || ""}
            </p>

            <button
                class="fav-btn btn-secondary"
                data-id="${recipe.id}">
                Add to Fav
            </button>

        </div>
      `;
    });

    syncFavButtons();
    applyFilters();

  } catch (error) {

    console.log("Error loading recipes:", error);

    recipesContainer.innerHTML = `
      <div style="color:red;padding:20px;">
        Failed to load recipes
      </div>
    `;
  }
}