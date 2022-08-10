const feedService = require('./feed.service.js')
const logger = require('../../services/logger.service')

// GET LIST
async function getfeeds(req, res) {
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

// GET BY ID 
async function getfeedById(req, res) {
  try {
    const feedId = req.params.id
    const feed = await feedService.getById(feedId)
    res.json(feed)
  } catch (err) {
    logger.error('Failed to get feed', err)
    res.status(500).send({ err: 'Failed to get feed' })
  }
}

// POST (add feed)
async function addfeed(req, res) {
  try {
    const feed = req.body
    const addedfeed = await feedService.add(feed)
    res.json(addedfeed)
  } catch (err) {
    logger.error('Failed to add feed', err)
    res.status(500).send({ err: 'Failed to add feed' })
  }
}

// PUT (Update feed)
async function updatefeed(req, res) {
  try {
    const feed = req.body
    const updatedfeed = await feedService.update(feed)
    res.json(updatedfeed)
  } catch (err) {
    logger.error('Failed to update feed', err)
    res.status(500).send({ err: 'Failed to update feed' })
  }
}

// DELETE (Remove feed)
async function removefeed(req, res) {
  try {
    const feedId = req.params.id
    await feedService.remove(feedId)
    res.send('Removed')
  } catch (err) {
    logger.error('Failed to remove feed', err)
    res.status(500).send({ err: 'Failed to remove feed' })
  }
}

module.exports = {
  getfeeds: getfeeds,
  getfeedById: getfeedById,
  addfeed: addfeed,
  updatefeed: updatefeed,
  removefeed: removefeed
}
