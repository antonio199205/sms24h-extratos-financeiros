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
}

module.exports = new UsuarioService();
