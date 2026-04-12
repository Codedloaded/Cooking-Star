/* =============================================
   نجمة الطبخ — Cooking Star | shared.js
   Central localStorage system & all page logic
   =============================================

   localStorage Keys:
   ─────────────────────────────────────────────
   cookingStar_users          → array of user objects
   cookingStar_session        → current logged-in user object
   cookingStar_recipes        → array of recipe objects
   cookingStar_favorites      → array of recipe ids
   cookingStar_recent_searches→ array of search strings
   cookingStar_recently_viewed→ array of recipe ids (max 10)
   cookingStar_form_draft     → object { filter, ingredients, etc. }
   ============================================= */


/* ═══════════════════════════════════════════
   1. STORAGE KEYS
═══════════════════════════════════════════ */
const KEYS = {
  USERS:           'cookingStar_users',
  SESSION:         'cookingStar_session',
  RECIPES:         'cookingStar_recipes',
  FAVORITES:       'cookingStar_favorites',
  RECENT_SEARCHES: 'cookingStar_recent_searches',
  RECENTLY_VIEWED: 'cookingStar_recently_viewed',
  FORM_DRAFT:      'cookingStar_form_draft',
};

// safe read
function lsGet(key) {
  try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
}
// safe write
function lsSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}


/* ═══════════════════════════════════════════
   2. SEED DATA — written once if recipes key is empty
═══════════════════════════════════════════ */
const SEED_RECIPES = [
  {
    id: "grilled-chicken", code: "RC-001",
    name: "Grilled Chicken", course: "Main Course",
    image: "grilled_chicken.jpg", time: 30, difficulty: 2,
    description: "Mix olive oil, lemon juice, minced garlic, paprika, cumin, salt, and black pepper in a bowl to make the marinade. Coat the chicken breasts with the marinade and refrigerate for at least 20 minutes. Preheat the grill over medium-high heat and grill the chicken for 6–7 minutes on each side until fully cooked. Let the chicken rest for 5 minutes before serving. Enjoy with a side salad or roasted vegetables.",
    ingredients: [
      { name: "Chicken Breast", qty: "500 g" },
      { name: "Olive Oil", qty: "3 tbsp" },
      { name: "Garlic Cloves", qty: "4 cloves" },
      { name: "Lemon Juice", qty: "2 tbsp" },
      { name: "Paprika", qty: "1 tsp" },
      { name: "Cumin", qty: "1/2 tsp" },
      { name: "Salt", qty: "1 tsp" },
      { name: "Black Pepper", qty: "1/2 tsp" }
    ]
  },
  {
    id: "spaghetti-bolognese", code: "RC-002",
    name: "Spaghetti Bolognese", course: "Main Course",
    image: "spaghetti_bolognese.jpg", time: 40, difficulty: 2,
    description: "Heat olive oil in a pan over medium heat. Add chopped onion and garlic and cook until softened. Add ground beef and cook until browned, breaking it up as it cooks. Pour in the tomato sauce, season with salt and pepper, and simmer for 20 minutes on low heat. Meanwhile, cook spaghetti in boiling salted water according to package instructions. Drain the spaghetti and serve topped with the meat sauce and grated parmesan cheese.",
    ingredients: [
      { name: "Spaghetti", qty: "400 g" },
      { name: "Ground Beef", qty: "300 g" },
      { name: "Tomato Sauce", qty: "2 cups" },
      { name: "Onion", qty: "1 medium" },
      { name: "Garlic Cloves", qty: "3 cloves" },
      { name: "Olive Oil", qty: "2 tbsp" },
      { name: "Salt", qty: "1 tsp" },
      { name: "Black Pepper", qty: "1/2 tsp" },
      { name: "Parmesan Cheese", qty: "50 g" }
    ]
  },
  {
    id: "caesar-salad", code: "RC-003",
    name: "Caesar Salad", course: "Appetizer",
    image: "caeser_salad.jpg", time: 15, difficulty: 1,
    description: "Wash and chop the romaine lettuce into bite-sized pieces and place in a large bowl. Drizzle Caesar dressing over the lettuce and toss well to coat every leaf. Add croutons and shaved parmesan cheese on top. Squeeze a little lemon juice over the salad and finish with freshly ground black pepper. Serve immediately as a fresh and crispy appetizer.",
    ingredients: [
      { name: "Romaine Lettuce", qty: "1 head" },
      { name: "Caesar Dressing", qty: "4 tbsp" },
      { name: "Croutons", qty: "1 cup" },
      { name: "Parmesan Cheese", qty: "50 g" },
      { name: "Lemon Juice", qty: "1 tbsp" },
      { name: "Black Pepper", qty: "1/2 tsp" }
    ]
  },
  {
    id: "alfredo-pasta", code: "RC-004",
    name: "Chicken Alfredo Pasta", course: "Main Course",
    image: "alfredo_pasta.jpg", time: 35, difficulty: 3,
    description: "Cook fettuccine in boiling salted water until al dente, then drain and set aside. Season chicken breast with salt and pepper and cook in a pan with butter until golden on both sides. Slice and set aside. In the same pan, sauté garlic in butter for 1 minute, then pour in the heavy cream and bring to a gentle simmer. Add parmesan cheese and stir until the sauce thickens. Toss in the cooked pasta and broccoli. Top with the sliced chicken and extra parmesan before serving.",
    ingredients: [
      { name: "Fettuccine Pasta", qty: "400 g" },
      { name: "Chicken Breast", qty: "300 g" },
      { name: "Heavy Cream", qty: "1 cup" },
      { name: "Butter", qty: "3 tbsp" },
      { name: "Parmesan Cheese", qty: "80 g" },
      { name: "Garlic Cloves", qty: "3 cloves" },
      { name: "Broccoli", qty: "1 cup" },
      { name: "Salt", qty: "1 tsp" },
      { name: "Black Pepper", qty: "1/2 tsp" }
    ]
  },
  {
    id: "lava-cake", code: "RC-005",
    name: "Chocolate Lava Cake", course: "Dessert",
    image: "lava_cake.jpg", time: 20, difficulty: 3,
    description: "Preheat oven to 220°C. Grease two ramekins with butter and dust with flour. Melt dark chocolate and butter together in a bowl over hot water, stirring until smooth. Let cool slightly. Whisk eggs, egg yolks, and sugar together until pale and thick. Fold in the chocolate mixture, then gently fold in the flour. Pour the batter into the prepared ramekins and bake for 10–12 minutes until the edges are set but the center is still soft. Let rest for 1 minute, then invert onto a plate, dust with powdered sugar, and serve immediately.",
    ingredients: [
      { name: "Dark Chocolate", qty: "100 g" },
      { name: "Butter", qty: "80 g" },
      { name: "Eggs", qty: "2" },
      { name: "Egg Yolks", qty: "2" },
      { name: "Sugar", qty: "60 g" },
      { name: "All-purpose Flour", qty: "2 tbsp" },
      { name: "Powdered Sugar", qty: "for dusting" }
    ]
  },
  {
    id: "sambosa", code: "RC-006",
    name: "Sambosa", course: "Appetizer",
    image: "sambosa.jpg", time: 40, difficulty: 2,
    description: "Heat a little oil in a pan and cook the chopped onion until soft. Add ground beef and cook until browned. Season with cumin, coriander powder, salt, and chopped green chili. Mix well and let the filling cool completely. Place a spoonful of filling onto each spring roll sheet and fold into a triangle shape, sealing the edges with a little water. Heat oil in a deep pan over medium-high heat and fry the sambosas in batches until golden and crispy on all sides. Drain on paper towels and serve hot with yogurt dipping sauce or ketchup.",
    ingredients: [
      { name: "Spring Roll Sheets", qty: "12 sheets" },
      { name: "Ground Beef", qty: "250 g" },
      { name: "Onion", qty: "1 medium" },
      { name: "Green Chili", qty: "2" },
      { name: "Cumin", qty: "1 tsp" },
      { name: "Coriander Powder", qty: "1 tsp" },
      { name: "Salt", qty: "1 tsp" },
      { name: "Oil", qty: "for frying" }
    ]
  }
];

