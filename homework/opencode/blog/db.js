const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'blog.db');

let db;

async function initDB() {
  const SQL = await initSqlJs();
  
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }
  
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      bio TEXT DEFAULT '',
      avatar_color TEXT DEFAULT '#1d9bf0',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  try { db.run("ALTER TABLE users ADD COLUMN avatar_color TEXT DEFAULT '#1d9bf0'"); } catch(e) {}
  try { db.run("ALTER TABLE users ADD COLUMN bio TEXT DEFAULT ''"); } catch(e) {}

  db.run(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS likes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      post_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (post_id) REFERENCES posts(id),
      UNIQUE(user_id, post_id)
    )
  `);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS follows (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      follower_id INTEGER NOT NULL,
      following_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (follower_id) REFERENCES users(id),
      FOREIGN KEY (following_id) REFERENCES users(id),
      UNIQUE(follower_id, following_id)
    )
  `);
  
  saveDB();
  return db;
}

function saveDB() {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
}

function getDB() {
  return db;
}

function getUserByUsername(username) {
  const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
  stmt.bind([username]);
  if (stmt.step()) {
    const row = stmt.get();
    stmt.free();
    return { id: row[0], username: row[1], password: row[2], bio: row[3], avatar_color: row[4], created_at: row[5] };
  }
  stmt.free();
  return null;
}

function getUserById(id) {
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  stmt.bind([id]);
  if (stmt.step()) {
    const row = stmt.get();
    stmt.free();
    return { id: row[0], username: row[1], password: row[2], bio: row[3], avatar_color: row[4], created_at: row[5] };
  }
  stmt.free();
  return null;
}

function createUser(username, password) {
  try {
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
    saveDB();
    return true;
  } catch (e) {
    return false;
  }
}

function getAllPosts(userId = null) {
  let query = `
    SELECT p.id, p.user_id, p.content, p.created_at, u.username, 
      IFNULL(u.avatar_color, '#1d9bf0') as avatar_color,
      (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count,
      (SELECT COUNT(*) FROM likes WHERE post_id = p.id AND user_id = ?) as is_liked
    FROM posts p
    JOIN users u ON p.user_id = u.id
    ORDER BY p.created_at DESC
  `;
  
  const stmt = db.prepare(query);
  stmt.bind([userId || 0]);
  const results = [];
  while (stmt.step()) {
    const row = stmt.get();
    results.push({
      id: row[0], user_id: row[1], content: row[2], created_at: row[3],
      username: row[4], avatar_color: row[5], like_count: row[6], is_liked: row[7] > 0
    });
  }
  stmt.free();
  return results;
}

function getUserPosts(userId, currentUserId = null) {
  const query = `
    SELECT p.id, p.user_id, p.content, p.created_at, u.username,
      IFNULL(u.avatar_color, '#1d9bf0') as avatar_color,
      (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count,
      (SELECT COUNT(*) FROM likes WHERE post_id = p.id AND user_id = ?) as is_liked
    FROM posts p
    JOIN users u ON p.user_id = u.id
    WHERE p.user_id = ?
    ORDER BY p.created_at DESC
  `;
  
  const stmt = db.prepare(query);
  stmt.bind([currentUserId || 0, userId]);
  const results = [];
  while (stmt.step()) {
    const row = stmt.get();
    results.push({
      id: row[0], user_id: row[1], content: row[2], created_at: row[3],
      username: row[4], avatar_color: row[5], like_count: row[6], is_liked: row[7] > 0
    });
  }
  stmt.free();
  return results;
}

function createPost(userId, content) {
  db.run('INSERT INTO posts (user_id, content) VALUES (?, ?)', [userId, content]);
  saveDB();
}

function deletePost(postId, userId) {
  db.run('DELETE FROM likes WHERE post_id = ?', [postId]);
  db.run('DELETE FROM posts WHERE id = ? AND user_id = ?', [postId, userId]);
  saveDB();
}

