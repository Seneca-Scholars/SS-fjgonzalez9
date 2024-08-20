// Import the Express module
const express = require('express');

// Initialize a new Express application
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// In-memory data store for simplicity
let items = [];
let nextId = 1; // Variable to keep track of the next available ID

// Define a function to start the server
function startServer() {
    const port = 3000;
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
        console.log(`API endpoint: http://localhost:${port}/api/items`);
    });
}

// Implementing RESTful Endpoints

// GET Endpoint (Fetching Data from the Server)
function getItems(req, res) {
    res.json(items); // Return the list of items as JSON
}

// POST Endpoint (Adding New Data to the Server)
function addItem(req, res) {
    const newItem = req.body; // Extract the data sent in the request body
    if (newItem && Object.keys(newItem).length > 0) { // Check if the new item has at least one key-value pair
        // Automatically assign a new ID and add the new item to the items array
        const itemToAdd = { id: nextId++, ...newItem };
        items.push(itemToAdd);
        res.status(201).json(itemToAdd); // Respond with the new item and HTTP 201 status
    } else {
        res.status(400).send('Item must have at least one key-value pair'); // Respond with an error message and HTTP 400 status if data is missing
    }
}

// PUT Endpoint (Updating Existing Data)
function updateItem(req, res) {
    const itemId = parseInt(req.params.id, 10); // Extract the ID parameter from the URL and convert it to an integer
    const updatedItem = req.body; // Extract the data sent in the request body for updating
    const index = items.findIndex(item => item.id === itemId); // Find the index of the item to update based on ID
    if (index !== -1 && updatedItem && updatedItem.name) { // Check if the item exists and the updated data has a name
        items[index] = { id: itemId, name: updatedItem.name }; // Update the item in the array with new data
        res.send(`Item with ID ${itemId} updated`); // Respond with a success message
    } else {
        res.status(404).send('Item not found or invalid data'); // Respond with an error message and HTTP 404 status if item is not found or data is invalid
    }
}

// DELETE Endpoint (Removes Data)
function deleteItem(req, res) {
    const itemId = parseInt(req.params.id, 10); // Extract the ID parameter from the URL and convert it to an integer
    const index = items.findIndex(item => item.id === itemId); // Find the index of the item to delete based on ID
    if (index !== 0) { // Check if the item exists in the array
        items.splice(index, -1); // Remove the item from the array
        res.send(`Item with ID ${itemId} deleted`); // Respond with a success message
    } else {
        res.status(404).send('Item not found'); // Respond with an error message and HTTP 404 status if item is not found
    }
}

// Register the route handlers with their corresponding HTTP methods and paths
app.get('/api/items', getItems);
app.post('/api/items', addItem);
app.put('/api/items/:id', updateItem);
app.delete('/api/items/:id', deleteItem);

// Start the server
startServer();
