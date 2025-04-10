function loadPage(page) {
    fetch(`content/${page}.html`)
      .then(res => res.text())
      .then(html => {
        appContent.innerHTML = html;
  
        // Handle shopping list logic when that page loads
        if (page === 'shoppinglist') {
          setupShoppingList();
        }
      });
  }
  
  // Main shopping list logic
  function setupShoppingList() {
    const form = document.getElementById('shopping-form');
    const list = document.getElementById('shopping-list');
  
    let items = [];
  
    form.addEventListener('submit', (e) => {
      e.preventDefault();
  
      const name = document.getElementById('item-name').value.trim();
      const qty = document.getElementById('item-qty').value;
      const unit = document.getElementById('item-unit').value;
  
      if (name === '') return;
  
      const item = { name, qty, unit };
      items.push(item);
      renderList();
      form.reset();
    });
  
    function renderList() {
      list.innerHTML = '';
      items.forEach((item, i) => {
        const li = document.createElement('li');
        li.textContent = `${item.qty} ${item.unit} — ${item.name}`;
        const btn = document.createElement('button');
        btn.textContent = '🗑';
        btn.onclick = () => {
          items.splice(i, 1);
          renderList();
        };
        li.appendChild(btn);
        list.appendChild(li);
      });
    }
  }