// Seed recipes into localStorage on first load
(function seedRecipes() {
  if (!lsGet(KEYS.RECIPES)) {
    lsSet(KEYS.RECIPES, SEED_RECIPES);
  }
})();

// Always expose RECIPES_DATA as live array from localStorage
function getRecipes() {
  return lsGet(KEYS.RECIPES) || [];
}

// Legacy alias used by other pages
let RECIPES_DATA = getRecipes();


/* ═══════════════════════════════════════════
   3. RECIPE CRUD
═══════════════════════════════════════════ */
function getRecipeById(id) {
  return getRecipes().find(r => r.id === id) || null;
}

function saveRecipes(arr) {
  lsSet(KEYS.RECIPES, arr);
  RECIPES_DATA = arr; // keep alias in sync
}

function addRecipeToStore(recipe) {
  const recipes = getRecipes();
  recipes.push(recipe);
  saveRecipes(recipes);
}

function updateRecipeInStore(updatedRecipe) {
  const recipes = getRecipes().map(r =>
    r.id === updatedRecipe.id ? updatedRecipe : r
  );
  saveRecipes(recipes);
}

function deleteRecipeFromStore(id) {
  saveRecipes(getRecipes().filter(r => r.id !== id));
}


/* ═══════════════════════════════════════════
   4. AUTH — USERS
═══════════════════════════════════════════ */
function getUsers() {
  return lsGet(KEYS.USERS) || [];
}

