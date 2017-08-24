var globalio = null
var sockets = {}

exports.serve = (server) => {
    return new Promise((resolve, reject) => {
        globalio = require('socket.io')(server)

        globalio.on('connection', function (socket) {
            let token = socket.handshake.query.token;
            sockets[token] = socket
            resolve(token)
        })
    })
}

exports.send = (token, data) => {
    return new Promise((resolve, reject) => {
        if (typeof sockets[token] === "undefined") reject("Unknown Playground ID");
        sockets[token].emit('sipgateio', data)
    })
}