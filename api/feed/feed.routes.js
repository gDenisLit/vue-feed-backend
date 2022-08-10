const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getfeeds, getfeedById, addfeed, updatefeed, removefeed, addReview } = require('./feed.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getfeeds)
router.get('/:id', log, getfeedById)
router.post('/', log, addfeed)
router.put('/:id', requireAuth, requireAdmin, updatefeed)
router.delete('/:id', requireAuth, requireAdmin, removefeed)

module.exports = router