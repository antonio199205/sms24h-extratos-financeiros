const { sequelizeCoreDB, sequelizeBackups } = require('./database');
const { createUserModel, createUsuarioModel, createInvoiceModel, createActivationModel, createSmsStringModel } = require('../models');

// Modelos apenas para coredb

// SmsString models
const SmsStringCoreDB = createSmsStringModel(sequelizeCoreDB);
const SmsStringBackups = createSmsStringModel(sequelizeBackups);

const UserCoreDB = createUserModel(sequelizeCoreDB);
const UsuarioCoreDB = createUsuarioModel(sequelizeCoreDB);
const InvoiceCoreDB = createInvoiceModel(sequelizeCoreDB);
const ActivationCoreDB = createActivationModel(sequelizeCoreDB, SmsStringCoreDB);

// Modelos apenas para backups (ativações)
const ActivationBackups = createActivationModel(sequelizeBackups, SmsStringBackups);

// Relacionamento entre Usuario e RecargaInvoice (apenas em coredb)
UsuarioCoreDB.hasMany(InvoiceCoreDB, { foreignKey: 'usuario_id', as: 'invoices' });
InvoiceCoreDB.belongsTo(UsuarioCoreDB, { foreignKey: 'usuario_id', as: 'usuario' });

// Exports para facilitar uso em toda aplicação
module.exports = {
  sequelizeCoreDB,
  sequelizeBackups,
  // CoreDB Models
  UserCoreDB,
  UsuarioCoreDB,
  InvoiceCoreDB,
  ActivationCoreDB,
  SmsStringCoreDB,
  // Backups Models
  ActivationBackups,
  SmsStringBackups,
};