function toggleLike(userId, postId) {
  const stmt = db.prepare('SELECT * FROM likes WHERE user_id = ? AND post_id = ?');
  stmt.bind([userId, postId]);
  if (stmt.step()) {
    stmt.free();
    db.run('DELETE FROM likes WHERE user_id = ? AND post_id = ?', [userId, postId]);
  } else {
    stmt.free();
    db.run('INSERT INTO likes (user_id, post_id) VALUES (?, ?)', [userId, postId]);
  }
  saveDB();
}

function getFollowersCount(userId) {
  const stmt = db.prepare('SELECT COUNT(*) FROM follows WHERE following_id = ?');
  stmt.bind([userId]);
  stmt.step();
  const count = stmt.get()[0];
  stmt.free();
  return count;
}

function getFollowingCount(userId) {
  const stmt = db.prepare('SELECT COUNT(*) FROM follows WHERE follower_id = ?');
  stmt.bind([userId]);
  stmt.step();
  const count = stmt.get()[0];
  stmt.free();
  return count;
}

function getPostsCount(userId) {
  const stmt = db.prepare('SELECT COUNT(*) FROM posts WHERE user_id = ?');
  stmt.bind([userId]);
  stmt.step();
  const count = stmt.get()[0];
  stmt.free();
  return count;
}

function isFollowing(followerId, followingId) {
  const stmt = db.prepare('SELECT * FROM follows WHERE follower_id = ? AND following_id = ?');
  stmt.bind([followerId, followingId]);
  const exists = stmt.step();
  stmt.free();
  return exists;
}

function toggleFollow(followerId, followingId) {
  if (isFollowing(followerId, followingId)) {
    db.run('DELETE FROM follows WHERE follower_id = ? AND following_id = ?', [followerId, followingId]);
  } else {
    db.run('INSERT INTO follows (follower_id, following_id) VALUES (?, ?)', [followerId, followingId]);
  }
  saveDB();
}

function getPostById(postId, currentUserId = null) {
  const stmt = db.prepare(`
    SELECT p.*, u.username, u.avatar_color,
      (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count,
      (SELECT COUNT(*) FROM likes WHERE post_id = p.id AND user_id = ?) as is_liked
    FROM posts p
    JOIN users u ON p.user_id = u.id
    WHERE p.id = ?
  `);
  stmt.bind([currentUserId || 0, postId]);
  if (stmt.step()) {
    const row = stmt.get();
    stmt.free();
    return {
      id: row[0], user_id: row[1], content: row[2], created_at: row[3],
      username: row[4], avatar_color: row[5], like_count: row[6], is_liked: row[7] > 0
    };
  }
  stmt.free();
  return null;
}

function getFollowingPosts(userId) {
  const query = `
    SELECT p.*, u.username, IFNULL(u.avatar_color, '#1d9bf0') as avatar_color,
      (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count,
      (SELECT COUNT(*) FROM likes WHERE post_id = p.id AND user_id = ?) as is_liked
    FROM posts p
    JOIN users u ON p.user_id = u.id
    WHERE p.user_id IN (SELECT following_id FROM follows WHERE follower_id = ?)
    ORDER BY p.created_at DESC
  `;
  
  const stmt = db.prepare(query);
  stmt.bind([userId, userId]);
  const results = [];
  while (stmt.step()) {
    const row = stmt.get();
    results.push({
      id: row[0], user_id: row[1], content: row[2], created_at: row[3],
      username: row[4], avatar_color: row[5], like_count: row[6], is_liked: row[7] > 0
    });
  }
  stmt.free();
  return results;
}

module.exports = {
  initDB, getDB, saveDB, getUserByUsername, getUserById, createUser,
  getAllPosts, getUserPosts, getFollowingPosts, createPost, deletePost, getPostById,
  toggleLike, getFollowersCount, getFollowingCount, getPostsCount,
  isFollowing, toggleFollow
};
