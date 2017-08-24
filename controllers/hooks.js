const sipgate = require("../models/sipgate")
const errorhandler = require("../helpers/errorhandler")

exports.get = (req, res) => {
        sipgate.getWebhookUrls(req.session.bearer).then((hookinfo) => {
            res.render('hooks', {
                hooks: hookinfo,
                pageHooks: true,
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