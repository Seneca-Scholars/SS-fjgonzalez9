// Import the required modules
const express = require('express');
const {openDb, initDb} = require('./database');

// Initialize a new Express application
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Define the function to start the server
function startServer() {
    const port = 3000;

    // Initialize the database
    initDb().then(() => {
        // Start the server
        app.listen(port, () => {
            console.log(`Server running on port ${port}`); // Log the server port
            console.log(`API endpoint: http://localhost:${port}/api/items`); // Log the API endpoint
        });
    }).catch(error => {
        console.error('Failed to initialize the database:', error);
        process.exit(1); // Exit the process if database initialization fails
    });
}

// GET Endpoint: Fetch all items from the database
async function getItems(req, res) {
    try {
        // Open database connection
        const db = await openDb();

        // Retrieve all items from the 'items' table
        const items = await db.all('SELECT * FROM items');

        // Send the retrieved items as JSON response
        res.json(items);
    } catch (error) {
        // Handle errors and send an error response
        res.status(500).json(`${error}`);
    }
}

// POST Endpoint: Add a new item to the database
async function addItem(req, res) {
    try {
        // Open database connection
        const db = await openDb();

        // Extract the new item from the request body
        const newItem = req.body;
        console.log(newItem)
        // Check if the new item contains any key-value pairs
        if (newItem && Object.keys(newItem).length > 0) {
            // Construct SQL statement dynamically
            const values = Object.values(newItem); // e.g., ["Item Name", "Item Description"]
            const placeholders = values.map(() => '?').join(', '); // e.g., "?, ?"

            // SQL statement for inserting the new item
            const sql = `INSERT INTO items (data) VALUES (${placeholders})`;

            // Execute the SQL statement
            const result = await db.run(sql, values);

            // Create the response object with the inserted item and ID
            const insertedItem = { id: result.lastID, ...newItem };

            // Send the newly created item with HTTP 201 status
            res.status(201).json(insertedItem);
        } else {
            // Send an error response if the item is invalid
            res.status(400).json({ error: 'Item must have at least one key-value pair' });
        }
        } catch (error) {
            // Handle errors and send an error response
            res.status(500).json(`${error}`);
   }
}

// PUT Endpoint: Update an existing item in the database
async function updateItem(req, res) {
    try {
        // Open database connection
        const db = await openDb();

        // Extract the item ID from the URL parameters
        const itemId = parseInt(req.params.id, 10);

        // Extract the updated item data from the request body
        const updatedItem = req.body;

        // Check if the updated item contains any key-value pairs
        if (updatedItem && Object.keys(updatedItem).length > 0) {
            // Construct SQL statement dynamically for updating
            const values = [...Object.values(updatedItem), itemId]; // Add item ID to values

            // SQL statement for updating the item
            const sql = `UPDATE items SET data = ? WHERE id = ?`;

            // Execute the SQL statement
            const result = await db.run(sql, values);

            // Check if the item was updated
            if (result.changes > 0) {
                // Send a success message
                res.json({ message: `Item with ID ${itemId} updated` });
            } else {
                // Send an error response if the item is not found
                res.status(404).json({ error: 'Item not found' });
            }
        } else {
            // Send an error response if the updated item data is invalid
            res.status(400).json({ error: 'Item must have at least one key-value pair' });
        }
    } catch (error) {
        // Handle errors and send an error response
        res.status(500).json(`${error}`);
    }
}

// DELETE Endpoint: Remove an item from the database
async function deleteItem(req, res) {
    try {
        // Open database connection
        const db = await openDb();

        // Extract the item ID from the URL parameters
        const itemId = parseInt(req.params.id, 10);

        // SQL statement for deleting the item
        const result = await db.run('DELETE FROM items WHERE id = ?', [itemId]);

        // Check if the item was deleted
        if (result.changes > 0) {
            // Send a success message
            res.json({ message: `Item with ID ${itemId} deleted` });
        } else {
            // Send an error response if the item is not found
            res.status(404).json({ error: 'Item not found' });
        }
    } catch (error) {
        // Handle errors and send an error response
        res.status(500).json(`${error}`);
    }
}

// Register route handlers with their corresponding HTTP methods and paths
app.get('/api/items', getItems);
app.post('/api/items', addItem);
app.put('/api/items/:id', updateItem);
app.delete('/api/items/:id', deleteItem);

// Start the server
startServer();