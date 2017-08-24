const collection = require('../models/sandbox'),
      fs = require('fs')

module.exports = (req, res, next) => {
    if (req.sandbox.id.length !== 16) {
        fs.readFile('./template/tutorial/code.js', (err, script) => {
            fs.readFile('./template/tutorial/code.html', (err, html) => {
                collection.create(null, script, html).then((token) => {
                    res.redirect(req.protocol + '://' + token + "." + req.sandbox.host + '/')
                })
            })
        })
    } else {
        next()
    }
}