const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const userFilePath = path.join(__dirname, '/data/users.json');

// Get user data by username
app.get('/api/users/:username', (req, res) => {
  const username = req.params.username;

  fs.readFile(userFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read user data' });
    }

    const userData = JSON.parse(data);

    // Search for the user by username
    const user = userData.find(user => user.username === username);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  });
});

// Update user data
app.post('/api/users/:username', (req, res) => {
  const username = req.params.username;
  const { shoppingList, kitchenInventory } = req.body;

  fs.readFile(userFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read user data' });
    }

    const userData = JSON.parse(data);

    // Find the user by username
    let user = userData.find(user => user.username === username);

    if (!user) {
      // If user doesn't exist, initialize with default values
      user = {
        username: username,
        shopping_lists: { main: { ingredients: [] } },
        pantry: [],
        favorite_ingredients: [],
        favorite_recipes: [],
      };
      userData.push(user); // Add the new user to the data
    }

    // Update the user data
    if (shoppingList !== undefined) {
      user.shopping_lists.main.ingredients = shoppingList;
    }
    
    if (kitchenInventory !== undefined) {
      user.pantry = kitchenInventory;
    }

    fs.writeFile(userFilePath, JSON.stringify(userData, null, 2), 'utf8', (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to save user data' });
      }

      res.status(200).json({ message: 'User data updated successfully' });
    });
  });
});

// Add favorite ingredient endpoint
app.post('/api/users/:username/favorite_ingredients', (req, res) => {
  const username = req.params.username;
  const { ingredientName } = req.body;

  if (!ingredientName) {
    return res.status(400).json({ error: 'Ingredient name is required' });
  }

  fs.readFile(userFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read user data' });
    }

    const userData = JSON.parse(data);
    const user = userData.find(u => u.username === username);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Add the ingredient to favorites
    user.favorite_ingredients.push({
      name: ingredientName,
      timestamp: new Date().toISOString()
    });

    // Save the updated user data
    fs.writeFile(userFilePath, JSON.stringify(userData, null, 2), 'utf8', (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to save user data' });
      }

      res.status(200).json({ message: "Ingredient added to favorites" });
    });
  });
});

// Remove favorite ingredient endpoint
app.delete('/api/users/:username/favorite_ingredients/:ingredientName', (req, res) => {
  const { username, ingredientName } = req.params;

  // Read the users data from the file
  fs.readFile(userFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read user data' });
    }

    const userData = JSON.parse(data);

    // Find the user by username
    const user = userData.find(u => u.username === username);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the index of the favorite ingredient using the name in the object
    const index = user.favorite_ingredients.findIndex(fav => fav.name.toLowerCase() === decodeURIComponent(ingredientName).toLowerCase());

    if (index === -1) {
      return res.status(404).json({ error: "Favorite ingredient not found" });
    }

    // Remove the ingredient from the favorites list
    user.favorite_ingredients.splice(index, 1);

    // Save the updated user data to the file
    fs.writeFile(userFilePath, JSON.stringify(userData, null, 2), 'utf8', (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to save user data' });
      }

      res.status(200).json({ message: "Ingredient removed from favorites" });
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});