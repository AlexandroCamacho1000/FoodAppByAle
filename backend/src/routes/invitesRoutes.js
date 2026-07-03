const express = require('express');
const router = express.Router();
const { authMiddleware, isSuperAdmin } = require('../middleware/auth');
const inviteController = require('../controllers/inviteController');

router.post('/validate', inviteController.validateInvite);

router.post('/create', authMiddleware, isSuperAdmin, inviteController.createInvite);
router.get('/', authMiddleware, isSuperAdmin, inviteController.getInvites);
router.delete('/:code', authMiddleware, isSuperAdmin, inviteController.deleteInvite);

module.exports = router;