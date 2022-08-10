const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const md5 = require('md5')

async function query(filter) {
    try {
        const criteria = _buildCriteria(filter)
        const collection = await dbService.getCollection('feed')
        const feeds = await collection.find(criteria).toArray()
        return feeds
    } catch (err) {
        logger.error('cannot find feeds', err)
        throw err
    }
}

async function add(feed) {
    try {
        const collection = await dbService.getCollection('feed')
        feed.createdAt = Date.now()
        feed.imgId = md5(feed.email)
        const { insertedId } = await collection.insertOne(feed)
        feed._id = insertedId
        return feed
    } catch (err) {
        logger.error('cannot insert feed', err)
        throw err
    }
}

module.exports = {
    query,
    add,
}

function _buildCriteria(filterBy = {}) {
    const criteria = {}
    if (filterBy?.txt) {
        criteria['$or'] = [
            { name: { $regex: filterBy.txt, $options: 'i' } },
            { email: { $regex: filterBy.txt, $options: 'i' } },
            { txt: { $regex: filterBy.txt, $options: 'i' } }
        ]
    }
    return criteria
}