function saveUsers(arr) {
  lsSet(KEYS.USERS, arr);
}

function registerUser(userData) {
  const users = getUsers();
  if (users.find(u => u.email === userData.email)) {
    return { ok: false, error: 'Email already registered.' };
  }
  users.push({ ...userData, isAdmin: userData.role === 'admin' });
  saveUsers(users);
  return { ok: true };
}

function loginUser(email, password, role) {
  const users = getUsers();
  const user = users.find(u =>
    u.email === email &&
    u.password === password &&
    u.role === role
  );
  if (!user) return { ok: false, error: 'Incorrect email, password, or role.' };
  return { ok: true, user };
}


/* ═══════════════════════════════════════════
   5. SESSION
═══════════════════════════════════════════ */
function getSession() {
  return lsGet(KEYS.SESSION);
}

function setSession(user) {
  lsSet(KEYS.SESSION, {
    email:     user.email,
    username:  user.username,
    firstName: user.firstName,
    role:      user.role,
    isAdmin:   user.role === 'admin'
  });
}

function clearSession() {
  localStorage.removeItem(KEYS.SESSION);
}

function requireLogin(redirectIfAdmin) {
  const s = getSession();
  if (!s) { window.location.href = 'login.html'; return null; }
  if (redirectIfAdmin && s.isAdmin) { window.location.href = 'admin.html'; return null; }
  return s;
}

function requireAdmin() {
  const s = getSession();
  if (!s || !s.isAdmin) { window.location.href = 'login.html'; return null; }
  return s;
}


/* ═══════════════════════════════════════════
   6. FAVORITES
═══════════════════════════════════════════ */
function getFavorites() {
  return lsGet(KEYS.FAVORITES) || [];
}

function saveFavorites(favs) {
  lsSet(KEYS.FAVORITES, favs);
}

function isFavorite(id) {
  return getFavorites().includes(id);
}

function addFavorite(id) {
  const favs = getFavorites();
  if (!favs.includes(id)) { favs.push(id); saveFavorites(favs); return true; }
  return false;
}

function removeFavorite(id) {
  saveFavorites(getFavorites().filter(f => f !== id));
}


