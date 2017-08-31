const sandboxModel = require("../models/sandbox")
const sipgate = require("../models/sipgate")
const errorhandler = require("../helpers/errorhandler")

exports.get = (req, res) => {
    sipgate.getClients(req.session.bearer).then((result) => {
        res.render('edit', {
            clients: result.data,
            pageClients: true,
            user:req.session.userdetails
        })
    }).catch(errorhandler.api.bind(null, req, res))
 }

 exports.post = (req, res) => {
     let name = req.body.clientInputName
     let description = req.body.clientInputDescription
     let redirectUrls = req.body.clientInputRedirectUrls.split(",")
     let originUrls = req.body.clientInputOriginUrls.split(",")

     sipgate.createClient(name, description, redirectUrls, originUrls, req.session.bearer).then(() => {
        res.redirect("/clients")
     }).catch(errorhandler.api.bind(null, req, res))
     
 }

 exports.delete = (req, res) => {
     sipgate.deleteClient(req.params.clientid, req.session.bearer).then(() => {
        res.redirect("/clients")
     }).catch(errorhandler.api.bind(null, req, res))
 }