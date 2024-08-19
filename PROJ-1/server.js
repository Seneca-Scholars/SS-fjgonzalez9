// Imports the Express Module
const express = require('express');

// Initializes a new Express Application
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

app.listen(3000, () => console.log('Server running on port 3000'));
console.log('http://localhost:3000/api/items')

// Implementing RESTful Endpoints 

// Get Endpoint (Fetching Data from the Server)
app.get('/api/items', (req, res) => {
    res.send('List of items');
});

app.post('/api/items', (req, res) => {
    const newItem = req.body; // Data sent in the request body
    if (newItem && newItem.name) {
        res.send(`Item added: ${newItem.name}`);
    } else {
        res.status(400).send('Item name is required');
    }
});

// PUT Endpoint (Updating Existing Data)
app.put('/api/items/:id', (req, res) => {
    const itemId = req.params.id; // Access the ID parameter from the URL
    res.send(`Item with ID ${itemId} updated`);
});

// DELETE Endpoint (Removes Data)
app.delete('/api/items/id:', (req, res) => {
    const itemId = req.params.id; // Detemines what specific item to delete
    res.send(`Item with iD ${itemId} deleted`);
});