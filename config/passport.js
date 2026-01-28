const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { UserCoreDB } = require('../config/models');

function initialize(passport) {
  const authenticateUser = async (email, password, done) => {
    try {
      const user = await UserCoreDB.findOne({ where: { email } });

      if (!user) {
        return done(null, false, { message: 'Usuário não encontrado' });
      }

      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return done(null, false, { message: 'Senha incorreta' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  };

  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      authenticateUser
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await UserCoreDB.findByPk(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
}

module.exports = initialize;
