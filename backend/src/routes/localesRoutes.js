const express = require('express');
const router = express.Router();
const localesController = require('../controllers/localesController');

router.get('/:lang', localesController.getLocale);

module.exports = router;