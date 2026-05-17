const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

let posts = [
  { id: 1, author: "sophia_", content: "今天天氣真好！出門踏青去 🌸", likes: 42, createdAt: new Date(Date.now() - 3600000).toISOString(), comments: [] },
  { id: 2, author: "john_dev", content: "寫程式的一天 💻", likes: 28, createdAt: new Date(Date.now() - 7200000).toISOString(), comments: [] },
  { id: 3, author: "luna_k", content: "新買的咖啡機到了 ☕", likes: 35, createdAt: new Date(Date.now() - 10800000).toISOString(), comments: [] },
];

let nextId = 4;

app.get('/api/posts', (req, res) => {
  res.json(posts);
});

app.post('/api/posts', (req, res) => {
  const { author, content } = req.body;
  const newPost = {
    id: nextId++,
    author,
    content,
    likes: 0,
    createdAt: new Date().toISOString(),
    comments: []
  };
  posts.unshift(newPost);
  res.json(newPost);
});

app.post('/api/posts/:id/like', (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (post) {
    post.likes += 1;
    res.json({ success: true, likes: post.likes });
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
});

app.post('/api/posts/:id/comment', (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (post) {
    const comment = { id: Date.now(), author: req.body.author, content: req.body.content };
    post.comments.push(comment);
    res.json(comment);
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
});

app.get('/api/status', (req, res) => {
  res.json({ server: 'Node.js Express', version: '1.0.0', port: PORT });
});

app.listen(PORT, () => {
  console.log(`🚀 Node.js server running on http://localhost:${PORT}`);
});