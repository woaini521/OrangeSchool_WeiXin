

const Auth = require('./auth');
/**
 * request封装
 */
function request(url, data = {}, method = "GET") {
    return new Promise(function (resolve, reject) {
        let pages = getCurrentPages();
        let currentPage = pages[pages.length - 1];
        currentPage.setData({loading: true});
        // wx.showLoading();

        data.token = Auth.getToken();
        data.t = new Date().getTime();
        data.r = Math.floor(Math.random() * 10000);

        wx.request({
            url: url,
            data: data,
            method: method,
            success: function (res) {
                // wx.hideLoading();
                currentPage.setData({loading: false});

                if (res.statusCode != 200) {
                    reject(res.errMsg);
                    return;
                }

                if (res.data.code == -1) {
                    currentPage.setData({
                        showPopLogin: true
                    });
                    return;
                }

                if (res.data.code == 0) {
                    resolve(res.data);
                    return;
                }
            },
            fail: function (err) {
                // wx.hideLoading();
                currentPage.setData({loading: false});

                reject(err);
            }
        })
    });
}

/**
 * get请求
 */
function get(url, data = {}) {
    return request(url, data, 'GET')
}

/**
 * post请求
 */
function post(url, data = {}) {
    return request(url, data, 'POST')
}

module.exports = {
    get,
    post,
}