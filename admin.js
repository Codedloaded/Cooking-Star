
// Update admin stats from shared data
function updateAdminStats() {

    const recipesCount = RECIPES_DATA?.length || 0;

    const recipesCell = document.getElementById("total-recipes");
    const usersCell = document.getElementById("total-users");
    const pendingCell = document.getElementById("pending-recipes");

    if (recipesCell) {
        recipesCell.textContent = recipesCount;
    }

    if (usersCell) {
        usersCell.textContent = 10; // static for now
    }

    if (pendingCell) {
        pendingCell.textContent = 0; // static for now
    }
}

updateAdminStats();


// Logout system
document.querySelector(".logout")?.addEventListener("click", (e) => {
    e.preventDefault();

    alert("Logged out successfully 👋");

    window.location.href = "login.html";
});


// Button effects for admin actions
document.querySelectorAll(".btn").forEach(btn => {
    btn.addEventListener("click", () => {
        btn.classList.add("clicked");

        setTimeout(() => {
            btn.classList.remove("clicked");
        }, 200);
    });
});

