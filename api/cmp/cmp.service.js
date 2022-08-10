const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')

async function query() {
  try {
    logger.debug('Getting cmps')
    const collection = await dbService.getCollection('cmp')
    // console.log(collection)
    var cmps = await collection.find().toArray()
    return cmps
  } catch (err) {
    logger.error('cannot find cmps', err)
    throw err
  }
}

module.exports = {
  query,
}
