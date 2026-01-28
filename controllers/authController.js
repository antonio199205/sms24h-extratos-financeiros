const bcrypt = require('bcryptjs');
const { UserCoreDB } = require('../config/models');

exports.renderLogin = (req, res) => {
  res.render('login', { layout: false });
};

exports.login = async (req, res) => {
  try {
    req.flash('success_msg', 'Bem-vindo!');
    res.redirect('/');
  } catch (error) {
    console.error('Erro no login:', error);
    req.flash('error_msg', 'Erro ao fazer login');
    res.redirect('/login');
  }
};

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return req.flash('error_msg', 'Erro ao fazer logout');
    }
    req.flash('success_msg', 'Logout realizado com sucesso!');
    res.redirect('/login');
  });
};
