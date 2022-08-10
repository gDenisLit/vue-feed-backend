const express = require('express')
const { log } = require('../../middlewares/logger.middleware')
const { getFeeds, addFeed} = require('./feed.controller')
const router = express.Router()

router.get('/', log, getFeeds)
router.post('/', log, addFeed)

module.exports = router