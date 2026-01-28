const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController');
const { checkAuthenticated, checkNotAuthenticated } = require('../middleware/auth');

const router = express.Router();

// Rotas de autenticação
router.get('/login', checkNotAuthenticated, authController.renderLogin);
router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
}));

router.get('/logout', authController.logout);

module.exports = router;
