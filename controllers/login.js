const sipgate = require('../models/sipgate')
const config = require('../config')
const errorhandler = require("../helpers/errorhandler")
const md5 = require("js-md5")
exports.get = (req, res) => {
    req.session.bearer = null
    res.render('login', { token: req.sandbox.id, client_id: config.client_id, redirect: req.protocol + '://' + req.get('host')+"/login/oauth" })
}

exports.authenticate = (req, res) => {
    const code = req.query.code || null

    const redirectUri = req.protocol + '://' + req.get('host') + "/login/oauth"

    sipgate.getToken(code, redirectUri).then((clientdata) => {
        req.session.bearer = clientdata.access_token
        sipgate.getUserInfo(req.session.bearer).then((userinfo) => {
            req.session.webuserid=userinfo.sub
            req.session.masterSipId=userinfo.masterSipId
            sipgate.getUserDetails(userinfo.sub, req.session.bearer).then((userdetails) => {
                req.session.userdetails = userdetails
                req.session.userdetails.gravatar = md5(req.session.userdetails.email);
                res.redirect(req.protocol + '://' + req.get('host') + '/')
            })
        })
    }).catch(errorhandler.api.bind(null, req, res))
}
