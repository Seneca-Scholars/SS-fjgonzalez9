// database.js
const sqlite3 = require('sqlite3').verbose();
const {open} = require('sqlite');

// Open a database connection
async function openDb() {
    return open({
        filename: './database.db',
        driver: sqlite3.Database
    });
}

// Initialize database and create tables if they don't exist
async function initDb() {
    const db = await openDb();
    await db.exec(`
        CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
        )
    `);
}

module.exports = { openDb, initDb };