const express = require('express');
const multer = require('multer');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const { hashPassword, verifyPassword, generateToken, verifyToken } = require('./auth');


const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Убедимся, что папка для файлов есть
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

// База данных
const db = new sqlite3.Database('./database.db');

// Токен-секрет
const SECRET = 'fashion_secret_key';

// Создание таблицы пользователей, если нет
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password TEXT
  )
`);

// Таблица публикаций
db.run(`
  CREATE TABLE IF NOT EXISTS publications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    image TEXT,
    tags TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

// Таблица подборок
db.run(`
    CREATE TABLE IF NOT EXISTS collections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      description TEXT,
      is_private INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
  // Связь: публикация — подборка
  db.run(`
    CREATE TABLE IF NOT EXISTS collection_publications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      collection_id INTEGER,
      publication_id INTEGER,
      FOREIGN KEY (collection_id) REFERENCES collections(id),
      FOREIGN KEY (publication_id) REFERENCES publications(id)
    );
  `);
  

// Загрузка изображений
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Добавление публикации
app.post('/api/publications', upload.single('image'), (req, res) => {
  const { title, description, tags } = req.body;
  const image = req.file.filename;

  db.run(
    `INSERT INTO publications (title, description, image, tags) VALUES (?, ?, ?, ?)`,
    [title, description, image, tags],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Ошибка при сохранении' });
      }
      res.status(201).json({ id: this.lastID });
    }
  );
});

// Создание новой подборки
app.post('/api/collections', (req, res) => {
    const { name, description, is_private } = req.body;
    const privateFlag = is_private ? 1 : 0;
  
    db.run(
      `INSERT INTO collections (name, description, is_private) VALUES (?, ?, ?)`,
      [name, description, privateFlag],
      function (err) {
        if (err) return res.status(500).json({ error: 'Ошибка при создании подборки' });
        res.status(201).json({ id: this.lastID });
      }
    );
  });
  
  // Получение всех подборок
  app.get('/api/collections', (req, res) => {
    db.all(`SELECT * FROM collections ORDER BY created_at DESC`, (err, rows) => {
      if (err) return res.status(500).json({ error: 'Ошибка при получении подборок' });
      res.json(rows);
    });
  });
  
  // Добавление публикации в подборку
  app.post('/api/collections/:id/add', (req, res) => {
    const collectionId = req.params.id;
    const { publication_id } = req.body;
  
    db.run(
      `INSERT INTO collection_publications (collection_id, publication_id) VALUES (?, ?)`,
      [collectionId, publication_id],
      function (err) {
        if (err) return res.status(500).json({ error: 'Ошибка при добавлении в подборку' });
        res.status(200).json({ message: 'Публикация добавлена' });
      }
    );
  });
  

// 📥 Получение публикаций
app.get('/api/publications', (req, res) => {
  db.all(`SELECT * FROM publications ORDER BY created_at DESC`, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Ошибка при загрузке' });
    res.json(rows);
  });
});

// Запуск
app.listen(PORT, () => {
  console.log(`✅ Сервер запущен: http://localhost:${PORT}`);
});

//  Регистрация
app.post('/api/register', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Заполните все поля' });
  }

  hashPassword(password).then((hashedPassword) => {
    db.run(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword],
      function (err) {
        if (err) {
          console.error(err);
          return res.status(400).json({ error: 'Пользователь уже существует или ошибка базы' });
        }
        res.json({ message: 'Пользователь зарегистрирован' });
      }
    );
  });
  
});

// Авторизация
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err || !user) return res.status(401).json({ error: 'Неверные данные' });
  
    verifyPassword(password, user.password).then((match) => {
      if (!match) return res.status(401).json({ error: 'Неверные данные' });
  
      const token = generateToken(user, SECRET);
      res.json({ token });
    });
  });
  
});

app.get('/api/profile', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Нет токена' });

  try {
    const token = auth.replace('Bearer ', '');
    const { id } = verifyToken(token, SECRET);
    db.get('SELECT id, username, email FROM users WHERE id = ?', [id], (err, user) => {
      if (err || !user) return res.status(404).json({ error: 'Пользователь не найден' });
      res.json({ user });
    });
  } catch {
    res.status(401).json({ error: 'Невалидный токен' });
  }
});
app.get('/api/collections/:id/publications', (req, res) => {
  const collectionId = req.params.id;

  db.all(
    `SELECT p.* FROM publications p
     JOIN collection_publications cp ON p.id = cp.publication_id
     WHERE cp.collection_id = ?`,
    [collectionId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Ошибка при получении публикаций' });
      res.json(rows);
    }
  );
});
