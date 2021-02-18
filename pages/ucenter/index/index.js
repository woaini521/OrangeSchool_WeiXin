const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
const user = require('../../../services/user.js');
// const { set } = require('lodash');

const app = getApp();

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: {},
    hasinfo:false,
    showLoginDialog: false,
    ifScope_Userinfo:"visible",
  },
  onLoad: function(options) {
    var that = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // wx.authorize({
          //   scope: 'scope.userInfo',
          //   success () {
          //     // 用户已经同意小程序使用权限，后续调用接口不会弹窗询问
          //   }
          // })
          that.setData({
            ifScope_Userinfo:"hidden",
          });
          that.setData({
            userInfo:app.globalData.userInfo,
          });
          var temp_userinfo = app.globalData.userInfo;
          temp_userinfo.openId = app.globalData.user.openid;
          console.log(temp_userinfo);
          util.request(api.AuthLoginByWeixin, {
              code: res,
              userInfo: temp_userinfo,
            }, 'POST').then((res) => {
            console.log(res)
            if (res.errno !== 0) {
              wx.showToast({
                title: '微信登录失败',
              })
              return false;
            }
            // 设置用户信息
            // this.setData({
            //   userInfo: res.data.userInfo,
            //   showLoginDialog: false
            // });
            // app.globalData.userInfo = res.data.userInfo;
            // app.globalData.token = res.data.token;
            // wx.setStorageSync('userInfo', JSON.stringify(res.data.userInfo));
            wx.setStorageSync('token', res.data.token);
          }).catch((err) => {
            console.log(err)
          })
        }else{
          that.setData({
            ifScope_Userinfo:"visible",
          });
          that.setData({
            userInfo:app.globalData.userInfo,
          });
          var temp_userinfo = app.globalData.userInfo;
          temp_userinfo.openId = app.globalData.user.openid;
          console.log(temp_userinfo);
          util.request(api.AuthLoginByWeixin, {
              code: res,
              userInfo: temp_userinfo,
            }, 'POST').then((res) => {
            console.log(res)
            if (res.errno !== 0) {
              wx.showToast({
                title: '微信登录失败',
              })
              return false;
            }
            // 设置用户信息
            // that.setData({
            //   userInfo: res.data.userInfo,
            //   showLoginDialog: false
            // });
            // app.globalData.userInfo = res.data.userInfo;
            // app.globalData.token = res.data.token;
            // wx.setStorageSync('userInfo', JSON.stringify(res.data.userInfo));
            wx.setStorageSync('token', res.data.token);
          }).catch((err) => {
            console.log(err)
          })
          // console.log(that.data.userInfo);
        }
      }
    })
    // 页面初始化 options为页面跳转所带来的参数
    // this.data.user=wx.getStorageSync('user') || {};  
    // this.data.userInfo=wx.getStorageSync('userInfo') || {};
    // this.data.userInfo=wx.getStorageSync('userInfo') || {};
    // if((!this.data.userInfo)&&(!this.data.user)){

    // }
    
  },
  onReady: function() {

  },
  // onShow: function() {
  //   this.setData({
  //     userInfo: app.globalData.userInfo,
  //   });
  // },
  onHide: function() {
    // 页面隐藏

  },
  onUnload: function() {
    // 页面关闭
  },

  // onUserInfoClick: function() {
  //   if (this.data.userInfo) {

  //   } else {
  //     this.showLoginDialog();
  //   }
  // },

  // showLoginDialog() {
  //   this.setData({
  //     showLoginDialog: true
  //   })
  // },

  // onCloseLoginDialog () {
  //   this.setData({
  //     showLoginDialog: false
  //   })
  // },

  // onDialogBody () {
  // },

  onWechatLogin(e) {
    this.setData({
      ifScope_Userinfo:"hidden",
    });
    console.log(e)
      console.log(e.detail);
    if (e.detail.errMsg !== 'getUserInfo:ok') {
      if (e.detail.errMsg === 'getUserInfo:fail auth deny') {
        return false
      }
      wx.showToast({
        title: '微信登录失败',
      })
      return false
    }else{
      
      wx.showToast({
        title: '微信登录成功',
      });
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true,
        showLoginDialog: false
      });
      wx.setStorageSync('userInfo', JSON.stringify(e.detail.userInfo));
      console.log(this.data.userInfo);
    }
    util.login().then((res) => {
      return util.request(api.AuthLoginByWeixin, {
        code: res,
        userInfo: e.detail
      }, 'POST');
    }).then((res) => {
      console.log(res)
      if (res.errno !== 0) {
        wx.showToast({
          title: '微信登录失败',
        })
        return false;
      }
      // 设置用户信息
      this.setData({
        userInfo: res.data.userInfo,
        showLoginDialog: false
      });
      app.globalData.userInfo = res.data.userInfo;
      app.globalData.token = res.data.token;
      wx.setStorageSync('userInfo', JSON.stringify(res.data.userInfo));
      wx.setStorageSync('token', res.data.token);
    }).catch((err) => {
      console.log(err)
    })
  },

  onOrderInfoClick: function(event) {
    wx.navigateTo({
      url: '/pages/ucenter/order/order',
    })
  },

  onSectionItemClick: function(event) {

  },

  // TODO 移到个人信息页面
  exitLogin: function() {
    wx.showModal({
      title: '',
      confirmColor: '#b4282d',
      content: '退出登录？',
      success: function(res) {
        if (res.confirm) {
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo');
          wx.switchTab({
            url: '/pages/index/index'
          });
        }
      }
    })

  }
})
