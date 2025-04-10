/***************************************************
 * Global color mapping for tag badges by letter
 ***************************************************/
const letterColorMap = {
    A: "#1abc9c",
    B: "#2ecc71",
    C: "#3498db",
    D: "#9b59b6",
    E: "#34495e",
    F: "#16a085",
    G: "#27ae60",
    H: "#2980b9",
    I: "#8e44ad",
    J: "#2c3e50",
    K: "#f1c40f",
    L: "#e67e22",
    M: "#e74c3c",
    N: "#95a5a6",
    O: "#f39c12",
    P: "#d35400",
    Q: "#c0392b",
    R: "#bdc3c7",
    S: "#7f8c8d",
    T: "#ffa07a",
    U: "#ff6347",
    V: "#ff69b4",
    W: "#da70d6",
    X: "#db7093",
    Y: "#9370db",
    Z: "#8fbc8f"
  };
  
  /***************************************************
   * On page load, fetch the JSON and render 
   * "Saved Recipes" + "Recently Viewed"
   ***************************************************/

/*
document.addEventListener('DOMContentLoaded', () => {
  // 1) Load recipes.json first
  fetch('recipes.json')
    .then(res => res.json())
    .then(data => {
      // Save the entire JSON object in allData
      allData = data;

      // Now you can call any functions that depend on `allData`:
      loadRecipesData();       // e.g., renderSavedRecipes, renderRecentlyViewed, renderMyRecipes
    })
    .catch(err => console.error('Error loading recipes.json:', err));

  // 2) Independently load your recipeCollections.json
  loadRecipeCollections();  
});
  
function loadRecipesData() {
  // Example usage:
  renderSavedRecipes(allData.savedRecipes);
  renderRecentlyViewed(allData.recentlyViewedRecipes);
  renderMyRecipes(allData.userRecipes); 
}

  function loadRecipeCollections() {
    fetch('recipeCollections.json')
      .then(res => res.json())
      .then(data => {
        const collections = data.collections || [];
        renderBrowseCollections(collections);
      })
      .catch(err => console.error("Error loading recipeCollections.json:", err));
  }*/

  let allData = {};

  document.addEventListener('DOMContentLoaded', () => {
    fetch('data/recipes.json')
      .then(res => res.json())
      .then(data => {
        allData = data;
  
        // 1) Load local user recipes
        const storedLocalUser = localStorage.getItem('localUserRecipes');
        if (storedLocalUser) {
          try {
            allData.userRecipes = JSON.parse(storedLocalUser);
          } catch(e) {
            console.error("Error parsing local user recipes from storage:", e);
            allData.userRecipes = []; // fallback to empty if something's wrong
          }
        }
  
        loadRecipesData(); // Render everything
        loadRecipeCollections();
      })
      .catch(err => console.error("Error loading recipes.json:", err));
  });



  function loadRecipesData() {
    // Example usage:  
    if (allData.savedRecipes) {
      renderSavedRecipes(allData.savedRecipes);
    }
    if (allData.recentlyViewedRecipes) {
      renderRecentlyViewed(allData.recentlyViewedRecipes);
    }
    if (allData.userRecipes) {
      renderMyRecipes(allData.userRecipes);
    }
    // ... any other data you want to render
  }

  function loadRecipeCollections() {
    // If you store them inside allData, you can skip fetching:
    // e.g. renderBrowseCollections(allData.collections);
  
    // Or if you are fetching recipeCollections.json, do:
    fetch('data/recipeCollection.json')
      .then(res => res.json())
      .then(collectionData => {
        const collections = collectionData.collections || [];
        renderBrowseCollections(collections);
      })
      .catch(err => console.error("Error loading recipeCollections.json:", err));
  }
  /***************************************************
   * Rendering the "Saved Recipes" section
   ***************************************************/
  function renderSavedRecipes(recipes) {
    const container = document.querySelector('.saved-recipes-container');
    container.innerHTML = '';
  
    recipes.forEach((recipe, index) => {
      const card = createRecipeCard(recipe, index, /*offset*/ 0);
      container.appendChild(card);
    });
  }
  
  /***************************************************
   * Rendering the "Recently Viewed" section
   ***************************************************/
  function renderRecentlyViewed(recipes) {
    const container = document.querySelector('.recently-viewed-container');
    container.innerHTML = '';
  
    // We offset the index by the length of savedRecipes, so we don't collide.
    // Another approach is to combine them in a single array in the detail page, 
    // but let's offset to keep it unique.
    const savedCount = document.querySelector('.saved-recipes-container').children.length;
  
    recipes.forEach((recipe, i) => {
      const realIndex = savedCount + i; // offset
      const card = createRecipeCard(recipe, realIndex);
      container.appendChild(card);
    });
  }


  function renderBrowseCollections(collections) {
    const container = document.getElementById('browseCollectionsContainer');
    container.innerHTML = '';
  
    collections.forEach(collection => {
      // Create a "collection card" or "tab"
      const div = document.createElement('div');
      div.classList.add('recipe-tab'); // reuse your .recipe-tab styling
      div.textContent = collection.title;
  
      // Clicking => go to a new page, e.g. collectionDetail.html?collection=Recipes+for+Griffin
      div.onclick = () => {
        openCollectionDetail(collection.title);
      };
  
      container.appendChild(div);
    });
  }
  
  function openCollectionDetail(collectionTitle) {
    // e.g. go to "collectionDetail.html?collection=Recipes%20for%20Griffin"
    window.location.href = `collectionDetail.html?collection=${encodeURIComponent(collectionTitle)}`;
  }
  
  /***************************************************
   * Create a single recipe card element
   ***************************************************/
  function createRecipeCard(recipe) {
    const card = document.createElement('div');
    card.classList.add('recipe-card');
    card.onclick = () => openRecipeByName(recipe.name);
  
    // Image
    const img = document.createElement('img');
    img.classList.add('recipe-image');
    img.src = `icons/${recipe.picture}`;
    img.alt = recipe.name;
    card.appendChild(img);
  
    // Info container
    const infoDiv = document.createElement('div');
    infoDiv.classList.add('recipe-info');
  
    // Name
    const nameEl = document.createElement('h3');
    nameEl.textContent = recipe.name;
    infoDiv.appendChild(nameEl);
  
    // Details row
    const detailsDiv = document.createElement('div');
    detailsDiv.classList.add('recipe-details');
  
    const timeSpan = document.createElement('span');
    timeSpan.textContent = `${recipe.length}m`;
  
    const feedsSpan = document.createElement('span');
    feedsSpan.textContent = `Feeds ${recipe.feeds}`;
  
    detailsDiv.appendChild(timeSpan);
    detailsDiv.appendChild(feedsSpan);
    infoDiv.appendChild(detailsDiv);
  
    // Tags
    const tagsContainer = document.createElement('div');
    tagsContainer.classList.add('tags-container');
    (recipe.tags || []).forEach(tag => {
      const badge = document.createElement('span');
      badge.classList.add('tag-badge');
      const firstLetter = tag.charAt(0).toUpperCase();
      badge.style.backgroundColor = letterColorMap[firstLetter] || "#BB65A0";
      badge.textContent = firstLetter;
  
      // Clicking a tag might do something else or a small popup
      badge.addEventListener('click', event => {
        event.stopPropagation();
        showTagMeaning(tag);  // custom popup overlay
      });
  
      tagsContainer.appendChild(badge);
    });
    infoDiv.appendChild(tagsContainer);
  
    card.appendChild(infoDiv);
    return card;
  }
  
  /***************************************************
   * When user clicks a recipe card
   * We'll navigate to the detail page with ?id={index}
   ***************************************************/
  function openRecipeByName(recipeName) {
    window.location.href = `recipeDetail.html?name=${encodeURIComponent(recipeName)}`;
  }
  
  /***************************************************
   * Placeholders for search, tabClicked, gotoPage
   ***************************************************/
  function handleSearch() {
    const query = document.getElementById('searchBar').value;
    console.log("Search for:", query);
    // Implement filtering or navigation
  }
  
  function tabClicked(tabName) {
    console.log("Tab clicked:", tabName);
    // Navigate or filter
  }
  
  function gotoPage(pageName) {
    console.log("Goto page:", pageName);
    // Page navigation logic
  }

  /***************************************************
 * Tag Popup Functions
 ***************************************************/
