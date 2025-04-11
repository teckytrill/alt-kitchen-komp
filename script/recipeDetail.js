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
  
  document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const recipeName = params.get('name');
    if (!recipeName) {
      console.error("No recipe name provided in the URL!");
      return;
    }
  
    fetch('data/recipes.json')
      .then(res => res.json())
      .then(data => {
        let allRecipes = [
          ...(data.savedRecipes || []),
          ...(data.recentlyViewedRecipes || []),
          ...(data.userRecipes || [])
        ];
  
        const storedLocal = localStorage.getItem('localUserRecipes');
        if (storedLocal) {
          try {
            const localList = JSON.parse(storedLocal);
            localList.forEach(r => allRecipes.push(r));
          } catch(e) {
            console.error("Error parsing local user recipes in detail page:", e);
          }
        }
  
        const matched = allRecipes.find(r => r.name === recipeName);
        if (!matched) {
          console.error("Recipe not found with name:", recipeName);
          return;
        }
  
        fillRecipeDetails(matched);
      })
      .catch(err => console.error("Error loading recipes.json:", err));
  });
  
  function fillRecipeDetails(recipe) {
    // Top Image & Basic Info 
    const imgEl = document.getElementById('recipeImage');
    imgEl.src = `images/${recipe.picture}`;
    imgEl.alt = recipe.name;
    
    document.getElementById('recipeName').textContent = recipe.name;
    document.getElementById('recipeTime').textContent = `${recipe.length}m`;
    document.getElementById('recipeFeeds').textContent = `Feeds ${recipe.feeds}`;
    document.getElementById('recipeDifficulty').textContent = recipe.difficulty || "Easy";
    
    // Tags
    const tagsContainer = document.getElementById('recipeTags');
    tagsContainer.innerHTML = '';
    (recipe.tags || []).forEach(tag => {
      const badge = document.createElement('span');
      badge.classList.add('tag-badge');
      const firstLetter = tag.charAt(0).toUpperCase();
      badge.style.backgroundColor = letterColorMap[firstLetter] || "#BB65A0";
      badge.textContent = firstLetter;
      badge.addEventListener('click', e => {
        e.stopPropagation();
        showTagMeaning(tag);
      });
      tagsContainer.appendChild(badge);
    });
    
    // Nutrition Facts
    const nutritionEl = document.getElementById('nutritionFacts');
    nutritionEl.innerHTML = '';
    if (recipe.nutrition) {
      const labelHTML = `
        <div class="label-title">Nutrition Facts</div>
        <div class="label-serving-size">Serving Size: ${recipe.nutrition.servingSize || '1 serving'}</div>
        <div class="label-line"></div>
        <div class="label-row">
          <span class="label-bold">Calories</span>
          <span>${recipe.nutrition.calories || 'N/A'}</span>
        </div>
        <div class="label-line"></div>
        <div class="label-row">
          <span class="label-bold">Total Fat</span>
          <span>${recipe.nutrition.fat || 'N/A'}</span>
        </div>
        <div class="label-row">
          <span class="label-bold">Carbohydrates</span>
          <span>${recipe.nutrition.carbs || 'N/A'}</span>
        </div>
        <div class="label-row">
          <span class="label-bold">Protein</span>
          <span>${recipe.nutrition.protein || 'N/A'}</span>
        </div>
        <div class="label-row">
          <span class="label-bold">Sodium</span>
          <span>${recipe.nutrition.sodium || 'N/A'}</span>
        </div>
        <div class="label-row">
          <span class="label-bold">Fiber</span>
          <span>${recipe.nutrition.fiber || 'N/A'}</span>
        </div>
        <div class="label-row">
          <span class="label-bold">Sugars</span>
          <span>${recipe.nutrition.sugars || 'N/A'}</span>
        </div>
      `;
      nutritionEl.innerHTML = labelHTML;
    } else {
      nutritionEl.innerHTML = '<p>No nutrition data available</p>';
    }
    
    //  Ingredients 
    const ingContainer = document.getElementById('ingredientsList');
    ingContainer.innerHTML = '';
    (recipe.ingredients || []).forEach(itemObj => {
      const row = document.createElement('div');
      row.classList.add('ingredient-item');
      
      const check = document.createElement('input');
      check.type = 'checkbox';
      
      const nameSpan = document.createElement('span');
      nameSpan.classList.add('ingredient-name');
      nameSpan.textContent = itemObj.item.name;
      
      const quantitySpan = document.createElement('span');
      quantitySpan.classList.add('ingredient-quantity');
      quantitySpan.textContent = itemObj.quantity;
      if (itemObj.item.details) {
        quantitySpan.textContent += ` (${itemObj.item.details})`;
      }
      
      row.appendChild(check);
      row.appendChild(nameSpan);
      row.appendChild(quantitySpan);
      ingContainer.appendChild(row);
    });
    
    //  Instructions 
    const stepsContainer = document.getElementById('instructionsList');
    stepsContainer.innerHTML = '';
    (recipe.steps || []).forEach((step, i) => {
      const stepDiv = document.createElement('div');
      stepDiv.classList.add('instruction-step');
      stepDiv.textContent = `${i + 1}. ${step}`;
      stepsContainer.appendChild(stepDiv);
    });
    
    //  Notes Section 
    window.currentRecipeName = recipe.name;
    
    renderRecipeNotes(recipe.name);
  }
  
  function showTagMeaning(tag) {
    const overlay = document.getElementById('tagPopupOverlay');
    const titleEl = document.getElementById('popupTagTitle');
    const descEl = document.getElementById('popupTagDescription');
  
    titleEl.textContent = `Tag: ${tag}`;
  
    overlay.style.display = 'flex';
  }
  function closeTagPopup() {
    document.getElementById('tagPopupOverlay').style.display = 'none';
  }
  
  // Back button
  function goBack() {
    window.history.back();
  }

  let currentRating = 0;

