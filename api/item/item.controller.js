const itemService = require('./item.service.js')
const logger = require('../../services/logger.service')

// GET LIST
async function getItems(req, res) {
  try {
    logger.debug('Getting items')
    var queryParams = req.query
    const items = await itemService.query()
    res.json(items)
  } catch (err) {
    logger.error('Failed to get items', err)
    res.status(500).send({ err: 'Failed to get items' })
  }
}

// GET BY ID 
async function getItemById(req, res) {
  try {
    const itemId = req.params.id
    const item = await itemService.getById(itemId)
    res.json(item)
  } catch (err) {
    logger.error('Failed to get item', err)
    res.status(500).send({ err: 'Failed to get item' })
  }
}

// POST (add item)
async function addItem(req, res) {
  try {
    const item = req.body
    const addeditem = await itemService.add(item)
    res.json(addeditem)
  } catch (err) {
    logger.error('Failed to add item', err)
    res.status(500).send({ err: 'Failed to add item' })
  }
}

// PUT (Update item)
async function updateItem(req, res) {
  try {
    const item = req.body
    const updateditem = await itemService.update(item)
    res.json(updateditem)
  } catch (err) {
    logger.error('Failed to update item', err)
    res.status(500).send({ err: 'Failed to update item' })
  }
}

// DELETE (Remove item)
async function removeItem(req, res) {
  try {
    const itemId = req.params.id
    await itemService.remove(itemId)
    res.send('Removed')
  } catch (err) {
    logger.error('Failed to remove item', err)
    res.status(500).send({ err: 'Failed to remove item' })
  }
}

module.exports = {
  getItems: getItems,
  getItemById: getItemById,
  addItem: addItem,
  updateItem: updateItem,
  removeItem: removeItem
}