function showTagMeaning(tag) {
    const overlay = document.getElementById('tagPopupOverlay');
    const titleEl = document.getElementById('popupTagTitle');
    const descEl  = document.getElementById('popupTagDescription');
  
    titleEl.textContent = `Tag: ${tag}`;
    
    overlay.style.display = 'flex';
  }
  
  function closeTagPopup() {
    const overlay = document.getElementById('tagPopupOverlay');
    overlay.style.display = 'none';
  }

  function showAddRecipeForm() {
    const overlay = document.getElementById('addRecipeOverlay');
    overlay.style.display = 'flex';
  }

  function addIngredientRow() {
    const container = document.getElementById('ingredientsContainer');
    const row = document.createElement('div');
    row.classList.add('ingredient-row');
    row.innerHTML = `
      <input type="text" placeholder="Ingredient Name" class="ing-name" required />
      <input type="text" placeholder="Quantity" class="ing-qty" required />
      <input type="text" placeholder="Unit or Details" class="ing-unit" />
    `;
    container.appendChild(row);
  }
  
  function addInstructionRow() {
    const container = document.getElementById('instructionsContainer');
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Instruction step';
    input.classList.add('instruction-step-input');
    container.appendChild(input);
  }

  function handleAddRecipeSubmit(event) {
    event.preventDefault();
    const form = event.target;
  
    // 1) Collect all fields
    const recipeName = form.recipeName.value.trim();
    const length = parseInt(form.length.value, 10) || 0;
    const feeds = parseInt(form.feeds.value, 10) || 1;
    const difficulty = form.difficulty.value;
    
    const ingredientRows = document.querySelectorAll('#ingredientsContainer .ingredient-row');
    const ingredients = Array.from(ingredientRows).map(row => {
    const name = row.querySelector('.ing-name').value.trim();
    const quantity = row.querySelector('.ing-qty').value.trim();
    const details = row.querySelector('.ing-unit').value.trim();

      return {
        quantity: quantity,
        item: {
          name: name,
          details: details
        }
      };
    });

    // Get instructions from inputs
    const instructionInputs = document.querySelectorAll('.instruction-step-input');
    const steps = Array.from(instructionInputs)
      .map(input => input.value.trim())
      .filter(step => step.length > 0);
  
    const tags = [];
    if (form.tag1.value.trim()) tags.push(form.tag1.value.trim());
    if (form.tag2.value.trim()) tags.push(form.tag2.value.trim());
    if (form.tag3.value.trim()) tags.push(form.tag3.value.trim());
  
    // Nutrition
    const servingSize = form.servingSize.value.trim();
    const calories = parseInt(form.calories.value, 10) || 0;
    
    const fat = form.fatValue.value 
      ? form.fatValue.value + form.fatUnit.value 
      : "";
    const carbs = form.carbsValue.value 
      ? form.carbsValue.value + form.carbsUnit.value 
      : "";
    const protein = form.proteinValue.value 
      ? form.proteinValue.value + form.proteinUnit.value 
      : "";
    const sodium = form.sodiumValue.value 
      ? form.sodiumValue.value + form.sodiumUnit.value 
      : "";
    const fiber = form.fiberValue.value 
      ? form.fiberValue.value + form.fiberUnit.value 
      : "";
    const sugars = form.sugarsValue.value 
      ? form.sugarsValue.value + form.sugarsUnit.value 
      : "";
  
    // 2) Build new recipe object
    const newRecipe = {
      name: recipeName,
      length: length,
      difficulty: difficulty,
      feeds: feeds,
      ingredients: ingredients,
      steps: steps,
      tags: tags,
      nutrition: {
        servingSize: servingSize || "",
        calories: calories,
        fat: fat,
        carbs: carbs,
        protein: protein,
        sodium: sodium,
        fiber: fiber,
        sugars: sugars
      }
    };
  
    // 3) Insert into allData.userRecipes
    if (!allData.userRecipes) {
      allData.userRecipes = [];
    }
    allData.userRecipes.push(newRecipe);
  
    // 4) Re-render
    renderMyRecipes(allData.userRecipes);
  
    // 5) Store the updated userRecipes in localStorage
    localStorage.setItem('localUserRecipes', JSON.stringify(allData.userRecipes));
  
    // 6) Reset form & close overlay
    form.reset();
    closeAddRecipeForm();
  }
  
  
