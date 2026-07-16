require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });

const express    = require('express');
const session    = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
const cors       = require('cors');
const connectDB  = require('./config/db');
const apiRouter  = require('./routes/api');

const app  = express();
const PORT = process.env.PORT || 3000;

connectDB();

// Allow Next.js (port 3001) to call this API
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3000'],
  credentials: true,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'aurum-grace-secret-2025',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    ttl: 7 * 24 * 60 * 60,
    touchAfter: 24 * 3600,
  }),
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: 'lax',
  },
}));

app.use('/api', apiRouter);

app.get('/', (req, res) => res.json({ message: '✦ Aurum & Grace API running' }));

app.listen(PORT, () => {
  console.log(`\n✦ API Server: http://localhost:${PORT}`);
  console.log(`  MongoDB   : ${process.env.MONGO_URI}`);
  console.log(`  Frontend  : http://localhost:3001\n`);
});
