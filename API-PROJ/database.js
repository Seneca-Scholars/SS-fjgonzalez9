const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

// Open a database connection
async function openDb() {
    try {
        const db = await open({
            filename: './database.db',
            driver: sqlite3.Database
        });
        return db;
    } catch (error) {
        console.error('Error opening database:', error);
        throw error; // Rethrow the error to handle it in the calling function
    }
}

// Initialize database and create tables if they don't exist
async function initDb() {
    try {
        const db = await openDb();
        await db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                phone TEXT NOT NULL,
                address TEXT NOT NULL
            )
        `);
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error; // Rethrow the error to handle it in the calling function
    }
}

module.exports = { openDb, initDb };