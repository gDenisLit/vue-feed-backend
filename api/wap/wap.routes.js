const express = require('express')
const {
  requireAuth,
  requireAdmin,
} = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const {
  getWaps,
  getWapById,
  addWap,
  updateWap,
  removeWap,
  updateCmp,
  removeCmp,
} = require('./wap.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)
// requireAuth, requireAdmin,
router.get('/', log, getWaps)
router.put('/cmp', log, updateCmp) // wap/cmp
router.delete('/cmp/:id', removeCmp)
router.get('/:id', log, getWapById)
router.post('/', addWap)
router.put('/:id', updateWap)
router.delete('/:id', removeWap)

module.exports = router
