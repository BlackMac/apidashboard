const sipgate = require("../models/sipgate")
const errorhandler = require("../helpers/errorhandler")
const currencies = {
    "EUR": "€",
    "USD": "$",
    "GBP": "£"
}

const products = {
    "team": "sipgate team",
    "basic": "sipgate basic",
    "simquadrat": "simquadrat"
}
exports.get = (req, res) => {
    Promise.all([
        sipgate.getBalance(req.session.bearer),
        sipgate.getUserInfo(req.session.bearer),
        sipgate.getClients(req.session.bearer)])
        .then((data) => {
            res.render('dashboard', {
                currency: currencies[data[0].currency],
                amount: Math.round(data[0].amount/100)/100,
                masterSipId: data[1].masterSipId,
                webuser: data[1].sub,
                locale: data[1].locale,
                domain: data[1].domain,
                admin: data[1].isAdmin ? "yes" : "no",
                product: products[data[1].product],
                apiClient: data[2].data[0] ? data[2].data[0] : null,
                pageDashboard: true,
                user:req.session.userdetails
            })
    }).catch(errorhandler.api.bind(null, req, res))
}