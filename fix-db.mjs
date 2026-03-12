import Database from 'better-sqlite3';
import dotenv from 'dotenv';
dotenv.config();

const db = new Database('hukuk.db');

// Fix lawyer name - update all users
db.prepare("UPDATE users SET name = ?, email = ? WHERE email = ?").run(
  "Av. Mahmut KORKMAZ\nAv. Zeki FIRAT",
  "yonetim@zemahukuk.com.tr",
  "admin@hukukasistan.com"
);

// Also update by email if already correct email
db.prepare("UPDATE users SET name = ? WHERE email = ?").run(
  "Av. Mahmut KORKMAZ\nAv. Zeki FIRAT",
  "yonetim@zemahukuk.com.tr"
);

// Reset notifications table (drop and recreate)
db.exec(`
  DROP TABLE IF EXISTS notifications;
  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT,
    message TEXT,
    read INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

const users = db.prepare('SELECT id, email, name FROM users').all();
console.log('Users after fix:', JSON.stringify(users, null, 2));
db.close();
console.log('Done!');
