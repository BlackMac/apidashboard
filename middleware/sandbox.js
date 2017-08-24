module.exports = (req, res, next) => {
    const host = req.get('host')
    let id = host.match(/^[^\.]+/)[0]
    let hostname = host.replace(/^[^\.]+\./, "")
    req.sandbox = {
        'id': id,
        'host': hostname
    }
    next()
}