const sipgate = require("../models/sipgate")
const errorhandler = require("../helpers/errorhandler")

exports.get = (req, res) => {
        sipgate.getWebhookUrls(req.session.bearer).then((hookinfo) => {
            res.render('hooks', {
                hooks: hookinfo,
                pageHooks: true,
                user:req.session.userdetails
            })
        }).catch(errorhandler.api.bind(null, req, res))
}
