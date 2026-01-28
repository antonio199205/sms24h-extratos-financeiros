const { ActivationCoreDB, UsuarioCoreDB } = require('../config/models');

class ActivationServiceCoreDB {
  // Buscar activations por usuario_id usando api_key
  async getActivationsByUserId(usuarioId) {
    try {
      // Buscar o usuário para obter a api_key
      const usuario = await UsuarioCoreDB.findByPk(usuarioId);
      
      if (!usuario || !usuario.api_key) {
        return [];
      }

      // Buscar activations usando a api_key do usuário
      return await ActivationCoreDB.findAll({
        where: { api_key: usuario.api_key },
        order: [['initial_time', 'DESC']],
      });
    } catch (error) {
      console.error('Erro ao buscar activations do coredb:', error);
      throw error;
    }
  }

  // Buscar activations por api_key
  async getActivationsByApiKey(apiKey) {
    try {
      return await ActivationCoreDB.findAll({
        where: { api_key: apiKey },
        order: [['initial_time', 'DESC']],
      });
    } catch (error) {
      console.error('Erro ao buscar activations por api_key no coredb:', error);
      throw error;
    }
  }

}

module.exports = new ActivationServiceCoreDB();
