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

  let allData = {};

  document.addEventListener('DOMContentLoaded', () => {
    fetch('data/recipes.json')
      .then(res => res.json())
      .then(data => {
        allData = data;

        const storedLocalUser = localStorage.getItem('localUserRecipes');
        if (storedLocalUser) {
          try {
            allData.userRecipes = JSON.parse(storedLocalUser);
          } catch(e) {
            console.error("Error parsing local user recipes from storage:", e);
            allData.userRecipes = []; 
          }
        }
  
        loadRecipesData(); 
        loadRecipeCollections();
      })
      .catch(err => console.error("Error loading recipes.json:", err));
  });



  function loadRecipesData() { 
    if (allData.savedRecipes) {
      renderSavedRecipes(allData.savedRecipes);
    }
    if (allData.recentlyViewedRecipes) {
      renderRecentlyViewed(allData.recentlyViewedRecipes);
    }
    if (allData.userRecipes) {
      renderMyRecipes(allData.userRecipes);
    }
  }

  function loadRecipeCollections() {
    fetch('data/recipeCollection.json')
      .then(res => res.json())
      .then(collectionData => {
        const collections = collectionData.collections || [];
        renderBrowseCollections(collections);
      })
      .catch(err => console.error("Error loading recipeCollections.json:", err));
  }

  function renderSavedRecipes(recipes) {
    const container = document.querySelector('.saved-recipes-container');
    container.innerHTML = '';
  
    recipes.forEach((recipe, index) => {
      const card = createRecipeCard(recipe, index,  0);
      container.appendChild(card);
    });
  }
  
  function renderRecentlyViewed(recipes) {
    const container = document.querySelector('.recently-viewed-container');
    container.innerHTML = '';
  
    const savedCount = document.querySelector('.saved-recipes-container').children.length;
  
    recipes.forEach((recipe, i) => {
      const realIndex = savedCount + i; 
      const card = createRecipeCard(recipe, realIndex);
      container.appendChild(card);
    });
  }


  function renderBrowseCollections(collections) {
    const container = document.getElementById('browseCollectionsContainer');
    container.innerHTML = '';
  
    collections.forEach(collection => {
      const div = document.createElement('div');
      div.classList.add('recipe-tab'); 
      div.textContent = collection.title;
  
      div.onclick = () => {
        openCollectionDetail(collection.title);
      };
  
      container.appendChild(div);
    });
  }
  
  function openCollectionDetail(collectionTitle) {
    window.location.href = `collectionDetail.html?collection=${encodeURIComponent(collectionTitle)}`;
  }
  
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
  
      badge.addEventListener('click', event => {
        event.stopPropagation();
        showTagMeaning(tag); 
      });
  
      tagsContainer.appendChild(badge);
    });
    infoDiv.appendChild(tagsContainer);
  
    card.appendChild(infoDiv);
    return card;
  }
  
  function openRecipeByName(recipeName) {
    window.location.href = `recipeDetail.html?name=${encodeURIComponent(recipeName)}`;
  }
  
  function handleSearch() {
    const query = document.getElementById('searchBar').value;
    console.log("Search for:", query);
  }
  
  function tabClicked(tabName) {
    console.log("Tab clicked:", tabName);
  }
  
  function gotoPage(pageName) {
    console.log("Goto page:", pageName);
  }

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
  
    if (!allData.userRecipes) {
      allData.userRecipes = [];
    }
    allData.userRecipes.push(newRecipe);
  
    renderMyRecipes(allData.userRecipes);
  
    localStorage.setItem('localUserRecipes', JSON.stringify(allData.userRecipes));
  
    form.reset();
    closeAddRecipeForm();
  }
  
function renderMyRecipes(recipes) {
  const container = document.querySelector('.my-recipes-container');
  if (!container) return;

  container.innerHTML = '';
  recipes.forEach(recipe => {
    const card = createRecipeCard(recipe);
    container.appendChild(card);
  });
}
  
  function closeAddRecipeForm() {
    const overlay = document.getElementById('addRecipeOverlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
  }

function handleSearch() {
  const query = document.getElementById('searchBar').value.trim().toLowerCase();
  if (!query) {
    return; 
  }

  fetch('data/recipes.json')
    .then(res => res.json())
    .then(data => {
      const allRecipes = [
        ...(data.savedRecipes || []),
        ...(data.recentlyViewedRecipes || []),
        ...(data.userRecipes || [])
      ];

      const results = allRecipes.filter(recipe => {
        const nameMatch = recipe.name.toLowerCase().includes(query);
        const tagMatch = (recipe.tags || []).some(tag => 
          tag.toLowerCase().includes(query)
        );
        return nameMatch || tagMatch;
      });

      displaySearchResults(results);

      document.querySelector('main').style.display = 'none';
      document.getElementById('searchResultsSection').style.display = 'block';
    })
    .catch(err => console.error('Error searching recipes:', err));
}

function displaySearchResults(recipes) {
  const container = document.getElementById('searchResultsContainer');
  container.innerHTML = ''; 

  recipes.forEach(recipe => {
    const card = createNarrowRecipeCard(recipe);
    container.appendChild(card);
  });
}

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

    tagsContainer.appendChild(badge);
  });

  infoDiv.appendChild(titleEl);
  infoDiv.appendChild(detailsEl);
  infoDiv.appendChild(tagsContainer);

  card.appendChild(img);
  card.appendChild(infoDiv);

  return card;
}


function clearSearch() {
  document.getElementById('searchResultsSection').style.display = 'none';
  document.querySelector('main').style.display = 'block';
}

function showFilterPopup() {
  document.getElementById('filterOverlay').style.display = 'flex';
}

function closeFilterOverlay() {
  document.getElementById('filterOverlay').style.display = 'none';
}

function applyFilters() {
  const servingSize = parseInt(document.getElementById('filterServingSize').value, 10);
  const diffs = Array.from(document.getElementsByName('filterDifficulty'))
    .filter(cb => cb.checked)
    .map(cb => cb.value);

  const tag1 = document.getElementById('filterTag1').value;
  const tag2 = document.getElementById('filterTag2').value;
  const tag3 = document.getElementById('filterTag3').value;
  const chosenTags = [tag1, tag2, tag3].filter(t => t !== "");

  let usePantry = "no";
  const pantryRadios = document.getElementsByName('usePantry');
  for (let r of pantryRadios) {
    if (r.checked) {
      usePantry = r.value;
      break;
    }
  }

  const allRecipes = [
    ...(allData.savedRecipes || []),
    ...(allData.recentlyViewedRecipes || []),
    ...(allData.userRecipes || [])
  ];


  let userPantry = [];
  const filtered = allRecipes.filter(r => {
    if (r.feeds > servingSize) return false;
    if (diffs.length > 0 && !diffs.includes(r.difficulty)) {
      return false;
    }

    if (chosenTags.length > 0) {
      for (let t of chosenTags) {
        if (!r.tags || !r.tags.includes(t)) {
          return false;
        }
      }
    }

    if (usePantry === "yes") {
      for (let ing of (r.ingredients || [])) {
        const ingName = ing.item.name.toLowerCase().trim();
        if (!userPantry.includes(ingName)) {
          return false;
        }
      }
    }
    return true; 
  });

  displaySearchResults(filtered);

  document.querySelector('main').style.display = 'none';
  document.getElementById('searchResultsSection').style.display = 'block';

  closeFilterOverlay();
}



  