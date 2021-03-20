
const util = require('./utils/util.js');
const api = require('./config/api.js');
//app.js
App({
  globalData:{
      appid:'',//appid需自己提供
      secret:'',//secret需自己提供
      user_id:0,
      userInfo: {
      },
      user:{},
      tribune_cookie:[]
  },
  onLaunch: function () {
   var that = this 
    let temp_userInfo=wx.getStorageSync('userInfo') || {};
    if(that.isJson(temp_userInfo)||temp_userInfo =={}){
    }else{
      temp_userInfo = JSON.parse(temp_userInfo);
    }
    // console.log(temp_user)
    // console.log(temp_userInfo)
    if((!temp_userInfo.country)){//读取缓存失效
      wx.getSetting({//读取授权
        success(res) {
          if (!res.authSetting['scope.userInfo']) {//未授权
            wx.switchTab({
              url:"/pages/ucenter/index/index"
          })
            // wx.authorize({
            //   scope: 'scope.userInfo',
            //   success () {
            //     console.log(111)
            //     wx.login({
            //         success: function(res){ 
            //             if(res.code) {
            //                 wx.getUserInfo({
            //                     success: function (res) {
            //                       console.log(1111)
            //                       console.log(res.userInfo);
            //                         // var objz={};
            //                         // objz.avatarUrl=res.userInfo.avatarUrl;
            //                         // objz.nickName=res.userInfo.nickName;           
            //                         that.globalData.userInfo = res.userInfo;
            //                         // console.log(res.userInfo);
            //                         wx.setStorageSync('userInfo', that.globalData.userInfo);//存储userInfo
            //                     }
            //                 });
            //                 var d=that.globalData;//这里存储了appid、secret、token串  
            //                 var l='https://api.weixin.qq.com/sns/jscode2session?appid='+d.appid+'&secret='+d.secret+'&js_code='+res.code+'&grant_type=authorization_code';  
            //                 wx.request({
            //                     url: l,  
            //                     data: {},  
            //                     method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
            //                     // header: {}, // 设置请求的 header  
            //                     success: function(res){ 
            //                         // console.log(that.globalData);
            //                         var obj={};
            //                         obj.openid=res.data.openid;  
            //                         obj.expires_in=Date.now()+res.data.expires_in;
            //                         that.globalData.user = res.data;
            //                         console.log(that.globalData);
            //                         wx.setStorageSync('user', obj);//存储openid  
            //                     }  
            //                 });
            //             }else {
            //                 console.log('获取用户登录态失败！' + res.errMsg)
            //                 wx.switchTab({
            //                   url:"/pages/ucenter/index/index"
            //               })
            //             }          
            //         }  
            //     }); 
            //   }
            // });
    }else{//已授权
      wx.login({
        success: function(rees){ 
            if(rees.code) {
                wx.getUserInfo({
                    success: function (res) {
                      console.log(res.userInfo);
                        // var objz={};
                        // objz.avatarUrl=res.userInfo.avatarUrl;
                        // objz.nickName=res.userInfo.nickName;          
                        that.globalData.userInfo = res.userInfo;
                        // console.log(res.userInfo);
                        wx.setStorageSync('userInfo', that.globalData.userInfo);//存储userInfo  
                        // var d=that.globalData;//这里存储了appid、secret、token串  
                        // var l='https://api.weixin.qq.com/sns/jscode2session?appid='+d.appid+'&secret='+d.secret+'&js_code='+rees.code+'&grant_type=authorization_code';
                        util.request(api.AuthLoginByWeixin, {//登录nideshop
                          code: rees.code,
                          userInfo: that.globalData.userInfo,
                        }, 'POST').then((res) => {
                        console.log(res)
                        if (res.errno !== 0) {
                          wx.showToast({
                            title: '微信登录失败',
                          })
                          return false;
                        }
                        that.globalData.user_id = res.data.userInfo.id;
                        wx.setStorageSync('token', res.data.token);
                      }).catch((err) => {
                        console.log(err)
                      })
                        // wx.request({
                        //     url: l_reset,
                        //     data: {appid:d.appid,secret:d.secret,js_code:rees.code,grant_type:"authorization_code"},header:{
                        //       'content-type':"application/json"
                        //     },
                        //     method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
                        //     // header: {}, // 设置请求的 header  
                        //     success: function(res){ 
                        //         // console.log(that.globalData);
                        //         var obj={};
                        //         that.globalData.userInfo.openid = res.data.data.openid;
                        //         obj.openid=res.data.data.openid;  
                        //         obj.expires_in=Date.now()+res.data.data.expires_in;
                        //         that.globalData.user = res.data.data;
                        //         console.log(that.globalData);
                        //         wx.setStorageSync('user', obj);//存储openid
                        //     }
                        // });
                    }
                });
                
            }
            else {
                console.log('获取用户登录态失败！' + res.errMsg)
                
            }          
        }  
    }); 

    }
  }
});
    }else{
        // this.globalData.user = JSON.parse(temp_user);
        // this.globalData.userInfo = JSON.parse(temp_userInfo);
        that.globalData.userInfo = temp_userInfo;
        console.log(that.globalData);
        wx.getSetting({
          success(res) {
            if (!res.authSetting['scope.userInfo']) {
                 wx.switchTab({
                    url:"/pages/ucenter/index/index"
                })
            }else{
              wx.login({
                success: function(rees){ 
                    if(rees.code) {
                      util.request(api.AuthLoginByWeixin, {//登录nideshop
                        code: rees.code,
                        userInfo: that.globalData.userInfo,
                      }, 'POST').then((res) => {
                      console.log(res)
                      if (res.errno !== 0) {
                        wx.showToast({
                          title: '微信登录失败',
                        })
                        return false;
                      }
                      that.globalData.user_id = res.data.userInfo.id;
                      console.log
                      wx.setStorageSync('token', res.data.token);
                    }).catch((err) => {
                      console.log(err)
                    })
                        // wx.getUserInfo({
                        //     success: function (res) {
                        //       console.log(res.userInfo);     
                        //         app.globalData.userInfo = res.userInfo;
                        //         that.setData({
                        //           userInfo:app.globalData.userInfo,
                        //         });
                        //         // console.log(res.userInfo);
                        //         // wx.setStorageSync('userInfo', app.globalData.userInfo);//存储userInfo
                        //         // var d=app.globalData;//这里存储了appid、secret、token串
                                
                        //     }
                        // });
                        
                    }
                    else {
                        console.log('获取用户登录态失败！' + res.errMsg)
                        
                    }          
                }  
            });
            }
          }
        })
    }
    

 },
  isJson(obj){
	var isjson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length; 
	return isjson;
}
})