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

  // Buscar activations por número de telefone
  async getActivationsByNumber(numero) {
    try {
      return await ActivationCoreDB.findAll({
        where: { chip_number: numero },
        order: [['initial_time', 'DESC']],
      });
    } catch (error) {
      console.error('Erro ao buscar activations por número no coredb:', error);
      throw error;
    }
  }

  // Buscar activations por api_key com paginação
  async getActivationsByApiKeyPaginated(apiKey, limit = 20, offset = 0) {
    try {
      const { count, rows } = await ActivationCoreDB.findAndCountAll({
        where: { api_key: apiKey },
        order: [['initial_time', 'DESC']],
        limit,
        offset,
      });
      return { activations: rows, total: count };
    } catch (error) {
      console.error('Erro ao buscar activations paginadas por api_key no coredb:', error);
      throw error;
    }
  }

  // Contar activations por api_key
  async countActivationsByApiKey(apiKey) {
    try {
      const count = await ActivationCoreDB.count({
        where: { api_key: apiKey }
      });
      return count;
    } catch (error) {
      console.error('Erro ao contar activations por api_key no coredb:', error);
      throw error;
    }
  }

}

module.exports = new ActivationServiceCoreDB();
