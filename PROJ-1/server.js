// Import the Express module
const express = require('express');

// Initialize a new Express application
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// In-memory data store for simplicity
let items = [];

// Define a function to start the server
function startServer() {
    app.listen(3000, () => {
        console.log('Server running on port 3000');
        console.log('http://localhost:3000/api/items');
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
    if (newItem && newItem.name && newItem.id) { // Check if the new item has a name and ID
        items.push(newItem); // Add the new item to the items array
        res.status(201).send(`Item added: ${newItem.name}`); // Respond with a success message and HTTP 201 status
    } else {
        res.status(400).send('Item ID and name are required'); // Respond with an error message and HTTP 400 status if data is missing
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
    if (index !== -1) { // Check if the item exists in the array
        items.splice(index, 1); // Remove the item from the array
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