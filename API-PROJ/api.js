// Import the required modules
const express = require('express');
const { openDb, initDb } = require('./database');

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
            console.log(`API endpoint: http://localhost:${port}/api/users`); // Log the API endpoint
        });
    }).catch(error => {
        console.error('Failed to initialize the database:', error);
        process.exit(1); // Exit the process if database initialization fails
    });
}

// GET Endpoint: Fetch all items from the database
async function getUsers(req, res) {
    try {
        // Open database connection
        const db = await openDb();

        // Retrieve all items from the 'items' table
        const users = await db.all('SELECT * FROM users');

        // Send the retrieved items as JSON response
        res.json(users);
    } catch (error) {
        // Handle errors and send an error response
        res.status(500).json({ error: error.message });
    }
}

// POST Endpoint: Add a new item to the database
async function addUser(req, res) {
    try {
        // Open database connection
        const db = await openDb();

        // Extract the new item from the request body
        const { name, phone, address, email } = req.body;

        // Check if the new item contains the required fields
        if (name && phone && address && email) {
            // SQL statement for inserting the new item
            const sql = 'INSERT INTO users (name, phone, address, email) VALUES (?, ?, ?, ?)';

            // Execute the SQL statement
            const result = await db.run(sql, [name, phone, address, email]);

            // Create the response object with the inserted item and ID
            const insertedUser = { id: result.lastID, name, phone, address, email };

            // Send the newly created item with HTTP 201 status
            res.status(201).json(insertedUser);
        } else {
            // Send an error response if the item is invalid
            res.status(400).json({ error: 'User must have name, phone, address and email fields' });
        }
    } catch (error) {
        // Handle errors and send an error response
        res.status(500).json({ error: error.message });
    }
}

// PUT Endpoint: Update an existing item in the database
async function updateUser(req, res) {
    try {
        // Open database connection
        const db = await openDb();

        // Extract the item ID from the URL parameters
        const userId = parseInt(req.params.id, 10);

        // Extract the updated item data from the request body
        const { name, phone, address, email } = req.body;

        // Check if the updated item contains any key-value pairs
        if (name || phone || address || email) {
            // Construct SQL statement dynamically for updating
            const updates = [];
            const values = [];

            if (name) {
                updates.push('name = ?');
                values.push(name);
            }
            if (phone) {
                updates.push('phone = ?');
                values.push(phone);
            }
            if (address) {
                updates.push('address = ?');
                values.push(address);
            }
            if (email) {
                updates.push('email = ?');
                values.push(email)
            }

            values.push(userId); // Add item ID to values

            // SQL statement for updating the item
            const sql = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;

            // Execute the SQL statement
            const result = await db.run(sql, values);

            // Check if the item was updated
            if (result.changes > 0) {
                // Retrieve and send the updated item
                const updatedUser = await db.get('SELECT * FROM users WHERE id = ?', [userId]);
                res.json(updatedUser);
            } else {
                // Send an error response if the item is not found
                res.status(404).json({ error: 'User not found' });
            }
        } else {
            // Send an error response if the updated item data is invalid
            res.status(400).json({ error: 'User must have at least one field to update' });
        }
    } catch (error) {
        // Handle errors and send an error response
        res.status(500).json({ error: error.message });
    }
}

// DELETE Endpoint: Remove an item from the database
async function deleteUser(req, res) {
    try {
        // Open database connection
        const db = await openDb();

        // Extract the item ID from the URL parameters
        const userId = parseInt(req.params.id, 10);

        // SQL statement for deleting the item
        const result = await db.run('DELETE FROM users WHERE id = ?', [userId]);

        // Check if the item was deleted
        if (result.changes > 0) {
            // Send a success message
            res.json({ message: `User with ID ${userId} deleted` });
        } else {
            // Send an error response if the item is not found
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        // Handle errors and send an error response
        res.status(500).json({ error: error.message });
    }
}

// Register route handlers with their corresponding HTTP methods and paths
app.get('/api/users', getUsers);
app.post('/api/users', addUser);
app.put('/api/users/:id', updateUser);
app.delete('/api/users/:id', deleteUser);

// Start the server
startServer();
