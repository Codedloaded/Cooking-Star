
    let currentEditId   = null;
    let currentDeleteId = null;
    let editImageDataURL = "";

    // ── Render Table ──
    function renderTable() {
      const tbody   = document.getElementById('recipes-tbody');
      const emptyMsg = document.getElementById('empty-msg');
      const recipes = getRecipes();

      if (recipes.length === 0) {
        tbody.innerHTML = '';
        emptyMsg.style.display = 'block';
        return;
      }
      emptyMsg.style.display = 'none';

      tbody.innerHTML = recipes.map(r => {
        const badgeClass = getCourseBadgeClass(r.course);
        return `
          <tr data-id="${r.id}">
            <td><img src="${r.image}" alt="${r.name}" width="80" height="60"
                style="object-fit:cover; border-radius:10px; border:2px solid rgba(255,150,190,0.3);"
                onerror="this.src='NewLogo.png'"></td>
            <td style="font-weight:700; color:var(--text-dark);">${r.name}</td>
            <td><span class="course-badge ${badgeClass}">${r.course}</span></td>
            <td style="color:var(--text-mid);">⏱ ${r.time} min</td>
            <td class="action-cell">
              <button class="btn-edit" onclick="openEditPanel('${r.id}')">✏️ Edit</button>
              <button class="btn-delete" onclick="openDeletePanel('${r.id}')">🗑️ Delete</button>
            </td>
          </tr>`;
      }).join('');
    }

    // ── Edit ──
    function openEditPanel(id) {
      const r = getRecipeById(id);
      if (!r) return;
      currentEditId    = id;
      editImageDataURL = "";

      document.getElementById('edit-name').value         = r.name;
      document.getElementById('edit-course').value       = r.course;
      document.getElementById('edit-time').value         = r.time;
      document.getElementById('edit-difficulty').value   = r.difficulty || 2;
      document.getElementById('edit-instructions').value = r.description;
      document.getElementById('edit-img-preview').src    = r.image;

      document.getElementById('delete-panel').style.display = 'none';
      document.getElementById('edit-panel').style.display   = 'block';
      document.getElementById('edit-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function closeEditPanel() {
      document.getElementById('edit-panel').style.display = 'none';
      currentEditId = null;
    }

    // Image preview in edit form
    document.getElementById('edit-image-input').addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        editImageDataURL = ev.target.result;
        document.getElementById('edit-img-preview').src = ev.target.result;
      };
      reader.readAsDataURL(file);
    });

    document.getElementById('edit-form').addEventListener('submit', function(e) {
      e.preventDefault();
      if (!currentEditId) return;

      const original = getRecipeById(currentEditId);
      const updated  = {
        ...original,
        name:        document.getElementById('edit-name').value.trim(),
        course:      document.getElementById('edit-course').value,
        time:        parseInt(document.getElementById('edit-time').value),
        difficulty:  parseInt(document.getElementById('edit-difficulty').value),
        description: document.getElementById('edit-instructions').value.trim(),
        image:       editImageDataURL || original.image,
      };

      updateRecipeInStore(updated);
      closeEditPanel();
      renderTable();
      showToast(`✅ "${updated.name}" updated successfully!`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ── Delete ──
    function openDeletePanel(id) {
      const r = getRecipeById(id);
      if (!r) return;
      currentDeleteId = id;

      document.getElementById('delete-recipe-name').textContent   = r.name;
      document.getElementById('delete-recipe-course').textContent = r.course;

      document.getElementById('edit-panel').style.display   = 'none';
      document.getElementById('delete-panel').style.display = 'block';
      document.getElementById('delete-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function closeDeletePanel() {
      document.getElementById('delete-panel').style.display = 'none';
      currentDeleteId = null;
    }

    document.getElementById('confirm-delete-btn').addEventListener('click', function() {
      if (!currentDeleteId) return;
      const name = getRecipeById(currentDeleteId)?.name || 'Recipe';
      deleteRecipeFromStore(currentDeleteId);
      closeDeletePanel();
      renderTable();
      showToast(`🗑️ "${name}" deleted.`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ── Course badge helper (local, for table) ──
    // Already available from shared.js

    // ── Init ──
    renderTable();
document.addEventListener("DOMContentLoaded", function () {

    const allH2 = document.querySelectorAll("h2");
    let editH2 = null, deleteH2 = null;

    allH2.forEach(function (h) {
        if (h.textContent.trim() === "Edit Recipe")   editH2   = h;
        if (h.textContent.trim() === "Delete Recipe") deleteH2 = h;
    });

    const editH3s = document.querySelectorAll("h3[id^='edit-']");
    editH3s.forEach(function (h3) {
        h3.style.display = "none";
        let next = h3.nextElementSibling;
        while (next && next.tagName !== "H3") {
            next.style.display = "none";
            next = next.nextElementSibling;
        }
    });
    if (editH2) editH2.style.display = "none";

    if (deleteH2) {
        let el = deleteH2;
        while (el) {
            el.style.display = "none";
            el = el.nextElementSibling;
        }
    }

    const allHrs = document.querySelectorAll("hr");
    allHrs.forEach(function (hr) {
        const prev = hr.previousElementSibling;
        if (prev && (prev.tagName === "BR" || prev.tagName === "TABLE")) {
            hr.style.display = "none";
        }
    });

    const mainTable = document.querySelector("table");
    const allRows   = mainTable.querySelectorAll("tr:not(:first-child)");

    allRows.forEach(function (row) {
        const editBtn    = row.querySelectorAll("button")[0];
        const deleteBtn  = row.querySelectorAll("button")[1];
        const editLink   = editBtn.parentElement;
        const deleteLink = deleteBtn.parentElement;

        const editAnchor   = editLink.getAttribute("href").replace("#", "");
        const deleteAnchor = deleteLink.getAttribute("href").replace("#", "");

        editBtn.addEventListener("click", function (e) {
            e.preventDefault();

            hideDynamicDeletePanel();

            editH3s.forEach(function (h) {
                h.style.display = "none";
                let next = h.nextElementSibling;
                while (next && next.tagName !== "H3") {
                    next.style.display = "none";
                    next = next.nextElementSibling;
                }
            });
            if (editH2) editH2.style.display = "none";

            const targetH3 = document.getElementById(editAnchor);
            if (!targetH3) return;

            if (editH2) editH2.style.display = "block";
            targetH3.style.display = "block";

            let next = targetH3.nextElementSibling;
            while (next && next.tagName !== "H3") {
                next.style.display = "block";
                next = next.nextElementSibling;
            }

            targetH3.scrollIntoView({ behavior: "smooth", block: "start" });

            const form = targetH3.nextElementSibling;
            if (form && form.tagName === "FORM") {
                form.style.transition = "box-shadow 0.3s";
                form.style.boxShadow  = "0 0 0 3px #ff8fab";
                setTimeout(() => { form.style.boxShadow = ""; }, 1500);
            }
        });

        deleteBtn.addEventListener("click", function (e) {
            e.preventDefault();

            editH3s.forEach(function (h) {
                h.style.display = "none";
                let n = h.nextElementSibling;
                while (n && n.tagName !== "H3") { n.style.display = "none"; n = n.nextElementSibling; }
            });
            if (editH2) editH2.style.display = "none";

            showDynamicDeletePanel(row, deleteAnchor);
        });
    });

    const allForms = document.querySelectorAll("form");

    allForms.forEach(function (form) {
        let realH3 = form.previousElementSibling;
        while (realH3 && realH3.tagName !== "H3") {
            realH3 = realH3.previousElementSibling;
        }

        form.addEventListener("submit", function (e) {
            e.preventDefault();

            const newName       = form.elements["recipeName"].value.trim();
            const newCourse     = form.elements["course"];
            const newCourseText = newCourse.options[newCourse.selectedIndex].text;
            const fileInput     = form.querySelector("input[type='file']");
            const formImg       = form.querySelector("img");
            const anchor        = realH3 ? realH3.id : "";

            allRows.forEach(function (row) {
                const link = row.querySelector("a[href='#" + anchor + "']");
                if (link) {
                    const cells = row.querySelectorAll("td");
                    if (cells[0]) cells[0].textContent = newName;
                    if (cells[1]) cells[1].textContent = newCourseText;

                    if (fileInput && fileInput.files && fileInput.files[0]) {
                        const reader = new FileReader();
                        reader.onload = function (ev) {
                            const thumb = cells[2] ? cells[2].querySelector("img") : null;
                            if (thumb) thumb.src = ev.target.result;
                            if (formImg) formImg.src = ev.target.result;
                        };
                        reader.readAsDataURL(fileInput.files[0]);
                    }
                }
            });

            if (realH3) realH3.textContent = "Edit: " + newName;

            if (editH2) editH2.style.display = "none";
            if (realH3) {
                realH3.style.display = "none";
                let next = realH3.nextElementSibling;
                while (next && next.tagName !== "H3") {
                    next.style.display = "none";
                    next = next.nextElementSibling;
                }
            }

            showToast('"' + newName + '" Updated Successfully!');
            window.scrollTo({ top: 0, behavior: "smooth" });
        });

        form.addEventListener("reset", function () {
            setTimeout(function () {
                if (editH2) editH2.style.display = "none";
                if (realH3) {
                    realH3.style.display = "none";
                    let next = realH3.nextElementSibling;
                    while (next && next.tagName !== "H3") {
                        next.style.display = "none";
                        next = next.nextElementSibling;
                    }
                }
                showToast("Changes cancelled. Values reverted to original.");
                window.scrollTo({ top: 0, behavior: "smooth" });
            }, 50);
        });
    });

    let deletePanelContainer = null;

    function showDynamicDeletePanel(targetRow, deleteAnchor) {
        hideDynamicDeletePanel();

        const cells      = targetRow.querySelectorAll("td");
        const recipeName = cells[0] ? cells[0].textContent.trim() : "";
        const courseType = cells[1] ? cells[1].textContent.trim() : "";

        const container = document.createElement("div");
        container.id = "dynamic-delete-panel";

        container.innerHTML = `
            <hr style="border:none; border-top:2px dashed #ffd6d6;
             margin:25px 0;">
             
            <h2 style="text-align:center;
             color:#b23a48; 
             margin-top:30px;">Delete Recipe</h2>

            <p style="text-align:center; 
            color:#6b4f4f;">Warning: Deleting a recipe is permanent and cannot be undone.</p>
            <table border="1" width="80%" style="margin:30px auto; 
            border-collapse:collapse; 
            background:white; 
            border-radius:20px; 
            overflow:hidden; 
            box-shadow:0 8px 20px rgba(0,0,0,0.08);">

                <tr>
                    <th style="background:linear-gradient(#ff8fab, #fb6f92);
                     color:white; padding:12px;">Recipe Name</th>
                    <th style="background:linear-gradient(#ff8fab, #fb6f92); 
                    color:white; padding:12px;">Course Type</th>
                    <th style="background:linear-gradient(#ff8fab, #fb6f92); 
                    color:white; padding:12px;">Confirm Delete</th>
                </tr>
                <tr>
                    <td style="padding:12px;">${recipeName}</td>
                    <td style="padding:12px;">${courseType}</td>
                    <td align="center" style="padding:12px;">
                        <button id="confirm-delete-btn" style="background:linear-gradient(#ff6b81, #e63946);
                         color:white; 
                         border:none; 
                         padding:8px 14px;
                          border-radius:20px; 
                          cursor:pointer;
                           margin:5px;">Yes, Delete</button>
                        <button id="cancel-delete-btn" style="background:linear-gradient(#ff6b81, #e63946);
                         color:white; 
                         border:none; 
                         padding:8px 14px; 
                         border-radius:20px; 
                         cursor:pointer; 
                         margin:5px;">Cancel</button>
                    </td>
                </tr>
            </table>
        `;

        document.body.appendChild(container);
        deletePanelContainer = container;

        container.scrollIntoView({ behavior: "smooth", block: "start" });

        document.getElementById("confirm-delete-btn").addEventListener("click", function () {
            targetRow.remove();
            hideDynamicDeletePanel();
            showToast('"' + recipeName + '" Deleted Successfully!');
            window.scrollTo({ top: 0, behavior: "smooth" });
        });

        document.getElementById("cancel-delete-btn").addEventListener("click", function () {
            hideDynamicDeletePanel();
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    function hideDynamicDeletePanel() {
        if (deletePanelContainer) {
            deletePanelContainer.remove();
            deletePanelContainer = null;
        }
    }

    function showToast(message) {
        const existing = document.getElementById("toast-msg");
        if (existing) existing.remove();

        const toast = document.createElement("div");
        toast.id = "toast-msg";
        toast.textContent = message;
        Object.assign(toast.style, {
            position:     "fixed",
            bottom:       "30px",
            left:         "50%",
            transform:    "translateX(-50%)",
            background:   "linear-gradient(#ff8fab, #fb6f92)",
            color:        "white",
            padding:      "14px 28px",
            borderRadius: "30px",
            fontFamily:   "'Poppins', sans-serif",
            fontWeight:   "600",
            fontSize:     "14px",
            boxShadow:    "0 6px 20px rgba(0,0,0,0.15)",
            zIndex:       "9999",
            opacity:      "1",
            transition:   "opacity 0.5s ease",
            whiteSpace:   "nowrap"
        });
        document.body.appendChild(toast);
        setTimeout(() => { toast.style.opacity = "0"; }, 2500);
        setTimeout(() => { toast.remove(); }, 3100);
    }

});
