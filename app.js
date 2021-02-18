// App({
//   onLaunch: function () {
//     try {
//       this.globalData.userInfo = JSON.parse(wx.getStorageSync('userInfo'));
//       this.globalData.token = wx.getStorageSync('token');
//     } catch (e) {
//       console.log(e);
//     }
//   },

//   globalData: {
//     userInfo: {
//       nickname: '点击登录',
//       avatar: 'http://yanxuan.nosdn.127.net/8945ae63d940cc42406c3f67019c5cb6.png'
//     },
//     token: '',
//   }
// })

//app.js
App({
  globalData:{
      appid:'wx4c8156debe62bf49',//appid需自己提供，此处的appid我随机编写
      secret:'c19cf83c2a1e13238827bef3b190c4ea',//secret需自己提供，此处的secret我随机编写
      userInfo: {
      },
      user:{},
      tribune_cookie:[]
  },
  onLaunch: function () {
    wx.getSetting({
        success(res) {
          if (!res.authSetting['scope.userInfo']) {
            wx.authorize({
              scope: 'scope.userInfo',
              success () {
                // 用户已经同意小程序使用权限，后续调用接口不会弹窗询问
              }
            })
            wx.switchTab({
                url:"/pages/ucenter/index/index"
            })
          }
        }
      })
   var that = this
    let temp_user=wx.getStorageSync('user') || {};  
    let temp_userInfo=wx.getStorageSync('userInfo') || {};
    // console.log(temp_user);
    // console.log(temp_userInfo);

    if((!this.globalData.user.openid)&&(!this.globalData.userInfo.nickName)){
        wx.login({
            success: function(res){ 
                if(res.code) {
                    wx.getUserInfo({
                        success: function (res) {
                          console.log(res.userInfo);
                            // var objz={};
                            // objz.avatarUrl=res.userInfo.avatarUrl;
                            // objz.nickName=res.userInfo.nickName;           
                            that.globalData.userInfo = res.userInfo;
                            // console.log(res.userInfo);
                            wx.setStorageSync('userInfo', that.globalData.userInfo);//存储userInfo
                        }
                    });
                    var d=that.globalData;//这里存储了appid、secret、token串  
                    var l='https://api.weixin.qq.com/sns/jscode2session?appid='+d.appid+'&secret='+d.secret+'&js_code='+res.code+'&grant_type=authorization_code';  
                    wx.request({  
                        url: l,  
                        data: {},  
                        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
                        // header: {}, // 设置请求的 header  
                        success: function(res){ 
                            // console.log(that.globalData);
                            var obj={};
                            obj.openid=res.data.openid;  
                            obj.expires_in=Date.now()+res.data.expires_in;
                            that.globalData.user = res.data;
                            console.log(that.globalData);
                            wx.setStorageSync('user', obj);//存储openid  
                        }  
                    });
                }else {
                    console.log('获取用户登录态失败！' + res.errMsg)
                }          
            }  
          }); 
    }else{
        this.globalData.user = JSON.parse(temp_user);
        this.globalData.userInfo = JSON.parse(temp_userInfo);
        // this.globalData.userInfo.openid = this.globalData.user;
        console.log(this.globalData.userInfo);
    }

 },
})