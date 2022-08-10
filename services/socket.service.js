const logger = require('./logger.service')

var gIo = null

function setupSocketAPI(http) {
  gIo = require('socket.io')(http, {
    cors: {
      origin: '*',
    },
  })
  gIo.on('connection', socket => {
    logger.info(`New connected socket [id: ${socket.id}]`)
    socket.on('disconnect', socket => {
      logger.info(`Socket disconnected [id: ${socket.id}]`)
    })

    // When user or guest joins editor
    socket.on('set-editor', editorId => {
      if (socket.currEditor === editorId) return
      if (socket.currEditor) {
        socket.leave(socket.currEditor)
        logger.info(
          `Socket is leaving topic ${socket.currEditor} [id: ${socket.id}]`
        )
      }
      socket.join(editorId)
      socket.currEditor = editorId
    })

    // When one of the users updating wap
    socket.on('wap-updated', wap => {
      logger.info(
        `Wap update from socket [id: ${socket.id}], emitting wap changes to ${socket.currEditor}`
      )
      broadcast({
        type: 'wap-updated',
        data: wap,
        room: socket.currEditor,
        userId: socket.id,
      })
    })

    socket.on('cmp-updated', cmp => {
      logger.info(
        `Cmp update from socket [id: ${socket.id}], emitting cmp changes to ${socket.currEditor}`
      )
      broadcast({
        type: 'cmp-updated',
        data: cmp,
        room: socket.currEditor,
        userId: socket.id,
      })
    })

    socket.on('cmp-removed', cmpId => {
      logger.info(
        `Cmp update from socket [id: ${socket.id}], emitting cmp changes to ${socket.currEditor}`
      )
      broadcast({
        type: 'cmp-removed',
        data: cmpId,
        room: socket.currEditor,
        userId: socket.id,
      })
    })

    socket.on('chat-send-msg', msg => {
      logger.info(
        `New chat msg from socket [id: ${socket.id}], emitting to topic ${socket.currEditor}`
      )
      // emits to all sockets:
      // gIo.emit('chat addMsg', msg)
      // emits only to sockets in the same room
      gIo.to(socket.currEditor).emit('chat-add-msg', msg)
    })
    socket.on('user-watch', userId => {
      logger.info(
        `user-watch from socket [id: ${socket.id}], on user ${userId}`
      )
      socket.join('watching:' + userId)
    })
    socket.on('set-user-socket', userId => {
      logger.info(
        `Setting socket.userId = ${userId} for socket [id: ${socket.id}]`
      )
      socket.userId = userId
    })
    socket.on('unset-user-socket', () => {
      logger.info(`Removing socket.userId for socket [id: ${socket.id}]`)
      delete socket.userId
    })
    socket.on('mouse_activity', data => {
      // console.log(pos)
      // console.log(data)
      const pointer = {
        id: socket.id,
        name: data.username,
        pos: {
          top: data.y + 'px',
          left: data.x + 'px',
        },
      }

      broadcast({
        type: 'all_mouse_activity',
        data: pointer,
        room: socket.currEditor,
        userId: socket.id,
      })

      // socket.broadcast.emit('all_mouse_activity', {
      //   id: socket.id,
      //   name: data.username,
      //   pos: {
      //     top: data.y + 'px',
      //     left: data.x + 'px',
      //   },
      // })
    })
  })
}

function emitTo({ type, data, label }) {
  if (label) gIo.to('watching:' + label).emit(type, data)
  else gIo.emit(type, data)
}

async function emitToUser({ type, data, userId }) {
  const socket = await _getUserSocket(userId)

  if (socket) {
    logger.info(
      `Emiting event: ${type} to user: ${userId} socket [id: ${socket.id}]`
    )
    socket.emit(type, data)
  } else {
    logger.info(`No active socket for user: ${userId}`)
    // _printSockets()
  }
}

// If possible, send to all sockets BUT not the current socket
// Optionally, broadcast to a room / to all
async function broadcast({ type, data, room = null, userId }) {
  // logger.info(`Broadcasting event: ${type}`)

  const excludedSocket = await _getUserSocket(userId)
  if (room && excludedSocket) {
    // logger.info(`Broadcast to room ${room} excluding user: ${userId}`)
    excludedSocket.broadcast.to(room).emit(type, data)
  } else if (excludedSocket) {
    // logger.info(`Broadcast to all excluding user: ${userId}`)
    excludedSocket.broadcast.emit(type, data)
  } else if (room) {
    // logger.info(`Emit to room: ${room}`)
    gIo.to(room).emit(type, data)
  } else {
    // logger.info(`Emit to all`)
    gIo.emit(type, data)
  }
}

async function _getUserSocket(userId) {
  const sockets = await _getAllSockets()
  const socket = sockets.find(s => s.id === userId)
  return socket
}
async function _getAllSockets() {
  // return all Socket instances
  const sockets = await gIo.fetchSockets()
  return sockets
}

async function _printSockets() {
  const sockets = await _getAllSockets()
  console.log(`Sockets: (count: ${sockets.length}):`)
  sockets.forEach(_printSocket)
}
function _printSocket(socket) {
  console.log(`Socket - socketId: ${socket.id} userId: ${socket.userId}`)
}

module.exports = {
  // set up the sockets service and define the API
  setupSocketAPI,
  // emit to everyone / everyone in a specific room (label)
  emitTo,
  // emit to a specific user (if currently active in system)
  emitToUser,
  // Send to all sockets BUT not the current socket - if found
  // (otherwise broadcast to a room / to all)
  broadcast,
}
