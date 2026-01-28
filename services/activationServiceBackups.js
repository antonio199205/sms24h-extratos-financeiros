const { ActivationBackups, UsuarioCoreDB } = require('../config/models');

class ActivationServiceBackups {
  // Buscar activations por usuario_id usando api_key
  async getActivationsByUserId(usuarioId) {
    try {
      // Buscar o usuário para obter a api_key
      const usuario = await UsuarioCoreDB.findByPk(usuarioId);
      
      if (!usuario || !usuario.api_key) {
        return [];
      }

      // Buscar activations usando a api_key do usuário
      return await ActivationBackups.findAll({
        where: { api_key: usuario.api_key },
        order: [['initial_time', 'DESC']],
      });
    } catch (error) {
      console.error('Erro ao buscar activations do backups:', error);
      throw error;
    }
  }

  // Buscar activations por api_key
  async getActivationsByApiKey(apiKey) {
    try {
      return await ActivationBackups.findAll({
        where: { api_key: apiKey },
        order: [['initial_time', 'DESC']],
      });
    } catch (error) {
      console.error('Erro ao buscar activations por api_key no backups:', error);
      throw error;
    }
  }

  // Buscar activations por número de telefone
  async getActivationsByNumber(numero) {
    try {
      return await ActivationBackups.findAll({
        where: { chip_number: numero },
        order: [['initial_time', 'DESC']],
      });
    } catch (error) {
      console.error('Erro ao buscar activations por número no backups:', error);
      throw error;
    }
  }

}

module.exports = new ActivationServiceBackups();
