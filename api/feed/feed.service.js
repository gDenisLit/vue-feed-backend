const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId
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

async function getById(feedId) {
    try {
        const collection = await dbService.getCollection('feed')
        const feed = collection.findOne({ _id: ObjectId(feedId) })
        return feed
    } catch (err) {
        logger.error(`while finding feed ${feedId}`, err)
        throw err
    }
}

async function remove(feedId) {
    try {
        const collection = await dbService.getCollection('feed')
        await collection.deleteOne({ _id: ObjectId(feedId) })
        return feedId
    } catch (err) {
        logger.error(`cannot remove feed ${feedId}`, err)
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
async function update(feed) {
    try {
        var id = ObjectId(feed._id)
        delete feed._id
        const collection = await dbService.getCollection('feed')
        await collection.updateOne({ _id: id }, { $set: { ...feed } })
        console.log('updated feed', feed)
        return feed
    } catch (err) {
        logger.error(`cannot update feed ${feedId}`, err)
        throw err
    }
}

module.exports = {
    remove,
    query,
    getById,
    add,
    update,
}

function _buildCriteria(filterBy = {}) {
    const criteria = {}
    if (filterBy?.txt) {
        criteria['$or'] = [
            {name: { $regex: filterBy.txt, $options: 'i' }},
            {email: { $regex: filterBy.txt, $options: 'i' }},
            {txt: { $regex: filterBy.txt, $options: 'i' }}
        ]
    }
    return criteria
}

