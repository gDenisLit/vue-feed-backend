const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

async function query(filter) {
    try {
        const criteria = _buildCriteria()
        const collection = await dbService.getCollection('item')
        const items = await collection.find(criteria).toArray()
        return items
    } catch (err) {
        logger.error('cannot find items', err)
        throw err
    }
}

async function getById(itemId) {
    try {
        const collection = await dbService.getCollection('item')
        const item = collection.findOne({ _id: ObjectId(itemId) })
        return item
    } catch (err) {
        logger.error(`while finding item ${itemId}`, err)
        throw err
    }
}

async function remove(itemId) {
    try {
        const collection = await dbService.getCollection('item')
        await collection.deleteOne({ _id: ObjectId(itemId) })
        return itemId
    } catch (err) {
        logger.error(`cannot remove item ${itemId}`, err)
        throw err
    }
}

async function add(item) {
    try {
        const collection = await dbService.getCollection('item')
        item.createdAt = Date.now()
        item.reviews = []
        const addeditem = await collection.insertOne(item)
        return addeditem
    } catch (err) {
        logger.error('cannot insert item', err)
        throw err
    }
}
async function update(item) {
    try {
        var id = ObjectId(item._id)
        delete item._id
        const collection = await dbService.getCollection('item')
        await collection.updateOne({ _id: id }, { $set: { ...item } })
        console.log('updated item', item)
        return item
    } catch (err) {
        logger.error(`cannot update item ${itemId}`, err)
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
    return criteria
}

