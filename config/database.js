const { Sequelize } = require('sequelize');
require('dotenv').config();

// Conexão com coredb
const sequelizeCoreDB = new Sequelize(
  process.env.DB_COREDB,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: true,
    timezone: '-03:00',
    define: {
      timestamps: false,
      underscored: true,
    },
  }
);

// Conexão com backups
const sequelizeBackups = new Sequelize(
  process.env.DB_BACKUPS,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false,
    timezone: '-03:00',
    define: {
      timestamps: false,
      underscored: true,
    },
  }
);

module.exports = {
  sequelizeCoreDB,
  sequelizeBackups,
};
