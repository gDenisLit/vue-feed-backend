const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getItems, getItemById, addItem, updateItem, removeItem, addReview } = require('./item.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getItems)
router.get('/:id', getItemById)
router.post('/', requireAuth, requireAdmin, addItem)
router.put('/:id', requireAuth, requireAdmin, updateItem)
router.delete('/:id', requireAuth, requireAdmin, removeItem)

module.exports = router