/* ═══════════════════════════════════════════
   7. RECENTLY VIEWED
═══════════════════════════════════════════ */
function getRecentlyViewed() {
  return lsGet(KEYS.RECENTLY_VIEWED) || [];
}

function trackView(id) {
  let viewed = getRecentlyViewed().filter(v => v !== id);
  viewed.unshift(id);
  viewed = viewed.slice(0, 10);
  lsSet(KEYS.RECENTLY_VIEWED, viewed);
}


/* ═══════════════════════════════════════════
   8. RECENT SEARCHES
═══════════════════════════════════════════ */
const RECENT_KEY = KEYS.RECENT_SEARCHES; // alias for existing code

function searchGetRecent() {
  return lsGet(KEYS.RECENT_SEARCHES) || [];
}

function searchSaveRecent(term) {
  if (!term.trim()) return;
  let r = searchGetRecent().filter(x => x !== term);
  r.unshift(term);
  lsSet(KEYS.RECENT_SEARCHES, r.slice(0, 6));
}


/* ═══════════════════════════════════════════
   9. FORM DRAFT (persist across refresh)
═══════════════════════════════════════════ */
function saveFormDraft(data) {
  lsSet(KEYS.FORM_DRAFT, data);
}

function getFormDraft() {
  return lsGet(KEYS.FORM_DRAFT) || {};
}

function clearFormDraft() {
  localStorage.removeItem(KEYS.FORM_DRAFT);
}


/* ═══════════════════════════════════════════
   10. DYNAMIC NAVBAR
   Reads session → shows correct links + username
═══════════════════════════════════════════ */
function buildNavbar() {
  const nav = document.querySelector('.nav-links');
  if (!nav) return;

  const session = getSession();

  // Which page are we on?
  const page = window.location.pathname.split('/').pop() || 'index.html';

  const active = (href) => page === href ? 'class="active"' : '';
  const logoutActive = (href) => page === href ? 'class="logout active"' : 'class="logout"';

  if (!session) {
    // Guest navbar
    nav.innerHTML = `
      <a href="index.html" ${active('index.html')}>Home</a>
      <a href="login.html" ${active('login.html')}>Login</a>
      <a href="signup.html" ${active('signup.html')}>Sign Up</a>
    `;
  } else if (session.isAdmin) {
    // Admin navbar
    nav.innerHTML = `
      <a href="admin.html" ${active('admin.html')}>Home</a>
      <a href="add_recipe.html" ${active('add_recipe.html')}>➕ Add Recipe</a>
      <a href="manage-recipes.html" ${active('manage-recipes.html')}>Manage</a>
      <span style="font-family:'Fredoka One',sans-serif;color:var(--pink-deep);padding:8px 12px;">
        👤 ${session.firstName}
      </span>
      <a href="#" ${logoutActive('')} id="nav-logout">Logout</a>
    `;
  } else {
    // User navbar
    nav.innerHTML = `
      <a href="user-dashboard.html" ${active('user-dashboard.html')}>Home</a>
      <a href="recipes-list.html" ${active('recipes-list.html')}>Recipes</a>
      <a href="search-results.html" ${active('search-results.html')}>Search</a>
      <a href="favorites.html" ${active('favorites.html')}>Favorites</a>
      <span style="font-family:'Fredoka One',sans-serif;color:var(--pink-deep);padding:8px 12px;">
        👤 ${session.firstName}
      </span>
      <a href="#" ${logoutActive('')} id="nav-logout">Logout</a>
    `;
  }

  // Attach logout
  const logoutBtn = document.getElementById('nav-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      clearSession();
      showToast('Logged out successfully 👋');
      setTimeout(() => { window.location.href = 'login.html'; }, 800);
    });
  }
}

// Auto-run navbar build on every page
document.addEventListener('DOMContentLoaded', buildNavbar);


/* ═══════════════════════════════════════════
   11. TOAST
═══════════════════════════════════════════ */
function showToast(message, duration = 2800) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}


