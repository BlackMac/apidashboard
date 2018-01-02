const http = require("https"),
      querystring = require('querystring'),
      config = require('../config')

exports.getClients = (bearer) => {
    return get('/v2/authorization/oauth2/clients', bearer)
}

exports.getToken = (code, redirectUri) => {
    const query = {
        client_id: config.client_id,
        client_secret: config.client_secret,
        code: code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri
    };

    return post('/login/third-party/protocol/openid-connect/token', query)
}

exports.createClient = (name, description, redirectUrls, originUrls, bearer) => {
    const query = {
        "name": name,
        "description": description,
        "redirectUris": redirectUrls.split(","),
        "webOrigins": originUrls.split(",")
    }
    return post('/v2/authorization/oauth2/clients', query, bearer);
}

exports.deleteClient = (clientid, bearer) => {
    return del('/v2/authorization/oauth2/clients/'+clientid, bearer);
}

exports.getBalance = (bearer) => {
    return get('/v2/balance', bearer)
}

exports.getUserInfo = (bearer) => {
    return get('/v2/authorization/userinfo', bearer)
}

exports.getUserDetails = (userid, bearer) => {
    return get('/v2/users/'+userid, bearer)
}

exports.getNumbers = (bearer) => {
    return get('/v2/numbers', bearer)
}

exports.getWebhookUrls = (bearer) => {
    return get('/v2/settings/sipgateio', bearer)
}

exports.setWebhookURLs = (incoming, outgoing, bearer) => {
    const query = {
        "incomingUrl": incoming,
        "outgoingUrl": outgoing
    }
    return put('/v2/settings/sipgateio', query, bearer)
}

exports.getOpenCalls = (bearer) => {
    return get('/v2/calls', bearer)
}

exports.getHistory = (bearer) => {
    return get('/v2/w3/history?offset=0&limit=1000', bearer)
}

function request(method, url, querydata, bearer) {
    return new Promise((resolve, reject) => {
        console.log(method, url, querydata, bearer)
        let queryuri

        if (!bearer) {
            queryuri = querystring.stringify(querydata)
        } else {
            queryuri = JSON.stringify(querydata)
        }
        const headers = {
            'User-Agent':       'sipgate.io developer toolbox 0.0.1',
            'Accept':           'application/json',
            'Content-Type':     'application/json'
        }

        if (!bearer) {
            headers['Content-Type'] = 'application/x-www-form-urlencoded'
        }
        if (bearer) {
            headers['Authorization'] = 'Bearer '+bearer
        }

        const options = {
            host: 'api.sipgate.com',
            port: '443',
            path: url,
            method: method,
            headers: headers}

        const post_req = http.request(options, (result) => {
            let rawData = '';
            result.on('data', (chunk) => { rawData += chunk; });
            result.on('end', function () {
                if (result.statusCode <200 || result.statusCode >299) {
                    const errorinfo = {"status_code":result.statusCode, "status_message": result.statusMessage, "response": rawData, "path": options.path, "method": options.method, "data":querydata}
                    console.log(errorinfo, method, url, queryuri)
                    reject(errorinfo)
                }
                try {
                    const data = JSON.parse(rawData)
                    resolve(data)
                } catch (e) {
                    resolve(rawData)
                }
            })
        })

        post_req.on('error', (e) => {
            reject(e)
        });

        if (querydata) {
            post_req.write(queryuri)
        }
        post_req.end();
    })
}

function del(url, bearer) {
    return request("DELETE", url, null, bearer)
}

function post(url, querydata, bearer) {
    return request("POST", url, querydata, bearer)
}

function get(url, bearer) {
    return request("GET", url, null, bearer)
}

function put(url, querydata, bearer) {
    return request("PUT", url, querydata, bearer)
}
