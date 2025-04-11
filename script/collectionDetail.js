const letterColorMap = {
  A: "#1abc9c",  B: "#2ecc71",  C: "#3498db",  D: "#9b59b6",
  E: "#34495e",  F: "#16a085",  G: "#27ae60",  H: "#2980b9",
  I: "#8e44ad",  J: "#2c3e50",  K: "#f1c40f",  L: "#e67e22",
  M: "#e74c3c",  N: "#95a5a6",  O: "#f39c12",  P: "#d35400",
  Q: "#c0392b",  R: "#bdc3c7",  S: "#7f8c8d",  T: "#ffa07a",
  U: "#ff6347",  V: "#ff69b4",  W: "#da70d6",  X: "#db7093",
  Y: "#9370db",  Z: "#8fbc8f"
};

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const collectionTitle = params.get('collection') || "";

  if (!collectionTitle) {
    console.error("No collection specified!");
    return;
  }

  document.getElementById('collectionTitle').textContent = collectionTitle;

  Promise.all([
    fetch('data/recipeCollection.json').then(r => r.json()),
    fetch('data/recipes.json').then(r => r.json())
  ])
  .then(([collectionsData, recipesData]) => {
    const found = (collectionsData.collections || []).find(c => c.title === collectionTitle);
    if (!found) {
      console.error("Collection not found:", collectionTitle);
      return;
    }
    const allRecipes = [
      ...(recipesData.savedRecipes || []),
      ...(recipesData.recentlyViewedRecipes || [])
    ];

    const matchingRecipes = found.recipeNames.map(name => {
      return allRecipes.find(r => r.name === name);
    }).filter(r => r); 

    renderCollectionRecipes(matchingRecipes);
  })
  .catch(err => console.error("Error loading data:", err));
});

function renderCollectionRecipes(recipes) {
  const container = document.getElementById('collectionRecipesContainer');
  container.innerHTML = '';
  recipes.forEach(recipe => {
    const card = document.createElement('div');
    card.classList.add('narrow-recipe-card');
    card.onclick = () => {
      openRecipeByName(recipe.name);
    };

    // Image
    const img = document.createElement('img');
    img.classList.add('narrow-recipe-image');
    img.src = `images/${recipe.picture}`;
    img.alt = recipe.name;

    // Info
    const infoDiv = document.createElement('div');
    infoDiv.classList.add('narrow-recipe-info');

    const titleEl = document.createElement('h3');
    titleEl.textContent = recipe.name;

    const detailsEl = document.createElement('div');
    detailsEl.classList.add('narrow-recipe-details');
    detailsEl.textContent = `${recipe.length}m • Feeds ${recipe.feeds} • ${recipe.difficulty}`;


     // Tag badges
      const tagsContainer = document.createElement('div');
      tagsContainer.classList.add('tags-container');
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

    infoDiv.appendChild(titleEl);
    infoDiv.appendChild(detailsEl);
    infoDiv.appendChild(tagsContainer);


    card.appendChild(img);
    card.appendChild(infoDiv);

    container.appendChild(card);
  });
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

function openRecipeByName(recipeName) {
  window.location.href = `recipeDetail.html?name=${encodeURIComponent(recipeName)}`;
}

function goBack() {
  window.history.back();
}
