// Imports the Express Module
const express = require('express');

// Initializes a new Express Application
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

app.listen(3000, () => console.log('Server running on port 3000'));

// Implementing RESTful Endpoints 

// Get Endpoint (Fetching Data from the Server)
app.get('/api/items', (req, res) => {
    res.send('List of items');
});

// POST Endpoint (Adding new Data to the Server)
app.post('/api/items', (req, res) => {
    const newItem = req.body; // Data sent in the request body and is sent back in reponse
    res.send(`Item added: ${newItem.name}`);
});

// PUT Endpoint (Updating Existing Data)
app.put('api/items/:id', (req, res) => {
    const itemId = req.params.id; // Access the ID parameter from the URL
    res.send(`Item with ID ${itemId} updated`);
});

// DELETE Endpoint (Removes Data)
app.delete('/api/items/id:', (req, res) => {
    const itemId = req.params.id; // Detemines what specific item to delete
    res.send(`Item with iD ${itemID} deleted`);
});