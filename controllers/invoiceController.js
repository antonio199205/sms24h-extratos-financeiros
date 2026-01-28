const aggregatedInvoiceService = require('../services/aggregatedInvoiceService');
const usuarioService = require('../services/usuarioServiceCoreDB');
const moment = require('moment-timezone');

// Helper para formatar data com moment.js
const formatDate = (dateString) => {
  if (!dateString) return '-';
  return moment(dateString).tz('America/Sao_Paulo').format('DD/MM/YYYY HH:mm:ss');
};

function groupAtivacoesIntoInvoicesByDate(input) {
  function toMs(d) {
    if (!d) return null;
    var ms = Date.parse(d);
    return Number.isFinite(ms) ? ms : null;
  }

  // 1) Invoices válidas e ordenadas
  var invoicesSorted = (input.invoices || [])
    .map(function (inv) {
      var dateMs = toMs(inv.sortDate || inv.data_pagamento);
      var copy = Object.assign({}, inv);
      copy._dateMs = dateMs;
      return copy;
    })
    .filter(function (inv) {
      return inv._dateMs !== null;
    })
    .sort(function (a, b) {
      return a._dateMs - b._dateMs;
    });

  // 2) Ativações válidas e ordenadas
  var ativacoesSorted = (input.ativacoes || [])
    .map(function (a) {
      var dateMs = toMs(a.initial_date || a.initial_time || a.sortDate);
      var copy = Object.assign({}, a);
      copy._dateMs = dateMs;
      return copy;
    })
    .filter(function (a) {
      return a._dateMs !== null;
    })
    .sort(function (a, b) {
      return a._dateMs - b._dateMs;
    });

  // 3) Buckets por invoice
  var buckets = invoicesSorted.map(function (inv, idx) {
    var out = Object.assign({}, inv);
    out.ativacoes = [];
    out.windowStart = new Date(inv._dateMs).toISOString();
    out.windowEnd =
      idx < invoicesSorted.length - 1
        ? new Date(invoicesSorted[idx + 1]._dateMs).toISOString()
        : null;
    return out;
  });

  if (buckets.length === 0) {
    return {
      usuario: input.usuario,
      invoices: [],
      ativacoesSemInvoice: ativacoesSorted.map(function (a) {
        var x = Object.assign({}, a);
        delete x._dateMs;
        return x;
      }),
    };
  }

  // 4) Varre e agrupa: ponteiro de invoice
  var i = 0;

  for (var k = 0; k < ativacoesSorted.length; k++) {
    var act = ativacoesSorted[k];
    var t = act._dateMs;

    // avança enquanto a próxima invoice ainda é <= ativação
    while (i < buckets.length - 1 && buckets[i + 1]._dateMs <= t) {
      i++;
    }

    // antes da primeira invoice -> joga na primeira
    if (t < buckets[0]._dateMs) {
      var a0 = Object.assign({}, act);
      delete a0._dateMs;
      buckets[0].ativacoes.push(a0);
      continue;
    }

    var a1 = Object.assign({}, act);
    delete a1._dateMs;
    buckets[i].ativacoes.push(a1);
  }

  // 5) Limpa campos internos
  var invoicesOut = buckets.map(function (b) {
    var out = Object.assign({}, b);
    delete out._dateMs;
    return out;
  });

  return {
    usuario: input.usuario,
    invoices: invoicesOut,
  };
}

exports.dashboard = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const filterDate = req.query.filterDate || null;
    const limit = 10;
    const offset = (page - 1) * limit;

    let result;
    if (filterDate) {
      result = await aggregatedInvoiceService.getInvoicesByDateWithPagination(filterDate, limit, offset);
    } else {
      result = await aggregatedInvoiceService.getLatestInvoicesWithPagination(limit, offset);
    }
    
    res.render('dashboard', { 
      user: req.user, 
      invoices: {
        data: result.invoices,
        page: page,
        pages: Math.ceil(result.total / limit),
        total: result.total,
        limit: limit,
      },
      filterDate: filterDate,
    });
  } catch (error) {
    console.error('Erro ao carregar dashboard:', error);
    req.flash('error_msg', 'Erro ao carregar invoices');
    res.redirect('/');
  }
};

exports.search = async (req, res) => {
  try {
    const { searchTerm } = req.query;
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return require('moment-timezone')(dateString).tz('America/Sao_Paulo').format('DD/MM/YYYY HH:mm:ss');
      };

    if (!searchTerm || searchTerm.trim() === '') {
      return res.redirect('/');
    }
    let alerta = false;
    let tipo_busca = "CPF"
    let usuario = await usuarioService.getUsuarioByCpf(searchTerm.trim().replaceAll(".","").replaceAll("-",""));
    if(usuario == null){
       const invoice_by_tx = await aggregatedInvoiceService.getInvoiceByTxId(searchTerm.trim());
       if(invoice_by_tx == null){
        return res.render('search-results', { user: req.user,alerta, tipo_busca, usuario:{}, invoices: [], searchTerm, ativacoesSemInvoice: [], formatDate });
       }
       usuario = await usuarioService.getUsuario(invoice_by_tx.usuario_id);
       alerta = true;
       if(usuario == null){
        return res.render('search-results', { user: req.user,alerta, tipo_busca, usuario:{}, invoices: [], searchTerm, ativacoesSemInvoice: [], formatDate });
       }
       tipo_busca = "TX_ID"
    }
    const invoices = await aggregatedInvoiceService.searchInvoicesByUsuarioId(usuario.id);
    const invoices_com_date = invoices.map(invoice => ({
        ...invoice.dataValues,
        sortDate: invoice.data_pagamento,
    }));
    const ativacoes = await aggregatedInvoiceService.getActivationsByApiKey(usuario.api_key);


    const ativacoes_com_date = await Promise.all(ativacoes.map(async (ativacao) => ({
        ...ativacao.dataValues,
        sortDate: ativacao.initial_time,
        last_code: (process.env.NODE_ENV === 'development') ?  undefined : await ativacao.getLastSmsCode(),
    })));
    const invoices_com_ativacoes = groupAtivacoesIntoInvoicesByDate({
      usuario,
      invoices: invoices_com_date,
      ativacoes: ativacoes_com_date,
    });
    // Inverta o array de invoices para exibir do mais recente para o mais antigo
    const invoices_reversed = (invoices_com_ativacoes.invoices || []).slice().reverse();
      // Helper para formatar datas no EJS
      res.render('search-results', { user: req.user,alerta, tipo_busca, usuario, invoices: invoices_reversed, searchTerm, ativacoesSemInvoice: invoices_com_ativacoes.ativacoesSemInvoice || [], formatDate });
  } catch (error) {
    console.error('Erro ao pesquisar:', error);
    return res.send(error)
    req.flash('error_msg', 'Erro ao pesquisar invoices');
    res.redirect('/');
  }
};

exports.invoiceDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await aggregatedInvoiceService.getInvoiceById(parseInt(id));
    const usuario = await usuarioService.getUsuario(invoice.usuario_id);
    if (!invoice) {
      req.flash('error_msg', 'Invoice não encontrado');
      return res.redirect('/');
    }

    res.render('invoice-details', { user: req.user, usuario, invoice, formatDate });
  } catch (error) {
    console.error('Erro ao buscar detalhes do invoice:', error);
    req.flash('error_msg', 'Erro ao buscar detalhes do invoice');
    res.redirect('/');
  }
};
