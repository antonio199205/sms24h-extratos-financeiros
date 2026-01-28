const express = require('express');
const invoiceController = require('../controllers/invoiceController');
const { checkAuthenticated } = require('../middleware/auth');

const router = express.Router();

// Rotas de invoices
router.get('/', checkAuthenticated, invoiceController.dashboard);
router.get('/search', invoiceController.search);
// router.get('/search', checkAuthenticated, invoiceController.search);
router.get('/invoice/:id', checkAuthenticated, invoiceController.invoiceDetails);

module.exports = router;
