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
          that.setData({
            ifScope_Userinfo:"hidden",
          });
          if(app.globalData.user_id>0){
            console.log("已经登陆");
            that.setData({
              userInfo:app.globalData.userInfo,
            });
          }else{
            wx.login({
              success: function(rees){ 
                  if(rees.code) {
                      wx.getUserInfo({
                          success: function (res) {
                            console.log(res.userInfo);     
                              app.globalData.userInfo = res.userInfo;
                              that.setData({
                                userInfo:app.globalData.userInfo,
                              });
                              // console.log(res.userInfo);
                              // wx.setStorageSync('userInfo', app.globalData.userInfo);//存储userInfo
                              // var d=app.globalData;//这里存储了appid、secret、token串
                              util.request(api.AuthLoginByWeixin, {//登录nideshop
                                code: rees.code,
                                userInfo: app.globalData.userInfo,
                              }, 'POST').then((res) => {
                              console.log(res)
                              if (res.errno !== 0) {
                                wx.showToast({
                                  title: '微信登录失败',
                                })
                                return false;
                              }
                              getApp().globalData.user_id = res.data.userInfo.id;
                              wx.setStorageSync('token', res.data.token);
                            }).catch((err) => {
                              console.log(err)
                            })
                          }
                      });
                      
                  }
                  else {
                      console.log('获取用户登录态失败！' + res.errMsg)
                      
                  }          
              }  
          });
          }
          
        }else{
          that.setData({
            ifScope_Userinfo:"visible",
          });
          wx.showModal({
            title: '使用提示',
            content: '请按下按钮同意授权请求',
            success(res) {
                if (res.confirm) {
                  
              }else{

              }
            }
          });
          
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
  onPullDownRefresh:function(){
    wx.showNavigationBarLoading() //在标题栏中显示加载
    //模拟加载
    setTimeout(function()
    {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    },2000);
    var that = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          that.setData({
            ifScope_Userinfo:"hidden",
          });
          if(app.globalData.user_id>0){
            console.log("已经登陆");
            that.setData({
              userInfo:app.globalData.userInfo,
            });
          }else{
            wx.login({
              success: function(rees){ 
                  if(rees.code) {
                      wx.getUserInfo({
                          success: function (res) {
                            console.log(res.userInfo);     
                              app.globalData.userInfo = res.userInfo;
                              that.setData({
                                userInfo:app.globalData.userInfo,
                              });
                              // console.log(res.userInfo);
                              // wx.setStorageSync('userInfo', app.globalData.userInfo);//存储userInfo
                              // var d=app.globalData;//这里存储了appid、secret、token串
                              util.request(api.AuthLoginByWeixin, {//登录nideshop
                                code: rees.code,
                                userInfo: app.globalData.userInfo,
                              }, 'POST').then((res) => {
                              console.log(res)
                              if (res.errno !== 0) {
                                wx.showToast({
                                  title: '微信登录失败',
                                })
                                return false;
                              }
                              getApp().globalData.user_id = res.data.userInfo.id;
                              wx.setStorageSync('token', res.data.token);
                            }).catch((err) => {
                              console.log(err)
                            })
                          }
                      });
                      
                  }
                  else {
                      console.log('获取用户登录态失败！' + res.errMsg)
                      
                  }          
              }  
          });
          }
          
        }else{
          that.setData({
            ifScope_Userinfo:"visible",
          });
          wx.showModal({
            title: '使用提示',
            content: '请按下按钮同意授权请求',
            success(res) {
                if (res.confirm) {
                  
              }else{

              }
            }
          });
          
        }
      }
    })
  }
  ,
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
    let that = this;
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
      wx.login({
        success: function(rees){ 
            if(rees.code) {
                wx.getUserInfo({
                    success: function (res) {
                      console.log(res.userInfo);
                        // var objz={};
                        // objz.avatarUrl=res.userInfo.avatarUrl;
                        // objz.nickName=res.userInfo.nickName;          
                        app.globalData.userInfo = res.userInfo;
                        // console.log(res.userInfo);
                        wx.setStorageSync('userInfo', app.globalData.userInfo);//存储userInfo
                        var d=app.globalData;//这里存储了appid、secret、token串
                        util.request(api.AuthLoginByWeixin, {//登录nideshop
                          code: rees.code,
                          userInfo: app.globalData.userInfo,
                        }, 'POST').then((res) => {
                        console.log(res)
                        if (res.errno !== 0) {
                          wx.showToast({
                            title: '微信登录失败',
                          })
                          return false;
                        }
                        getApp().globalData.user_id = res.data.userInfo.id;
                        wx.setStorageSync('token', res.data.token);
                      }).catch((err) => {
                        console.log(err)
                      })
                    }
                });
                
            }
            else {
                console.log('获取用户登录态失败！' + res.errMsg)
                
            }          
        }  
    }); 
    }
    // util.login().then((res) => {
    //   return util.request(api.AuthLoginByWeixin, {
    //     code: res,
    //     userInfo: e.detail
    //   }, 'POST');
    // }).then((res) => {
    //   console.log(res)
    //   if (res.errno !== 0) {
    //     wx.showToast({
    //       title: '微信登录失败',
    //     })
    //     return false;
    //   }
    //   // 设置用户信息
    //   this.setData({
    //     userInfo: res.data.userInfo,
    //     showLoginDialog: false
    //   });
    //   app.globalData.userInfo = res.data.userInfo;
    //   app.globalData.token = res.data.token;
    //   wx.setStorageSync('userInfo', JSON.stringify(res.data.userInfo));
    //   wx.setStorageSync('token', res.data.token);
    // }).catch((err) => {
    //   console.log(err)
    // })
    
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
