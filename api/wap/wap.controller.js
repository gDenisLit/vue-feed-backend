const wapService = require('./wap.service.js')
const logger = require('../../services/logger.service')
const userService = require('../user/user.service')
const authService = require('../auth/auth.service')
const { emitTo, broadcast } = require('../../services/socket.service.js')


// GET LIST
async function getWaps(req, res) {
  try {
    logger.debug('Getting Waps')
    // console.log('req.query', req.query)
    var queryParams = req.query
    const waps = await wapService.query(queryParams)
    res.json(waps)
  } catch (err) {
    logger.error('Failed to get waps', err)
    res.status(500).send({ err: 'Failed to get waps' })
  }
}

// GET BY ID
async function getWapById(req, res) {
  try {
    const wapId = req.params.id
    console.log(wapId)
    const wap = await wapService.getById(wapId)
    res.json(wap)
  } catch (err) {
    logger.error('Failed to get wap', err)
    res.status(500).send({ err: 'Failed to get wap' })
  }
}

// POST (add wap)
async function addWap(req, res) {
  try {
    const wap = req.body
    const addedWap = await wapService.add(wap)
    res.json(addedWap)
  } catch (err) {
    logger.error('Failed to add wap', err)
    res.status(500).send({ err: 'Failed to add wap' })
  }
}

// PUT (Update wap)
async function updateWap(req, res) {
  try {
    const wap = req.body

    // const { loginToken } = req.cookies
    // const loggedinUser = authService.validateToken(loginToken)

    // console.log(loggedinUser)

    const updatedWap = await wapService.update(wap)
    // broadcast({
    //   type: 'wap-updated',
    //   data: updatedWap,
    //   userId: loggedinUser._id,
    // })
    // console.log(updatedWap)
    logger.debug('updating wap')
    res.json(updatedWap)
  } catch (err) {
    logger.error('Failed to update wap', err)
    res.status(500).send({ err: 'Failed to update wap' })
  }
}

// DELETE (Remove wap)
async function removeWap(req, res) {
  try {
    const wapId = req.params.id
    await wapService.remove(wapId)
    // broadcast({'removedWap'})
    res.send('Removed')
  } catch (err) {
    logger.error('Failed to remove wap', err)
    res.status(500).send({ err: 'Failed to remove wap' })
  }
}

// Update cmp inside wap
async function updateCmp(req, res) {
  try {
    let { cmp, wapId } = req.body
    // console.log(req.body)
    // cmp = JSON.parse(cmp)
    // console.log(cmp, wapId)

    // logger.debug('getting login tokin')
    // console.log(loginToken)
    // console.log(loggedinUser)
    // const { loginToken } = req.cookies
    // const loggedinUser = authService.validateToken(loginToken)

    const updatedCmp = await wapService.updateCmp(wapId, cmp)
    // broadcast({
    //   type: 'cmp-updated',
    //   data: updatedCmp,
    //   userId: loggedinUser._id,
    // })

    // console.log(updatedCmp)
    res.json(updatedCmp)
  } catch (err) {
    logger.error('Failed to update cmp', err)
    res.status(500).send({ err: 'Failed to update cmp' })
  }
}

// Remove cmp inside wap
async function removeCmp(req, res) {
  try {
    const wapId = req.params.id
    console.log(wapId)
    const { cmpId } = req.body
    // console.log(req.body)
    // console.log(cmpId)
    logger.debug('removing cmp')
    // const { loginToken } = req.cookies
    // const loggedinUser = authService.validateToken(loginToken)

    await wapService.removeCmp(wapId, cmpId)

    // broadcast({ type: 'cmp-removed', data: cmpId, userId: loggedinUser._id })

    res.send('removed')
  } catch (err) {
    logger.error('Failed to remove cmp', err)
    res.status(500).send({ err: 'Failed to remove cmp' })
  }
}
module.exports = {
  getWaps,
  getWapById,
  addWap,
  updateWap,
  removeWap,
  updateCmp,
  removeCmp,
}
