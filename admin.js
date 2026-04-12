// Update admin stats from shared localStorage data
function updateAdminStats() {
    const recipes = getRecipes();
    const users   = getUsers();

    const recipesCell = document.getElementById('total-recipes');
    const usersCell   = document.getElementById('total-users');
    const pendingCell = document.getElementById('pending-recipes');

    if (recipesCell) recipesCell.textContent = recipes.length;
    if (usersCell)   usersCell.textContent   = users.length;
    if (pendingCell) pendingCell.textContent  = 0;
}

document.addEventListener('DOMContentLoaded', () => {
    updateAdminStats();
});