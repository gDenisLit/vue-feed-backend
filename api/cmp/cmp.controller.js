const logger = require('../../services/logger.service')
const userService = require('../user/user.service')
const authService = require('../auth/auth.service')
const socketService = require('../../services/socket.service')
const cmpService = require('./cmp.service')

async function getCmps(req, res) {
  try {
    logger.debug('Getting Cmp')
    const cmps = await cmpService.query()
    // console.log('my cmps!', cmps)
    res.json(cmps)
    // console.log('res.json(cmps)',res.json(cmps));
  } catch (err) {
    logger.error('Failed to get Cmpsssss', err)
    res.status(500).send({ err: 'Failed to get Cmpsssss' })
  }
}

module.exports = {
  getCmps,
}
