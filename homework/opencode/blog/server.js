const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const {
  initDB, getDB, saveDB, getUserByUsername, getUserById, createUser,
  getAllPosts, getUserPosts, getFollowingPosts, createPost, deletePost, getPostById,
  toggleLike, getFollowersCount, getFollowingCount, getPostsCount,
  isFollowing, toggleFollow
} = require('./db');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: 'blog-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

app.use((req, res, next) => {
  res.locals.user = req.session.userId ? { id: req.session.userId, username: req.session.username } : null;
  res.locals.tab = '';
  res.locals.formatTime = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return '剛剛';
    if (mins < 60) return `${mins}分鐘`;
    if (hours < 24) return `${hours}小時`;
    if (days < 7) return `${days}天`;
    return d.toLocaleDateString('zh-TW');
  };
  next();
});

app.get('/', (req, res) => {
  const posts = getAllPosts(req.session.userId);
  res.render('index', { posts, tab: 'foryou' });
});

app.get('/following', (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  const posts = getFollowingPosts(req.session.userId);
  res.render('index', { posts, tab: 'following' });
});

app.get('/register', (req, res) => {
  if (req.session.userId) return res.redirect('/');
  res.render('register', { error: null });
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.render('register', { error: '請填寫所有欄位' });
  }
  
  if (password.length < 4) {
    return res.render('register', { error: '密碼至少需要4個字元' });
  }
  
  if (getUserByUsername(username)) {
    return res.render('register', { error: '帳號已存在' });
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  if (createUser(username, hashedPassword)) {
    res.redirect('/login');
  } else {
    res.render('register', { error: '註冊失敗' });
  }
});

app.get('/login', (req, res) => {
  if (req.session.userId) return res.redirect('/');
  res.render('login', { error: null });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  const user = getUserByUsername(username);
  if (!user) {
    return res.render('login', { error: '帳號或密碼錯誤' });
  }
  
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.render('login', { error: '帳號或密碼錯誤' });
  }
  
  req.session.userId = user.id;
  req.session.username = user.username;
  res.redirect('/');
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.get('/compose', (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  res.render('compose');
});

app.post('/compose', (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  const { content } = req.body;
  if (content && content.trim()) {
    createPost(req.session.userId, content);
  }
  res.redirect('/');
});

app.get('/post/:id', (req, res) => {
  const post = getPostById(parseInt(req.params.id));
  if (!post) return res.status(404).send('Post not found');
  res.render('post', { post });
});

app.get('/post/:id/like', (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  toggleLike(req.session.userId, parseInt(req.params.id));
  res.redirect('back');
});

app.post('/post/:id/delete', (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  deletePost(parseInt(req.params.id), req.session.userId);
  res.redirect('back');
});

app.get('/profile/:username', (req, res) => {
  const profileUser = getUserByUsername(req.params.username);
  if (!profileUser) return res.status(404).send('User not found');
  
  const posts = getUserPosts(profileUser.id, req.session.userId);
  const followers = getFollowersCount(profileUser.id);
  const following = getFollowingCount(profileUser.id);
  const postsCount = getPostsCount(profileUser.id);
  const isOwnProfile = req.session.userId === profileUser.id;
  const followingUser = req.session.userId ? isFollowing(req.session.userId, profileUser.id) : false;
  
  res.render('profile', {
    profileUser: { ...profileUser, followers, following, postsCount },
    posts,
    isOwnProfile,
    followingUser
  });
});

app.post('/profile/:username/follow', (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  const targetUser = getUserByUsername(req.params.username);
  if (targetUser && targetUser.id !== req.session.userId) {
    toggleFollow(req.session.userId, targetUser.id);
  }
  res.redirect(`/profile/${req.params.username}`);
});

async function start() {
  await initDB();
  app.listen(PORT, () => {
    console.log(`Blog running at http://localhost:${PORT}`);
  });
}

start();
