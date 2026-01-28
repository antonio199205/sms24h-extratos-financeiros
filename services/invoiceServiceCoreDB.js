const { InvoiceCoreDB, UserCoreDB } = require('../config/models');

class InvoiceServiceCoreDB {
  // Buscar últimos invoices
  async getLatestInvoices(limit = 10) {
    try {
      return await InvoiceCoreDB.findAll({
        order: [['createdAt', 'DESC']],
        limit,
      });
    } catch (error) {
      console.error('Erro ao buscar invoices do coredb:', error);
      throw error;
    }
  }

  // Buscar últimos invoices com paginação
  async getLatestInvoicesWithPagination(limit = 10, offset = 0) {
    try {
      const { count, rows } = await InvoiceCoreDB.findAndCountAll({
        order: [['createdAt', 'DESC']],
        limit,
        offset,
      });

      return {
        invoices: rows,
        total: count,
      };
    } catch (error) {
      console.error('Erro ao buscar invoices com paginação no coredb:', error);
      throw error;
    }
  }

  // Buscar invoice por ID
  async getInvoiceById(id) {
    try {
      return await InvoiceCoreDB.findByPk(id);
    } catch (error) {
      console.error('Erro ao buscar invoice por ID no coredb:', error);
      throw error;
    }
  }

  // Buscar invoices por email
  async getInvoicesByEmail(email) {
    try {
      return await InvoiceCoreDB.findAll({
        where: { email },
        order: [['createdAt', 'DESC']],
      });
    } catch (error) {
      console.error('Erro ao buscar invoices por email no coredb:', error);
      throw error;
    }
  }

  async getInvoiceByTxId(txId) {
    try {
      return await InvoiceCoreDB.findOne({
        where: { invoice_gateway_id: txId },
      });
    } catch (error) {
      console.error('Erro ao buscar invoice por TxID no coredb:', error);
      throw error;
    }
  }
  // Buscar invoices por usuario_id
  async getInvoicesByUserId(userId) {
    try {
      return await InvoiceCoreDB.findAll({
        where: { usuario_id: userId },
        order: [['createdAt', 'DESC']],
      });
    } catch (error) {
      console.error('Erro ao buscar invoices por usuario_id no coredb:', error);
      throw error;
    }
  }

  // Buscar invoices por ID ou email (para pesquisa)
  // Buscar invoices por ID ou email (para pesquisa)
    async searchInvoicesByUsuarioId(usuario_id) {
      try {
        const { Op } = require('sequelize');
        return await InvoiceCoreDB.findAll({
          where: {
            usuario_id
          },
          order: [['createdAt', 'DESC']],
        });
      } catch (error) {
        console.error('Erro ao pesquisar invoices no backups:', error);
        throw error;
      }
    }

  // Buscar invoices por data com paginação
  async getInvoicesByDateWithPagination(filterDate, limit = 10, offset = 0) {
    try {
      const { Op } = require('sequelize');
      // Converter a data do filtro para strings de comparação em UTC-3
      const startDate = `${filterDate} 00:00:00`;
      const endDate = `${filterDate} 23:59:59`;

      const { count, rows } = await InvoiceCoreDB.findAndCountAll({
        where: {
          createdAt: {
            [Op.gte]: startDate,
            [Op.lte]: endDate,
          },
        },
        order: [['createdAt', 'DESC']],
        limit,
        offset,
      });

      return {
        invoices: rows,
        total: count,
      };
    } catch (error) {
      console.error('Erro ao buscar invoices por data no coredb:', error);
      throw error;
    }
  }
}

module.exports = new InvoiceServiceCoreDB();