/* ═══════════════════════════════════════════
   12. HELPERS
═══════════════════════════════════════════ */
function getCourseBadgeClass(course) {
  if (!course) return 'badge-main';
  const c = course.toLowerCase();
  if (c.includes('appetizer')) return 'badge-appetizer';
  if (c.includes('dessert'))   return 'badge-dessert';
  return 'badge-main';
}

function difficultyStars(level) {
  const labels  = ['', 'Easy', 'Medium', 'Advanced', 'Hard', 'Expert'];
  const colours = ['', '#5abf4e', '#f5a623', '#e84c3d', '#c5357f', '#7a3050'];
  return `<span style="color:${colours[level]||'#f5a623'};font-weight:800;font-size:0.78rem;">${labels[level]||'Medium'}</span>`;
}


/* ═══════════════════════════════════════════
   13. USER DASHBOARD
═══════════════════════════════════════════ */
let dashFilter = 'all';
let dashSearch = '';

function dashRenderRecipes() {
  const grid = document.getElementById('recipes-grid');
  if (!grid) return;

  const noResultsEl = document.getElementById('no-results');
  const search = dashSearch.toLowerCase().trim();
  const recipes = getRecipes();

  // Restore form draft filter
  const draft = getFormDraft();
  if (draft.dashFilter && dashFilter === 'all') dashFilter = draft.dashFilter;
  if (draft.dashSearch && !dashSearch) {
    dashSearch = draft.dashSearch;
    const inp = document.getElementById('dashboard-search');
    if (inp) inp.value = dashSearch;
  }

  const filtered = recipes.filter(r => {
    const matchFilter = dashFilter === 'all' || r.course === dashFilter;
    const matchSearch = !search ||
      r.name.toLowerCase().includes(search) ||
      r.course.toLowerCase().includes(search) ||
      r.ingredients.some(i => i.name.toLowerCase().includes(search));
    return matchFilter && matchSearch;
  });

  const statShown = document.getElementById('stat-shown');
  const statTotal = document.getElementById('stat-total');
  const statFavs  = document.getElementById('stat-favs');
  if (statShown) statShown.textContent = filtered.length;
  if (statTotal) statTotal.textContent = recipes.length;
  if (statFavs)  statFavs.textContent  = getFavorites().length;

  if (filtered.length === 0) {
    grid.innerHTML = '';
    if (noResultsEl) noResultsEl.style.display = 'block';
    return;
  }
  if (noResultsEl) noResultsEl.style.display = 'none';

  grid.innerHTML = filtered.map((r, i) => {
    const fav = isFavorite(r.id);
    const badgeClass = getCourseBadgeClass(r.course);
    return `
      <div class="recipe-tile" style="animation-delay:${i * 0.07}s">
        <img src="${r.image}" alt="${r.name}" onerror="this.src='NewLogo.png'">
        <div class="recipe-tile-body">
          <h4>${r.name}</h4>
          <div class="recipe-tile-meta">
            <span class="course-badge ${badgeClass}">${r.course}</span>
            <span>${r.time} min</span>
            <span>${difficultyStars(r.difficulty)}</span>
          </div>
          <div class="tile-actions">
            <a href="recipe-detail.html#${r.id}" class="btn-view" onclick="trackView('${r.id}')">👁 View</a>
            <a href="#" class="btn-fav ${fav ? 'favorited' : ''}" id="fav-${r.id}"
               onclick="dashToggleFav(event,'${r.id}')">
              ${fav ? '❤️ Saved' : '🤍 Save'}
            </a>
          </div>
        </div>
      </div>`;
  }).join('');
}

function dashFilterRecipes(filter, btn) {
  dashFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  saveFormDraft({ ...getFormDraft(), dashFilter: filter });
  dashRenderRecipes();
}

