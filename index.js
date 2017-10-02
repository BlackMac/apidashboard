(function(){
    let fs = require('fs')

    if (!fs.existsSync("./config.js")) {
        throw('You need to create a config.js - see config.sample.js')
    }
})()

const express = require('express'),
      sandboxMiddleware = require('./middleware/sandbox.js'),
      router = require('./router'),
      cookieSession = require('cookie-session'),
      mustacheExpress = require('mustache-express'),
      bodyParser = require('body-parser')

const app = express()
const server = require('http').Server(app)
//require('./models/push').serve(server)

app.use(sandboxMiddleware)
app.use(cookieSession({
    name: 'session',
    keys: ["Do0phiek"],
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))
app.use(bodyParser.urlencoded({extended: false}));
app.engine('mustache', mustacheExpress())
app.set('view engine', 'mustache')
app.disable('view cache')
app.enable('trust proxy');

router(app)

var port = process.env.PORT || 4000;

server.listen(port, function () {
    console.log('sndbx.net listening on port '+port)
})
