const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('./config/passport');
const flash = require('connect-flash');
const helmet = require('helmet');
const compression = require('compression');
const ejsLayouts = require('express-ejs-layouts');
const sequelize = require('./config/database');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const messagesRouter = require('./routes/messages');

const app = express();

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(ejsLayouts);
app.set('layout', 'layout');

app.use(
  session({
    secret: process.env.SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 } // 1 hour
  })
);

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// Pass user to all views
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/messages', messagesRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500);
  res.render('error', {
    title: 'Error',
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });
});


sequelize.authenticate()
  .then(() => console.log('✅ Connected to DB on Render'))
  .catch((err) => console.error('❌ DB Connection failed on Render:', err));

  
const PORT = process.env.PORT || 3000;
sequelize
  .sync()
  .then(() => {
    console.log('Database synchronized');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to sync database:', err);
  });