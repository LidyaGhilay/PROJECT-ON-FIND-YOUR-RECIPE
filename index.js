
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const searchResultDiv = document.querySelector(".search-result");
const container = document.querySelector(".container");

const appId = "c38ea6d4";
const appKey = "8b23ec8c3435a23bcce1b9f9cb058c14";

let searchQuery = "";

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  searchQuery = searchInput.value.trim();
  if (searchQuery === "") {
    displayMessage("Please enter a valid recipe name");
  } else {
    fetchAPI(searchQuery);
  }
});

searchInput.addEventListener("input", () => {
  if (searchInput.value.trim() === "") {
    clearResults();
  }
});

async function fetchAPI(searchQuery) {
  // Fetch recipes from the API
  const baseurl = `https://api.edamam.com/search?q=${searchQuery}&app_id=${appId}&app_key=${appKey}`;
  const response = await fetch(baseurl);
  const data = await response.json();
  if (data.count === 0) {
    // Display message if no recipes found
    displayMessage("No recipes found. Please try another search term.");
  } else {
    // show HTML for each recipe
    displayHTML(data.hits);
  }
}

function displayHTML(outcome) {
  let generatedHTML = "";
  // Loop through each recipe
  outcome.forEach(find => {
    // Generate HTML for each recipe
    generatedHTML +=
    `
    <div class="item">
      <img src="${find.recipe.image}" alt="">
      <div class="flex-container">
        <h1 class="title">${find.recipe.label}</h1>
        <button class="view-button">View Recipe</button>
      </div>
      <div class="ingredients" style="display:none;">
        <h3>Ingredients:</h3>
        <ul>
          ${find.recipe.ingredientLines.map(ingredient => `<li>${ingredient}</li>`).join('')}
        </ul>
      </div>
      <p class="item-data">Calories: ${find.recipe.calories.toFixed(2)}</p>
    </div>
    `;
  });
  // Display the generated HTML in the search result div
  searchResultDiv.innerHTML = generatedHTML;

  // Add event listeners to toggle visibility of ingredients
  document.querySelectorAll(".view-button").forEach((button, index) => {
    button.addEventListener("click", () => {
      const ingredientsDiv = document.querySelectorAll(".ingredients")[index];
      ingredientsDiv.style.display = ingredientsDiv.style.display === "none" ? "block" : "none";
    });
  });
}

function clearResults() {
  // Clear search results
  searchResultDiv.innerHTML = "";
}

function displayMessage(message) {
  // Display a message in the search result div
  searchResultDiv.innerHTML = `<p class="message">${message}</p>`;
}
