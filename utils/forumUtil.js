

function navigateBack() {
    wx.navigateBack({
        delta: 1,
        fail: function (res) {
            wx.switchTab({
              url: '/pages/index/index',
            })
        }
    });
}

module.exports = {
    navigateBack,
}