/**********************************************
 * Example "renderMyRecipes" function
 **********************************************/
function renderMyRecipes(recipes) {
  const container = document.querySelector('.my-recipes-container');
  if (!container) return; // safeguard

  container.innerHTML = '';
  recipes.forEach(recipe => {
    // Use your existing createRecipeCard or create a custom narrow card
    const card = createRecipeCard(recipe);
    container.appendChild(card);
  });
}
  
  /*******************************************************
   * Example function to close the overlay
   *******************************************************/
  function closeAddRecipeForm() {
    const overlay = document.getElementById('addRecipeOverlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
  }

  /*******************************************
 * handleSearch(): Triggered by the 🔍 button
 *******************************************/
function handleSearch() {
  const query = document.getElementById('searchBar').value.trim().toLowerCase();
  if (!query) {
    return; // ignore empty search
  }

  // 1) Fetch recipes.json (or use in-memory allData if you already have it)
  fetch('data/recipes.json')
    .then(res => res.json())
    .then(data => {
      // Combine all relevant arrays
      const allRecipes = [
        ...(data.savedRecipes || []),
        ...(data.recentlyViewedRecipes || []),
        ...(data.userRecipes || [])
      ];

      // 2) Filter by partial match in name OR in tags
      const results = allRecipes.filter(recipe => {
        const nameMatch = recipe.name.toLowerCase().includes(query);
        // tags might be array of strings
        const tagMatch = (recipe.tags || []).some(tag => 
          tag.toLowerCase().includes(query)
        );
        return nameMatch || tagMatch;
      });

      // 3) Show the results in the narrow format
      displaySearchResults(results);

      // 4) Hide the main sections, show the search results container
      document.querySelector('main').style.display = 'none';
      document.getElementById('searchResultsSection').style.display = 'block';
    })
    .catch(err => console.error('Error searching recipes:', err));
}

/*******************************************
 * displaySearchResults(results):
 * Renders the narrower card layout
 *******************************************/
function displaySearchResults(recipes) {
  const container = document.getElementById('searchResultsContainer');
  container.innerHTML = ''; // clear old results

  recipes.forEach(recipe => {
    const card = createNarrowRecipeCard(recipe);
    container.appendChild(card);
  });
}

/*******************************************
 * createNarrowRecipeCard(recipe):
 * Similar to the collection layout
 *******************************************/
function createNarrowRecipeCard(recipe) {
  const card = document.createElement('div');
  card.classList.add('narrow-recipe-card');
  card.onclick = () => openRecipeByName(recipe.name);

  // image
  const img = document.createElement('img');
  img.classList.add('narrow-recipe-image');
  img.src = `images/${recipe.picture}`;
  img.alt = recipe.name;

  // info
  const infoDiv = document.createElement('div');
  infoDiv.classList.add('narrow-recipe-info');

  // title
  const titleEl = document.createElement('h3');
  titleEl.textContent = recipe.name;

  // details
  const detailsEl = document.createElement('div');
  detailsEl.classList.add('narrow-recipe-details');
  // e.g. "20m • Feeds 2 • Easy"
  detailsEl.textContent = `${recipe.length}m • Feeds ${recipe.feeds} • ${recipe.difficulty}`;

  // tags
  const tagsContainer = document.createElement('div');
  tagsContainer.classList.add('tags-container');

  (recipe.tags || []).forEach(tag => {
    const badge = document.createElement('span');
    badge.classList.add('tag-badge');
    const firstLetter = tag.charAt(0).toUpperCase();
    badge.style.backgroundColor = letterColorMap[firstLetter] || "#BB65A0";
    badge.textContent = firstLetter;
    // If you want a popup for tags, do e.g.:
    // badge.addEventListener('click', e => { e.stopPropagation(); showTagMeaning(tag); });
    tagsContainer.appendChild(badge);
  });

  infoDiv.appendChild(titleEl);
  infoDiv.appendChild(detailsEl);
  infoDiv.appendChild(tagsContainer);

  card.appendChild(img);
  card.appendChild(infoDiv);

  return card;
}

/*******************************************
 * clearSearch():
 * Called by the "Close" button in results
 * -> Hides search results, shows main
 *******************************************/
function clearSearch() {
  // Hide search results container
  document.getElementById('searchResultsSection').style.display = 'none';
  // Show the main content
  document.querySelector('main').style.display = 'block';
}


  