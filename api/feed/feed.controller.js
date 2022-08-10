const feedService = require('./feed.service.js')
const logger = require('../../services/logger.service')

async function getFeeds(req, res) {
  try {
    logger.debug('Getting feeds')
    var queryParams = req.query
    const feeds = await feedService.query(queryParams)
    res.json(feeds)
  } catch (err) {
    logger.error('Failed to get feeds', err)
    res.status(500).send({ err: 'Failed to get feeds' })
  }
}

async function addFeed(req, res) {
  try {
    const feed = req.body
    const addedFeed = await feedService.add(feed)
    res.json(addedFeed)
  } catch (err) {
    logger.error('Failed to add feed', err)
    res.status(500).send({ err: 'Failed to add feed' })
  }
}

module.exports = {
  getFeeds: getFeeds,
  addFeed: addFeed,
}