function showRatingModal() {
  document.getElementById('ratingModal').style.display = 'flex';
  currentRating = 0;
  updateStars(0);
}

function closeRatingModal() {
  document.getElementById('ratingModal').style.display = 'none';
}

function updateStars(rating) {
  const stars = document.querySelectorAll('#starRating .star');
  stars.forEach(star => {
    const starValue = parseInt(star.getAttribute('data-value'), 10);
    if (starValue <= rating) {
      star.classList.add('selected');
      star.textContent = '★'; 
    } else {
      star.classList.remove('selected');
      star.textContent = '☆'; 
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const stars = document.querySelectorAll('#starRating .star');
  stars.forEach(star => {
    star.addEventListener('click', () => {
      currentRating = parseInt(star.getAttribute('data-value'), 10);
      updateStars(currentRating);
    });
  });
});

function submitRating() {
  document.getElementById('currentRatingDisplay').textContent = `Your rating: ${currentRating} out of 5`;
  closeRatingModal();
}

function getRecipeNotes(recipeName) {
  const storedNotes = localStorage.getItem('recipeNotes');
  let notesObj = storedNotes ? JSON.parse(storedNotes) : {};
  return notesObj[recipeName] || [];
}

function saveRecipeNotes(recipeName, notesArray) {
  const storedNotes = localStorage.getItem('recipeNotes');
  let notesObj = storedNotes ? JSON.parse(storedNotes) : {};
  notesObj[recipeName] = notesArray;
  localStorage.setItem('recipeNotes', JSON.stringify(notesObj));
}

function showAddNoteModal() {
  document.getElementById('addNoteOverlay').style.display = 'flex';
}

function closeAddNoteModal() {
  document.getElementById('addNoteOverlay').style.display = 'none';
  document.getElementById('newNoteText').value = '';
}

function renderRecipeNotes(recipeName) {
  const container = document.getElementById('notesContainer');
  container.innerHTML = '';
  const notes = getRecipeNotes(recipeName);
  if (notes.length === 0) {
    container.innerHTML = '<p>No notes added yet.</p>';
    return;
  }
  notes.forEach((note, index) => {
    const noteCard = document.createElement('div');
    noteCard.classList.add('note-card');
    noteCard.textContent = note;
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = "X";
    deleteBtn.style.marginLeft = "auto";
    deleteBtn.style.backgroundColor = "transparent";
    deleteBtn.style.border = "none";
    deleteBtn.style.cursor = "pointer";
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteRecipeNote(recipeName, index);
    });
    noteCard.appendChild(deleteBtn);

    container.appendChild(noteCard);
  });
}

function deleteRecipeNote(recipeName, noteIndex) {
  let notes = getRecipeNotes(recipeName);
  notes.splice(noteIndex, 1);
  saveRecipeNotes(recipeName, notes);
  renderRecipeNotes(recipeName);
}

function submitNote() {
  if (!window.currentRecipeName) {
    console.error("No current recipe available to save note for.");
    return;
  }
  const newNote = document.getElementById('newNoteText').value.trim();
  if (!newNote) {
    alert("Please enter some text for your note.");
    return;
  }
  let notes = getRecipeNotes(window.currentRecipeName);
  notes.push(newNote);
  saveRecipeNotes(window.currentRecipeName, notes);
  renderRecipeNotes(window.currentRecipeName);
  closeAddNoteModal();
}


  