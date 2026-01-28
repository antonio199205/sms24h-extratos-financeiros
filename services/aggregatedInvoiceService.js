const invoiceServiceCoreDB = require('./invoiceServiceCoreDB');
const activationServiceCoreDB = require('./activationServiceCoreDB');
const activationServiceBackups = require('./activationServiceBackups');

class AggregatedInvoiceService {
  // Buscar invoices (apenas coredb)
  async searchInvoicesByUsuarioId(usuario_id) {
    try {
       const invoicesCoreDb = await invoiceServiceCoreDB.searchInvoicesByUsuarioId(usuario_id);

      return invoicesCoreDb;
    } catch (error) {
      console.error('Erro ao pesquisar invoices:', error);
      throw error;
    }
  }

  // Buscar últimos invoices (apenas coredb)
  async getLatestInvoices(limit = 10) {
    try {
      return await invoiceServiceCoreDB.getLatestInvoices(limit);
    } catch (error) {
      console.error('Erro ao buscar últimos invoices:', error);
      throw error;
    }
  }

  // Buscar últimos invoices com paginação
  async getLatestInvoicesWithPagination(limit = 10, offset = 0) {
    try {
      return await invoiceServiceCoreDB.getLatestInvoicesWithPagination(limit, offset);
    } catch (error) {
      console.error('Erro ao buscar invoices com paginação:', error);
      throw error;
    }
  }

  // Buscar invoices por data com paginação
  async getInvoicesByDateWithPagination(filterDate, limit = 10, offset = 0) {
    try {
      return await invoiceServiceCoreDB.getInvoicesByDateWithPagination(filterDate, limit, offset);
    } catch (error) {
      console.error('Erro ao buscar invoices por data:', error);
      throw error;
    }
  }

async getInvoiceByTxId(txId) {
    try {
      return await invoiceServiceCoreDB.getInvoiceByTxId(txId);
    } catch (error) {
      console.error('Erro ao buscar invoice por TxID:', error);
      throw error;
    }
  }
  // Buscar um invoice por ID
  async getInvoiceById(invoiceId) {
    try {
      return await invoiceServiceCoreDB.getInvoiceById(invoiceId);
    } catch (error) {
      console.error('Erro ao buscar invoice por ID:', error);
      throw error;
    }
  }
  async getActivationsByApiKey(apiKey) {
    try {
      const [activationsCoreDB, activationsBackups] = await Promise.all([
        activationServiceCoreDB.getActivationsByApiKey(apiKey),
        activationServiceBackups.getActivationsByApiKey(apiKey),
      ]);

      return [...activationsCoreDB, ...activationsBackups];
    } catch (error) {
      console.error('Erro ao buscar activations agregadas por usuarioId:', error);
      throw error;
    }
  }
  
  // Buscar activations por número de telefone
  async getActivationsByNumber(numero) {
    try {
      return await activationServiceCoreDB.getActivationsByNumber(numero);
    } catch (error) {
      console.error('Erro ao buscar activations por número (CoreDB):', error);
      throw error;
    }
  }

  async getActivationsByNumberBackup(numero) {
    try {
      return await activationServiceBackups.getActivationsByNumber(numero);
    } catch (error) {
      console.error('Erro ao buscar activations por número (Backups):', error);
      throw error;
    }
  }

  // Buscar recargas do usuário por ID
  async getRecargasByUsuarioId(usuarioId, limit = 10) {
    try {
      return await invoiceServiceCoreDB.getInvoicesByUserId(usuarioId, limit);
    } catch (error) {
      console.error('Erro ao buscar recargas por usuário:', error);
      throw error;
    }
  }

  // Buscar ativações por api_key com paginação (agregando dos dois databases)
  async getActivationsByApiKeyPaginated(apiKey, limit = 20, offset = 0) {
    try {
      // 1. Primeiro, obter contagens totais (sem buscar dados)
      const [countCore, countBackup] = await Promise.all([
        activationServiceCoreDB.countActivationsByApiKey(apiKey),
        activationServiceBackups.countActivationsByApiKey(apiKey),
      ]);
      
      const totalCount = countCore + countBackup;
      
      // 2. Buscar primeiro do CoreDB
      const coreResult = await activationServiceCoreDB.getActivationsByApiKeyPaginated(
        apiKey, 
        limit, 
        offset
      );
      
      let allActivations = [...coreResult.activations];
      
      // 3. Se pegou menos que o limite do CoreDB, buscar do Backup para completar
      if (allActivations.length < limit) {
        const remaining = limit - allActivations.length;
        const backupOffset = Math.max(0, offset - countCore);
        
        const backupResult = await activationServiceBackups.getActivationsByApiKeyPaginated(
          apiKey,
          remaining,
          backupOffset
        );
        
        allActivations = [...allActivations, ...backupResult.activations];
      }
      
      // 4. Ordenar o resultado final por data
      allActivations.sort((a, b) => {
        const dateA = new Date(a.initial_time || a.initial_date);
        const dateB = new Date(b.initial_time || b.initial_date);
        return dateB - dateA;
      });
      
      return {
        activations: allActivations,
        total: totalCount,
      };
    } catch (error) {
      console.error('Erro ao buscar activations paginadas:', error);
      throw error;
    }
  }

  // Buscar um invoice e seus activations dos dois databases
  async getInvoiceDetails(invoiceId) {
    try {
      // Buscar invoice (apenas em coredb)
      const invoice = await invoiceServiceCoreDB.getInvoiceById(invoiceId);

      if (!invoice) {
        return null;
      }

      // Buscar activations do usuario_id em ambos databases
      const [activationsCoreDB, activationsBackups] = await Promise.all([
        activationServiceCoreDB.getActivationsByUserId(invoice.usuario_id),
        activationServiceBackups.getActivationsByUserId(invoice.usuario_id),
      ]);

      const activations = [...activationsCoreDB, ...activationsBackups];
      activations.sort((a, b) => new Date(b.data_ativacao) - new Date(a.data_ativacao));

      return {
        invoice,
        activations,
      };
    } catch (error) {
      console.error('Erro ao buscar detalhes do invoice:', error);
      throw error;
    }
  }
}

module.exports = new AggregatedInvoiceService();
