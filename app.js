const RecipeApp = (function () {

  // PRIVATE DATA
  const recipes = [
    {
      name: "Pasta Alfredo",
      difficulty: "Easy",
      time: 20,
      ingredients: ["Pasta", "Cream", "Garlic", "Cheese"],
      steps: [
        "Boil pasta",
        {
          title: "Prepare Sauce",
          substeps: [
            "Heat pan",
            "Add garlic",
            "Add cream",
            "Add cheese"
          ]
        },
        "Mix pasta with sauce"
      ]
    },
    {
      name: "Chicken Biryani",
      difficulty: "Hard",
      time: 60,
      ingredients: ["Rice", "Chicken", "Spices", "Onion"],
      steps: [
        "Marinate chicken",
        {
          title: "Cook Rice",
          substeps: [
            "Boil water",
            "Add rice",
            "Cook 70%"
          ]
        },
        {
          title: "Layering",
          substeps: [
            "Add rice layer",
            "Add chicken layer",
            {
              title: "Final Steam",
              substeps: [
                "Cover tightly",
                "Cook 15 minutes"
              ]
            }
          ]
        }
      ]
    },
    {
      name: "Omelette",
      difficulty: "Easy",
      time: 5,
      ingredients: ["Eggs", "Salt", "Pepper"],
      steps: ["Beat eggs", "Heat pan", "Cook eggs"]
    }
  ];

  let currentFilter = "all";
  let currentSort = null;

  const container = document.getElementById("recipes-container");

  // PURE FILTER
  function applyFilter(data, type) {
    switch (type) {
      case "easy":
        return data.filter(r => r.difficulty === "Easy");
      case "medium":
        return data.filter(r => r.difficulty === "Medium");
      case "hard":
        return data.filter(r => r.difficulty === "Hard");
      case "quick":
        return data.filter(r => r.time < 30);
      default:
        return data;
    }
  }

  // PURE SORT
  function applySort(data, type) {
    if (!type) return data;
    const copy = [...data];

    if (type === "name") {
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (type === "time") {
      return copy.sort((a, b) => a.time - b.time);
    }

    return copy;
  }

  // RECURSIVE STEP RENDER
  function renderSteps(steps) {
    return `
      <ul>
        ${steps.map(step => {
          if (typeof step === "string") {
            return `<li>${step}</li>`;
          } else {
            return `
              <li>
                ${step.title}
                ${renderSteps(step.substeps)}
              </li>
            `;
          }
        }).join("")}
      </ul>
    `;
  }

  function renderRecipes(data) {
    container.innerHTML = data.map((recipe, index) => `
      <div class="recipe-card">
        <h3>${recipe.name}</h3>
        <p><strong>Difficulty:</strong> ${recipe.difficulty}</p>
        <p><strong>Time:</strong> ${recipe.time} mins</p>

        <button data-action="toggle-ingredients" data-index="${index}">
          Show Ingredients
        </button>

        <button data-action="toggle-steps" data-index="${index}">
          Show Steps
        </button>

        <div class="ingredients hidden" id="ingredients-${index}">
          <ul>
            ${recipe.ingredients.map(i => `<li>${i}</li>`).join("")}
          </ul>
        </div>

        <div class="steps hidden" id="steps-${index}">
          ${renderSteps(recipe.steps)}
        </div>
      </div>
    `).join("");
  }

  function updateDisplay() {
    const filtered = applyFilter(recipes, currentFilter);
    const sorted = applySort(filtered, currentSort);
    renderRecipes(sorted);
  }

  // EVENT DELEGATION
  function handleClick(e) {
    const filter = e.target.dataset.filter;
    const sort = e.target.dataset.sort;
    const action = e.target.dataset.action;
    const index = e.target.dataset.index;

    if (filter) {
      currentFilter = filter;
      updateDisplay();
    }

    if (sort) {
      currentSort = sort;
      updateDisplay();
    }

    if (action === "toggle-ingredients") {
      document
        .getElementById(`ingredients-${index}`)
        .classList.toggle("hidden");
    }

    if (action === "toggle-steps") {
      document
        .getElementById(`steps-${index}`)
        .classList.toggle("hidden");
    }
  }

  function init() {
    document.body.addEventListener("click", handleClick);
    updateDisplay();
  }

  return { init };

})();

RecipeApp.init();
