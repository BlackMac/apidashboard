exports.get = (token) => {
    return new Promise((resolve, reject) => {
        playgroundcollection.findOne({token: token}).then((playground) => {
            if (playground !== null) {
                resolve(playground)
            } else {
                reject()
            }
        })
    })
}

exports.update = (token, script, html) => {
    return new Promise((resolve, reject) => {
        playgroundcollection.update(
            { token: token },
            { $set : {
                html: html,
                script: script
            }}
        ).then(() => {
            resolve()
        }).catch(reject)
    })
}

// When token is null a new token will be generated
exports.create = (token, script, html) => {
    return new Promise((resolve, reject) => {
        if (!token) {
            const buf = require('crypto').randomBytes(8)
            token = buf.toString('hex')
        }
        let config = {
            "token": token
        }
        if (script) config.script = script
        if (html) config.html = html
        playgroundcollection.insert(config).then(() => {
            resolve(token)
        }).catch(reject)
    })
}