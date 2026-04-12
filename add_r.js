document.addEventListener("DOMContentLoaded", function () {

    const addBtn    = document.getElementById("addIngredientBtn");
    const container = document.getElementById("ingredientsContainer");
    let ingredientCount = 0;
    let uploadedImageDataURL = ""; // stores base64 of uploaded image

    // ── ADD INGREDIENT ──
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

        row.style.opacity   = "0";
        row.style.transform = "translateY(20px)";
        container.appendChild(row);

        setTimeout(() => {
            row.style.transition = "all 0.3s ease";
            row.style.opacity    = "1";
            row.style.transform  = "translateY(0)";
        }, 10);

        row.querySelectorAll("input").forEach(input => {
            input.addEventListener("input", checkIngredients);
        });

        checkIngredients();
    }

    // ── FIX INGREDIENT NUMBERS AFTER REMOVAL ──
    window.fixNumbers = function () {
        const rows = document.querySelectorAll(".ingredient-row");
        rows.forEach((row, index) => {
            row.querySelector("label").innerText = `Ingredient ${index + 1}:`;
        });
        ingredientCount = rows.length;
    };

    // ── VALIDATE INGREDIENTS ──
    function checkIngredients() {
        const ingredients = document.querySelectorAll(".ingredient-input");
        const quantities  = document.querySelectorAll(".quantity-input");
        const error       = document.getElementById("ingredientError");
        let valid = false;
        for (let i = 0; i < ingredients.length; i++) {
            if (ingredients[i].value.trim() && quantities[i].value.trim()) {
                valid = true;
                break;
            }
        }
        error.style.display = (valid || ingredients.length === 0) ? "none" : "block";
    }

    // ── SAVE RECIPE → localStorage ──
    window.saveRecipe = function () {
        let valid = true;

        const nameEl         = document.getElementById("recipeName");
        const courseEl       = document.getElementById("courseType");
        const timeEl         = document.getElementById("cookingTime");
        const instructionsEl = document.getElementById("instructions");

        // Clear previous errors
        ["nameError","courseError","timeError","instructionsError"].forEach(id => {
            document.getElementById(id).style.display = "none";
        });

        if (!nameEl.value.trim()) {
            document.getElementById("nameError").style.display = "block";
            valid = false;
        }
        if (!courseEl.value) {
            document.getElementById("courseError").style.display = "block";
            valid = false;
        }
        if (!timeEl.value || parseInt(timeEl.value) < 1) {
            document.getElementById("timeError").style.display = "block";
            valid = false;
        }
        if (!instructionsEl.value.trim()) {
            document.getElementById("instructionsError").style.display = "block";
            valid = false;
        }

        if (!valid) return false;

        // ── Collect ingredients ──
        const ingredientInputs = document.querySelectorAll(".ingredient-input");
        const quantityInputs   = document.querySelectorAll(".quantity-input");
        const ingredients = [];
        ingredientInputs.forEach((inp, i) => {
            const name = inp.value.trim();
            const qty  = quantityInputs[i]?.value.trim();
            if (name) ingredients.push({ name, qty: qty || "" });
        });

        // ── Build unique ID and code ──
        const idBase  = nameEl.value.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
        const uniqueId = idBase + "-" + Date.now();

        // Generate next recipe code
        const existingRecipes = getRecipes();
        const nextNum  = existingRecipes.length + 1;
        const code     = "RC-" + String(nextNum).padStart(3, "0");

        // ── Clean course value (strip emoji prefix if present) ──
        const rawCourse  = courseEl.value;
        const courseClean = rawCourse.replace(/^[^\w]+/, "").trim(); // strips leading emoji

        // ── Build recipe object ──
        const newRecipe = {
            id:          uniqueId,
            code:        code,
            name:        nameEl.value.trim(),
            course:      courseClean,
            image:       uploadedImageDataURL || "NewLogo.png",
            time:        parseInt(timeEl.value),
            difficulty:  2, // default medium
            description: instructionsEl.value.trim(),
            mistakes:    document.getElementById("mistakes")?.value.trim() || "",
            ingredients: ingredients
        };

        // ── Save to localStorage via shared.js ──
        addRecipeToStore(newRecipe);

        // ── Success feedback ──
        showToast("✅ Recipe saved successfully!");

        // ── Reset form ──
        setTimeout(() => {
            document.querySelector("form").reset();
            container.innerHTML   = "";
            ingredientCount       = 0;
            uploadedImageDataURL  = "";
            document.getElementById("imagePreview").innerHTML = "";
        }, 300);

        return false; // prevent form submission
    };

    // ── CLEAR FORM ──
    window.clearForm = function () {
        setTimeout(() => {
            document.querySelector("form").reset();
            container.innerHTML  = "";
            ingredientCount      = 0;
            uploadedImageDataURL = "";
            document.getElementById("imagePreview").innerHTML = "";
            ["nameError","courseError","timeError","instructionsError","ingredientError"].forEach(id => {
                document.getElementById(id).style.display = "none";
            });
        }, 50);
    };

    // ── IMAGE PREVIEW + store as base64 ──
    document.getElementById("imageInput").addEventListener("change", function (e) {
        const preview = document.getElementById("imagePreview");
        const file    = e.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = function (ev) {
                uploadedImageDataURL = ev.target.result; // save for recipe object
                preview.innerHTML = `<img src="${ev.target.result}">`;
            };
            reader.readAsDataURL(file);
        } else {
            uploadedImageDataURL = "";
            preview.innerHTML    = "";
        }
    });

    // ── BUTTON CLICK ──
    addBtn.addEventListener("click", addIngredient);

});