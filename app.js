const express = require('express');
const path = require('path');
require('dotenv').config();

// Configurar timezone da aplicação
process.env.TZ = 'America/Sao_Paulo';

const session = require('express-session');
const passport = require('passport');
const flash = require('express-flash');
const passportConfig = require('./config/passport');
const { sequelizeCoreDB, sequelizeBackups } = require('./config/database');

// Importar rotas
const authRoutes = require('./routes/auth');
const invoiceRoutes = require('./routes/invoices');

const app = express();

// Configuração de visualização
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Configuração de sessão
app.use(session({
  secret: process.env.SESSION_SECRET || 'sua_chave_secreta',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 horas
  },
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport);

// Flash messages
app.use(flash());

// Middleware para tornar user disponível nas views
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// Rotas
app.use('/', authRoutes);
app.use('/', invoiceRoutes);

// Rota raiz
app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/'); // Vai para o dashboard (invoiceRoutes)
  }
  res.redirect('/login');
});

// Tratamento de erros 404
app.use((req, res) => {
  res.status(404).render('404', { user: req.user });
});

// Teste de conexão com bancos de dados
const testDatabaseConnections = async () => {
  try {
    await sequelizeCoreDB.authenticate();
    console.log('✓ Conexão com coredb estabelecida com sucesso');
  } catch (error) {
    console.error('✗ Erro ao conectar com coredb:', error.message);
  }

  try {
    await sequelizeBackups.authenticate();
    console.log('✓ Conexão com backups estabelecida com sucesso');
  } catch (error) {
    console.error('✗ Erro ao conectar com backups:', error.message);
  }
};

const PORT = process.env.PORT || 3000;

testDatabaseConnections().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀 Servidor rodando em http://localhost:${PORT}\n`);
  });
});
