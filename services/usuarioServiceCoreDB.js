const { ActivationBackups, UsuarioCoreDB } = require('../config/models');

class UsuarioService {
  // Buscar usuarios (apenas coredb)
  async getUsuario(usuarioId) {
    try {
      const usuario = await UsuarioCoreDB.findByPk(usuarioId);
      
      if (!usuario || !usuario.api_key) {
        return {};
      }
      return usuario
    } catch (error) {
      console.error('Erro ao pesquisar usuarios:', error);
      throw error;
    }
  }

  async getUsuarioByCpf(cpf) { 
    try {
      const usuario = await UsuarioCoreDB.findOne({ where: { cpf } });
      return usuario
    } catch (error) {
      console.error('Erro ao pesquisar usuarios:', error);
      throw error;
    }
  }

  async getUsuarioByApiKey(apiKey) {
    try {
      const usuario = await UsuarioCoreDB.findOne({ where: { api_key: apiKey } });
      return usuario;
    } catch (error) {
      console.error('Erro ao pesquisar usuario por api_key:', error);
      throw error;
    }
  }

  async buscarUsuario(campo, valor) {
    try {
      let whereClause = {};
      
      if (campo === 'email') {
        whereClause = { email: valor.trim() };
      } else if (campo === 'api_key') {
        whereClause = { api_key: valor.trim() };
      } else if (campo === 'cpf') {
        whereClause = { cpf: valor.replaceAll(".","").replaceAll("-","") };
      } else if (campo === 'id') {
        whereClause = { id: parseInt(valor) };
      }

      const usuario = await UsuarioCoreDB.findOne({ where: whereClause });
      return usuario;
    } catch (error) {
      console.error('Erro ao buscar usuario:', error);
      throw error;
    }
  }
}

module.exports = new UsuarioService();
