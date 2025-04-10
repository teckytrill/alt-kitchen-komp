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
    user.shopping_lists.main.ingredients = shoppingList;
    user.pantry = kitchenInventory;

    fs.writeFile(userFilePath, JSON.stringify(userData, null, 2), 'utf8', (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to save user data' });
      }

      res.status(200).json({ message: 'User data updated successfully' });
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
