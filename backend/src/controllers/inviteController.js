const { InviteCode } = require('../models');
const { v4: uuidv4 } = require('uuid');

// Generar código único BM-XXXXXXXX
const generateCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `BM-${code}`;
};

// POST /api/invites/create — Crear código (solo superadmin)
const createInvite = async (req, res) => {
  try {
    const { note } = req.body;
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const invite = await InviteCode.create({
      code,
      status: 'active',
      expiresAt,
      usedBy: req.user.id
    });

    res.status(201).json({
      success: true,
      invite: {
        code: invite.code,
        status: invite.status,
        expiresAt: invite.expiresAt,
        note: note || '',
        createdByName: req.user.name,
        createdAt: invite.createdAt
      }
    });
  } catch (error) {
    console.error('Error creating invite:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

// GET /api/invites — Listar códigos (solo superadmin)
const getInvites = async (req, res) => {
  try {
    const invites = await InviteCode.findAll({
      order: [['createdAt', 'DESC']]
    });

    const formatted = invites.map(inv => ({
      code: inv.code,
      status: inv.status,
      expiresAt: inv.expiresAt,
      used: inv.status === 'used',
      usedBy: inv.usedBy || null,
      usedAt: inv.usedAt || null,
      createdAt: inv.createdAt
    }));

    res.json({ success: true, count: formatted.length, invites: formatted });
  } catch (error) {
    console.error('Error getting invites:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

// DELETE /api/invites/:code — Marcar como expirado (solo superadmin)
const deleteInvite = async (req, res) => {
  try {
    const { code } = req.params;
    const invite = await InviteCode.findOne({ where: { code } });

    if (!invite) {
      return res.status(404).json({ success: false, error: 'Código no encontrado' });
    }

    invite.status = 'expired';
    await invite.save();

    res.json({ success: true, message: 'Código cancelado exitosamente' });
  } catch (error) {
    console.error('Error deleting invite:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

// POST /api/invites/validate — Validar código (público)
const validateInvite = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, error: 'Código requerido' });
    }

    const invite = await InviteCode.findOne({
      where: { code: code.toUpperCase(), status: 'active' }
    });

    if (!invite) {
      return res.json({ success: true, valid: false, message: 'Código inválido' });
    }

    if (new Date(invite.expiresAt) < new Date()) {
      invite.status = 'expired';
      await invite.save();
      return res.json({ success: true, valid: false, message: 'Código expirado' });
    }

    res.json({ success: true, valid: true, message: 'Código válido' });
  } catch (error) {
    console.error('Error validating invite:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

module.exports = { createInvite, getInvites, deleteInvite, validateInvite };