function dashApplySearch() {
  const input = document.getElementById('dashboard-search');
  if (input) {
    dashSearch = input.value;
    saveFormDraft({ ...getFormDraft(), dashSearch: dashSearch });
  }
  dashRenderRecipes();
}

function dashToggleFav(e, id) {
  e.preventDefault();
  const btn = document.getElementById('fav-' + id);
  if (isFavorite(id)) {
    removeFavorite(id);
    btn.innerHTML = '🤍 Save';
    btn.classList.remove('favorited');
    showToast('Removed from favorites');
  } else {
    addFavorite(id);
    btn.innerHTML = '❤️ Saved';
    btn.classList.add('favorited');
    showToast('Added to favorites ❤️');
  }
  const statFavs = document.getElementById('stat-favs');
  if (statFavs) statFavs.textContent = getFavorites().length;
}

function initDashboard() {
  const searchInput = document.getElementById('dashboard-search');
  if (!searchInput) return;
  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') dashApplySearch();
  });
  // Restore search draft
  const draft = getFormDraft();
  if (draft.dashSearch) {
    searchInput.value = draft.dashSearch;
    dashSearch = draft.dashSearch;
  }
  if (draft.dashFilter) {
    dashFilter = draft.dashFilter;
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.textContent.includes(draft.dashFilter) ||
        (draft.dashFilter === 'all' && btn.textContent.includes('All')));
    });
  }
  dashRenderRecipes();
}


/* ═══════════════════════════════════════════
   14. SEARCH PAGE
═══════════════════════════════════════════ */
let searchCurrentResults = [];

function searchRenderRecentTags() {
  const r = searchGetRecent();
  const wrap = document.getElementById('recent-searches-wrap');
  const tags = document.getElementById('recent-tags');
  if (!wrap || !tags) return;
  if (r.length === 0) { wrap.style.display = 'none'; return; }
  wrap.style.display = 'block';
  tags.innerHTML = r.map(t =>
    `<span class="recent-tag" onclick="searchUseRecent('${t}')">${t}</span>`
  ).join('');
}

function searchUseRecent(term) {
  const input = document.getElementById('search-input');
  if (input) input.value = term;
  runSearch();
}

function runSearch() {
  const input = document.getElementById('search-input');
  if (!input) return;
  const raw  = input.value.trim();
  const term = raw.toLowerCase();
  const stypeEl = document.querySelector('input[name="stype"]:checked');
  const stype = stypeEl ? stypeEl.value : 'dish';

  const defaultState      = document.getElementById('default-state');
  const resultsHeader     = document.getElementById('results-header');
  const resultsContainer  = document.getElementById('results-container');
  const noResults         = document.getElementById('no-results');

  if (defaultState) defaultState.style.display = 'none';

  if (!term) {
    if (resultsHeader)   resultsHeader.style.display   = 'none';
    if (resultsContainer) resultsContainer.innerHTML   = '';
    if (noResults)       noResults.style.display       = 'none';
    if (defaultState)    defaultState.style.display    = 'block';
    return;
  }

  searchSaveRecent(raw);
  searchRenderRecentTags();

  // Save search draft
  saveFormDraft({ ...getFormDraft(), lastSearch: raw, lastStype: stype });

  const recipes = getRecipes();
  searchCurrentResults = recipes.filter(r => {
    if (stype === 'dish')       return r.name.toLowerCase().includes(term);
    if (stype === 'ingredient') return r.ingredients.some(i => i.name.toLowerCase().includes(term));
    if (stype === 'course')     return r.course.toLowerCase().includes(term);
    return true;
  }).map(r => ({ ...r, matchType: stype }));

  sortAndRender();
}

