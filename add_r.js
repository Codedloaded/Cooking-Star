document.addEventListener("DOMContentLoaded", function () {

    const addBtn = document.getElementById("addIngredientBtn");
    const container = document.getElementById("ingredientsContainer");
    let ingredientCount = 0;

    // ADD INGREDIENT (WITH ANIMATION)
    function addIngredient() {
        ingredientCount++;

        const row = document.createElement("div");
        row.className = "ingredient-row";

        row.innerHTML = `
            <div>
                <label>Ingredient ${ingredientCount}:</label>
                <input type="text" class="ingredient-input" placeholder="e.g., Olive oil">
            </div>
            <div>
                <label>Quantity:</label>
                <input type="text" class="quantity-input" placeholder="e.g., 2 tbsp">
            </div>
            <button type="button" class="btn-danger remove-ingredient"
                onclick="this.parentElement.remove(); fixNumbers(); checkIngredients();">
                ✖
            </button>
        `;

        // animation start
        row.style.opacity = "0";
        row.style.transform = "translateY(20px)";

        container.appendChild(row);

        // animation end
        setTimeout(() => {
            row.style.transition = "all 0.3s ease";
            row.style.opacity = "1";
            row.style.transform = "translateY(0)";
        }, 10);

        row.querySelectorAll("input").forEach(input => {
            input.addEventListener("input", checkIngredients);
        });

        checkIngredients();
    }

    // FIX NUMBERS
    window.fixNumbers = function () {
        const rows = document.querySelectorAll(".ingredient-row");

        rows.forEach((row, index) => {
            const num = index + 1;
            row.querySelector("label").innerText = `Ingredient ${num}:`;
        });

        ingredientCount = rows.length;
    };

    // CHECK INGREDIENTS
    function checkIngredients() {
        const ingredients = document.querySelectorAll(".ingredient-input");
        const quantities = document.querySelectorAll(".quantity-input");
        const error = document.getElementById("ingredientError");

        let valid = false;

        for (let i = 0; i < ingredients.length; i++) {
            if (ingredients[i].value.trim() && quantities[i].value.trim()) {
                valid = true;
                break;
            }
        }

        error.style.display = valid || ingredients.length === 0 ? "none" : "block";
    }

    // SAVE RECIPE
    window.saveRecipe = function () {
        let valid = true;

        const name = document.getElementById("recipeName");
        const course = document.getElementById("courseType");
        const time = document.getElementById("cookingTime");
        const instructions = document.getElementById("instructions");

        if (!name.value.trim()) {
            document.getElementById("nameError").style.display = "block";
            valid = false;
        }

        if (!course.value) {
            document.getElementById("courseError").style.display = "block";
            valid = false;
        }

        if (!time.value || parseInt(time.value) < 1) {
            document.getElementById("timeError").style.display = "block";
            valid = false;
        }

        if (!instructions.value.trim()) {
            document.getElementById("instructionsError").style.display = "block";
            valid = false;
        }

        if (!valid) return false;

        showMessage("✅ Recipe saved!");
        return false;
    };

    // SUCCESS MESSAGE
    function showMessage(text) {
        const msg = document.createElement("div");
        msg.className = "success-toast";
        msg.innerHTML = text;
        document.body.appendChild(msg);

        setTimeout(() => msg.remove(), 1500);
    }

    // CLEAR FORM
    window.clearForm = function () {
        setTimeout(() => {
            document.querySelector("form").reset();
            container.innerHTML = "";
            ingredientCount = 0;
            document.getElementById("imagePreview").innerHTML = "";
        }, 50);
    };

    // IMAGE PREVIEW
    document.getElementById("imageInput").addEventListener("change", function (e) {
        const preview = document.getElementById("imagePreview");
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                preview.innerHTML = `<img src="${e.target.result}">`;
            };
            reader.readAsDataURL(file);
        } else {
            preview.innerHTML = "";
        }
    });

    // BUTTON CLICK
    addBtn.addEventListener("click", addIngredient);

});