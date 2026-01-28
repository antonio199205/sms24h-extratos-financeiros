// Model para sms_string_models
const createSmsStringModel = (sequelize) => {
  return sequelize.define('sms_string_models', {
    activation_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: false,
    },
    sms_string_models: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  }, {
    tableName: 'sms_string_models',
    timestamps: false,
  });
};
const { DataTypes } = require('sequelize');

// Factory para criar models iguais em ambos databases
const createUserModel = (sequelize) => {
  return sequelize.define('usuarios_financeiro', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    nome: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW,
    },
  }, {
    tableName: 'usuarios_financeiro',
    timestamps: false,
  });
};

// Model Usuario (apenas em coredb)
const createUsuarioModel = (sequelize) => {
  return sequelize.define('usuario', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      columnName: 'id',
    },
    dtype: {
      type: DataTypes.STRING(31),
      allowNull: false,
      defaultValue: 'Usuario',
      columnName: 'dtype',
    },
    api_key: {
      type: DataTypes.STRING(255),
      allowNull: true,
      columnName: 'api_key',
    },
    nextFacecheck: {
      type: DataTypes.DATE,
      allowNull: true,
      columnName: 'nextFacecheck',
    },
    blocked: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      columnName: 'blocked',
    },
    perfil: {
      type: DataTypes.STRING(255),
      allowNull: true,
      columnName: 'perfil',
    },
    cpf: {
      type: DataTypes.STRING(255),
      allowNull: true,
      columnName: 'cpf',
    },
    credito: {
      type: DataTypes.DECIMAL(38, 2),
      allowNull: true,
      columnName: 'credito',
    },
    email: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: true,
      columnName: 'email',
    },
    nome: {
      type: DataTypes.STRING(255),
      allowNull: true,
      columnName: 'nome',
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      columnName: 'created_at',
    },
    last_update: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW,
      columnName: 'last_update',
    },
    validateType: {
      type: DataTypes.STRING(255),
      allowNull: true,
      columnName: 'validateType',
    },
    senha: {
      type: DataTypes.STRING(255),
      allowNull: true,
      columnName: 'senha',
    },
    tkp: {
      type: DataTypes.STRING(255),
      allowNull: true,
      columnName: 'tkp',
    },
    tempp: {
      type: DataTypes.STRING(255),
      allowNull: true,
      columnName: 'tempp',
    },
    validate: {
      type: DataTypes.TEXT,
      allowNull: true,
      columnName: 'validate',
    },
    token_validation: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
      columnName: 'token_validation',
    },
    lastMailSent: {
      type: DataTypes.DATE,
      allowNull: true,
      columnName: 'lastMailSent',
    },
    country: {
      type: DataTypes.STRING(255),
      allowNull: true,
      columnName: 'country',
    },
    operator: {
      type: DataTypes.STRING(255),
      allowNull: true,
      columnName: 'operator',
    },
    whatsapp_enabled: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      columnName: 'whatsapp_enabled',
    },
    tipo_de_api: {
      type: DataTypes.STRING(45),
      defaultValue: 'PADRAO',
      columnName: 'tipo_de_api',
    },
    agente: {
      type: DataTypes.STRING(255),
      allowNull: true,
      columnName: 'agente',
    },
    callback_apiv2_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      columnName: 'callback_apiv2_id',
    },
    agente_porcentagem_pagamento: {
      type: DataTypes.FLOAT,
      defaultValue: 100,
      columnName: 'agente_porcentagem_pagamento',
    },
    api_key_dev: {
      type: DataTypes.STRING(255),
      allowNull: true,
      columnName: 'api_key_dev',
    },
    enabled: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      columnName: 'enabled',
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: true,
      columnName: 'username',
    },
  }, {
    tableName: 'usuario',
    timestamps: false,
    underscored: false,
  });
};

const createInvoiceModel = (sequelize) => {
  return sequelize.define('recarga_invoice', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    pago: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    data_pagamento: {
      type: DataTypes.DATE,
      allowNull: true,
      columnName: 'data_pagamento',
    },
    data_expira: {
      type: DataTypes.DATE,
      allowNull: true,
      columnName: 'data_expira',
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      columnName: 'usuario_id',
    },
    valor: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    invoice_gateway_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
      columnName: 'invoice_gateway_id',
    },
    metodo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      columnName: 'metodo_id',
    },
    gateway: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    qr_text: {
      type: DataTypes.STRING(5255),
      allowNull: true,
      columnName: 'qr_text',
    },
    qrcode: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    metodoNome: {
      type: DataTypes.STRING(45),
      allowNull: true,
      columnName: 'metodoNome',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      columnName: 'createdAt',
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      columnName: 'updatedAt',
    },
  }, {
    tableName: 'recarga_invoice',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    underscored: false,
  });
};

const createActivationModel = (sequelize, SmsStringModel) => {
  const Activation = sequelize.define('activation', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    hook_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      columnName: 'hook_id',
    },
    alias_service: {
      type: DataTypes.STRING(255),
      allowNull: true,
      columnName: 'alias_service',
    },
    service_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
      columnName: 'service_name',
    },
    chip_number: {
      type: DataTypes.STRING(255),
      allowNull: true,
      columnName: 'chip_number',
    },
    service_price: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: true,
      columnName: 'service_price',
    },
    initial_time: {
      type: DataTypes.DATE,
      allowNull: true,
      columnName: 'initial_time',
    },
    api_key: {
      type: DataTypes.STRING(255),
      allowNull: true,
      columnName: 'api_key',
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      columnName: 'status',
    },
    status_buz: {
      type: DataTypes.INTEGER,
      allowNull: true,
      columnName: 'status_buz',
    },
    version: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      columnName: 'version',
    },
    visible: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      columnName: 'visible',
    },
    received_to_finish_time: {
      type: DataTypes.STRING(20),
      allowNull: true,
      columnName: 'received_to_finish_time',
    },
    needed_sms_to_finalize: {
      type: DataTypes.INTEGER,
      allowNull: true,
      columnName: 'needed_sms_to_finalize',
    },
    service_number: {
      type: DataTypes.STRING(255),
      allowNull: true,
      columnName: 'service_number',
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: true,
      columnName: 'end_time',
    },
  }, {
    tableName: 'activation',
    timestamps: false,
    underscored: false,
  });

  // Relacionamento: Activation tem muitos SmsString
  if (SmsStringModel) {
    Activation.hasMany(SmsStringModel, { foreignKey: 'activation_id', as: 'sms_strings' });
    // Campo virtual para o último sms_code
    Activation.prototype.getLastSmsCode = async function() {
      const last = await SmsStringModel.findOne({
        where: { activation_id: this.id },
        order: [['id', 'DESC']],
      });
      console.log('Last SMS String Model for id ' + this.id + ':', last?.sms_string_models);
      return last ? last.sms_string_models : null;
    };
  }
  return Activation;
};

module.exports = {
  createUserModel,
  createUsuarioModel,
  createInvoiceModel,
  createActivationModel,
  createSmsStringModel,
};
