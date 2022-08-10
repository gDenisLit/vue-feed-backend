const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const { updateWap } = require('./wap.controller')
const ObjectId = require('mongodb').ObjectId

async function query(filterBy) {
  try {
    // console.log('fitlerBy', filterBy)
    const criteria = _buildCriteria(filterBy)
    // console.log('criteria:', criteria)
    const collection = await dbService.getCollection('wap')
    var waps = await collection.find(criteria).toArray()
    // console.log(waps)
    return waps
  } catch (err) {
    logger.error('cannot find waps', err)
    throw err
  }
}

async function getById(wapId) {
  try {
    const collection = await dbService.getCollection('wap')
    const wap = await collection.findOne({ _id: ObjectId(wapId) })
    if (!wap.weeklyViews) wap.weeklyViews = [0, 0, 0, 0, 0, 0, 0]
    if (!wap.totalViews) wap.totalViews = 0
    const day = new Date().getDay()
    wap.totalViews++
    wap.weeklyViews[day]++
    const updatedWap = await update(wap)
    return updatedWap
  } catch (err) {
    logger.error(`while finding wap ${wapId}`, err)
    throw err
  }
}

async function remove(wapId) {
  try {
    const collection = await dbService.getCollection('wap')
    await collection.deleteOne({ _id: ObjectId(wapId) })
    return wapId
  } catch (err) {
    logger.error(`cannot remove wap ${wapId}`, err)
    throw err
  }
}

async function add(wap) {
  try {
    wap.createdAt = new Date()
    const collection = await dbService.getCollection('wap')
    const { insertedId } = await collection.insertOne(wap)
    wap._id = insertedId
    return wap
  } catch (err) {
    logger.error('cannot insert wap', err)
    throw err
  }
}

async function update(wap) {
  try {
    var id = ObjectId(wap._id)
    delete wap._id
    const collection = await dbService.getCollection('wap')
    await collection.updateOne({ _id: id }, { $set: { ...wap } })
    wap._id = id
    return wap
  } catch (err) {
    logger.error(`cannot update wap ${wap._id}`, err)
    throw err
  }
}

async function updateCmp(wapId, cmp) {
  try {
    logger.debug('Updating Cmp, service')
    // console.log(wapId, cmp)
    // find wap
    const collection = await dbService.getCollection('wap')
    const wap = await collection.findOne({ _id: ObjectId(wapId) })
    console.log('SEMEK ARSE')
    // console.log(wap)
    // find and update cmp
    let idx = wap.cmps.findIndex(currCmp => currCmp.id === cmp.id)

    // -1 means the cmp lives inside a wap container
    if (idx === -1) {
      // wap-nav is inside header if not stand alone
      if (cmp.type === 'wap-nav') {
        const wapHeader = wap.cmps.find(
          currCmp => currCmp.type === 'wap-header'
        )
        wapHeader.info.nav = cmp
        idx = wap.cmps.findIndex(cmp => cmp.id === wapHeader.id)
        cmp = wapHeader
      } else {
        // find the the container
        const wapContainer = wap.cmps
          .filter(currCmp => currCmp.type === 'wap-container')
          .find(currCmp =>
            currCmp.info.cmps.some(currCmp => currCmp.id === cmp.id)
          )
        // find the cmp idx
        const innerIdx = wapContainer.info.cmps.findIndex(
          cmp => cmp.id === cmp.id
        )
        wapContainer.info.cmps.splice(innerIdx, 1, cmp)
        idx = wap.cmps.findIndex(cmp => cmp.id === wapContainer.id)
        cmp = wapContainer
      }
    }

    // Update wap
    wap.cmps.splice(idx, 1, cmp)

    // Update wap in collection
    let id = ObjectId(wap._id)
    delete wap._id
    await collection.updateOne({ _id: id }, { $set: { ...wap } })
    wap._id = id

    return cmp
  } catch (err) {
    logger.error(`cannot update cmp in wap ${wap._id}`, err)
    throw err
  }
}

async function removeCmp(wapId, cmpId) {
  // find wap
  const collection = await dbService.getCollection('wap')
  const wap = await collection.findOne({ _id: ObjectId(wapId) })

  // find and remove cmp
  let idx = wap.cmps.findIndex(cmp => cmp.id === cmpId)
  wap.cmps.splice(idx, 1)

  // Update wap in collection
  let id = ObjectId(wap._id)
  delete wap._id
  await collection.updateOne({ _id: id }, { $set: { ...wap } })
  wap._id = id
}

module.exports = {
  remove,
  query,
  getById,
  add,
  update,
  updateCmp,
  removeCmp,
}

function _buildCriteria(
  filterBy = {
    isPublic: undefined,
    userId: '',
    isTemplate: undefined,
    fullname: '',
  }
) {
  const { isPublic, userId, isTemplate, fullname } = filterBy

  const criteria = {}

  if (isPublic !== undefined) {
    criteria.isPublic = true
  }

  if (isTemplate !== undefined) {
    criteria.isTemplate = true
  }

  if (userId) {
    // criteria.createdBy = { _id: userId }
    console.log('userId')
    criteria['createdBy._id'] = userId
  }

  if (fullname) {
    criteria['createdBy.fullname'] = fullname
  }

  return criteria
}