function sortAndRender() {
  const sortEl = document.getElementById('sort-select');
  const sort   = sortEl ? sortEl.value : 'default';
  let sorted   = [...searchCurrentResults];

  if (sort === 'name')       sorted.sort((a, b) => a.name.localeCompare(b.name));
  else if (sort === 'time')  sorted.sort((a, b) => a.time - b.time);
  else if (sort === 'difficulty') sorted.sort((a, b) => a.difficulty - b.difficulty);

  const container   = document.getElementById('results-container');
  const noResults   = document.getElementById('no-results');
  const header      = document.getElementById('results-header');
  const resultCount = document.getElementById('result-count');

  if (resultCount) resultCount.textContent = sorted.length;
  if (header)      header.style.display    = 'flex';

  if (sorted.length === 0) {
    if (container) container.innerHTML = '';
    if (noResults) noResults.style.display = 'block';
    return;
  }
  if (noResults) noResults.style.display = 'none';

  container.innerHTML = sorted.map((r, i) => {
    const fav = isFavorite(r.id);
    const badgeClass = getCourseBadgeClass(r.course);
    const matchLabel = r.matchType === 'ingredient' ? '🧂 Ingredient Match'
                     : r.matchType === 'course'     ? '📋 Course Match'
                     :                                '🍽️ Name Match';
    return `
      <div class="result-card" style="animation-delay:${i * 0.07}s">
        <img src="${r.image}" alt="${r.name}" onerror="this.src='NewLogo.png'">
        <div class="result-card-body">
          <div class="result-card-title">${r.name}</div>
          <div class="result-card-meta">
            <span class="course-badge ${badgeClass}">${r.course}</span>
            <span>${r.time} min</span>
            <span>${difficultyStars(r.difficulty)}</span>
            <span class="match-badge">${matchLabel}</span>
          </div>
          <div class="result-card-desc">${r.description}</div>
          <div class="result-card-actions">
            <a href="recipe-detail.html#${r.id}" class="btn-view" onclick="trackView('${r.id}')">👁 View Recipe</a>
            <a href="#" class="btn-fav ${fav ? 'favorited' : ''}" id="fav-${r.id}"
               onclick="searchToggleFav(event,'${r.id}')">
              ${fav ? '❤️ Saved' : '🤍 Save'}
            </a>
          </div>
        </div>
      </div>`;
  }).join('');
}

function clearSearch() {
  const input = document.getElementById('search-input');
  if (input) input.value = '';
  searchCurrentResults = [];
  const container     = document.getElementById('results-container');
  const resultsHeader = document.getElementById('results-header');
  const noResults     = document.getElementById('no-results');
  const defaultState  = document.getElementById('default-state');
  if (container)     container.innerHTML         = '';
  if (resultsHeader) resultsHeader.style.display = 'none';
  if (noResults)     noResults.style.display     = 'none';
  if (defaultState)  defaultState.style.display  = 'block';
  saveFormDraft({ ...getFormDraft(), lastSearch: '', lastStype: 'dish' });
}

function searchToggleFav(e, id) {
  e.preventDefault();
  const btn = document.getElementById('fav-' + id);
  if (isFavorite(id)) {
    removeFavorite(id);
    btn.innerHTML = '🤍 Save';
    btn.classList.remove('favorited');
    showToast('Removed from favorites');
  } else {
    addFavorite(id);
    btn.innerHTML = '❤️ Saved';
    btn.classList.add('favorited');
    showToast('Added to favorites ❤️');
  }
}

function initSearchPage() {
  const input = document.getElementById('search-input');
  if (!input) return;

  // Restore draft
  const draft = getFormDraft();
  if (draft.lastSearch) {
    input.value = draft.lastSearch;
    // restore radio
    if (draft.lastStype) {
      const radio = document.querySelector(`input[name="stype"][value="${draft.lastStype}"]`);
      if (radio) radio.checked = true;
    }
    runSearch();
  }

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') runSearch();
  });
  input.addEventListener('input', () => {
    clearTimeout(window._searchTimer);
    window._searchTimer = setTimeout(runSearch, 350);
  });

  const urlQ = new URLSearchParams(window.location.search).get('search');
  if (urlQ) { input.value = urlQ; runSearch(); }

  searchRenderRecentTags();
}