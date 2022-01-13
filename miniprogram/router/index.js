const routes = require('./routes.js');

function navigateTo(name, data) {
    const dataStr = encodeURIComponent(JSON.stringify(data))
    const route = routes[name]
    const url = route ? route.path : name
    const title = route ? route.title : "微信"
    if (route.type == 'tab') {
        wx.switchTab({
            url: `${url}`
        });
        return
    }
    wx.navigateTo({
        url: `${url}?encodedData=${dataStr}`
    })
    wx.setNavigationBarTitle({
        title: `${title}`
    })
}

function extract(options = {}) {
    const data = options.encodedData
    if (data) {
        return JSON.parse(decodeURIComponent(options.encodedData))
    }
    return null
}

module.exports = {
    navigateTo,
    extract
}