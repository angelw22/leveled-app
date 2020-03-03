const express = require('express');
const session = require('express-session');
const Redis = require('ioredis');
const redisClient = new Redis();
const RedisStore = require('connect-redis')(session);
const cors = require('cors');

import sessionRoutes from './api/Session';
import userRoutes from './api/Users';
import uploadRoutes from './api/Uploading';
import userDataRoutes from './api/UserData';

const app = express();

let sess = {
  secret: process.env.SESSION_SECRET_KEY,
  name: 'leveledSession',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 86400000 },
  store: new RedisStore({
    host: '127.0.0.1',
    port: 6379,
    client: redisClient
  })
}

if (process.env.MODE !== 'dev') {
  // setting for reverse proxy in prod
  app.enable("trust proxy");
  // HTTPS-only cookies
  sess.cookie.secure = true;
}

app.use(cors({
  origin: process.env.MODE === 'dev' ? ['http://localhost:3000'] :
  ['https://leveled.cf', 'https://www.leveled.cf'] 
  ,
  credentials: true
}));
app.use(session(sess));
app.use(express.json());

// routes
sessionRoutes(app);
userRoutes(app);
uploadRoutes(app);
userDataRoutes(app);


app.listen(8000, () => {
  console.log(`Leveled app listening on port: 8000`);
})

export { redisClient };