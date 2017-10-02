const sipgate = require("../models/sipgate")
const config = require("../config")
const errorhandler = require("../helpers/errorhandler")
const md5 = require("js-md5")
var storage = require('node-persist');

exports.get = (req, res) => {
        sipgate.getWebhookUrls(req.session.bearer).then((hookinfo) => {
            res.render('hooks', {
                hooks: hookinfo,
                pageHooks: true,
                pageHooksConfiguration: true,
                user:req.session.userdetails
            })
        }).catch((e) => {
            if (e.status_code == 403) {
                return res.render('error', {
                    errormessage: 'Oh no! You don\'t have sipgate.io, but you can <a href="https://login.sipgate.com/" target="blank">log into your sipgate account</a> and book the feature. The small version is free.'
                })
            }
            errorhandler.api(req, res, e)
        })
}

exports.post = (req, res) => {
    let incoming = req.body.hooksInputIncomingUrl
    let outgoing = req.body.hooksInputOutgoingUrl
    sipgate.setWebhookURLs(incoming, outgoing, req.session.bearer).then(() => {
        res.redirect("/hooks")
    }).catch(errorhandler.api.bind(null, req, res))
}

exports.getMulti = (req, res) => {
    sipgate.getWebhookUrls(req.session.bearer).then((hookinfo) => {
        let hookEndpoint = req.protocol + '://' + req.get('host') + "/multipush/" + md5(config.push_salt+req.session.masterSipId)
        let masterActive = false
        if (hookinfo.incomingUrl === hookEndpoint && hookinfo.outgoingUrl === hookEndpoint) masterActive = true
        res.render('hooksmulti', {
            masterActive : masterActive,
            pageHooks: true,
            pageHooksMultipush: true,
            user:req.session.userdetails,
            hookUrl: hookEndpoint
        })
    })
}

exports.enableMulti = (req, res) => {
    storage.init()
    .then(sipgate.getWebhookUrls(req.session.bearer)
    .then((hookinfo) => {
        storage.setItem(md5(config.push_salt+req.session.masterSipId),{control: hookinfo}).then(() => {
            storage.getItem(md5(config.push_salt+req.session.masterSipId)).then((item) => {
                let hookEndpoint = req.protocol + '://' + req.get('host') + "/multipush/" + md5(config.push_salt+req.session.masterSipId)
                sipgate.setWebhookURLs(hookEndpoint, hookEndpoint, req.session.bearer).then(() => {
                    res.redirect("/hooks/multi")
                })
            })
        })

    }))
}
