// import {navList,getLabel} from '../../utils/utils'
const util = require('../../../utils/util.js');
const app = getApp();
Page({
    data:{
        sendForm:{},
        // topicArray:getLabel(navList),
        article_sort:["侃侃而谈","怼天怼地","互助时空","我的动态"],
        article_sort_index:0,
        disabled:false,
        loginInfo:{}
    },
        onLoad:function(){
            var that = this;
        // console.log(app.globalData.userInfo);
        // Get_UserInfo();
        this.setData({
            loginInfo:app.globalData.userInfo,
        });
        // console.log(this.data.loginInfo);
          
    },
    // onLoad:function(){
    //     let that = this
    //   wx.getStorage({
    //       key:'loginInfo',
    //       success:function(res){
    //           that.setData({loginInfo:res.data})
    //       }
    //   })
    // },
    // pickerHandler:function(e){
    //     //console.log('携带数据为：', e.detail.value)
    //     this.setData({pickerIndex:e.detail.value})
    // },
    getdate(date) {
        var year = date.getFullYear();
        var month = date.getMonth()+1; 
        var day = date.getDate(); 
        var hours = date.getHours(); 
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        let time =
            year +
            "-" +
            month +
            "-" +
            day +
            " " +
            hours +
            ":" +
            minutes +
            ":" +
            seconds;
        return time 
    },
    formSubmit:function(e){
        console.log('form发生了submit事件，携带数据为：', e.detail.value);
        console.log(this.data.article_sort_index);
        //发送请求
        var date = new Date();
        var time = this.getdate(date);
        var header = {
            'content-type': "application/x-www-form-urlencoded",
            'cookie':getApp().globalData.tribune_cookie,
        };
        wx.request({
            url: 'https://sparrowoo.top:8234/user/PostArticle', //发布文章
            method:'POST',
            data: {
              "open_id":getApp().globalData.user.openid,
              "article_header":e.detail.value.title,
              "article_abstract":e.detail.value.abstract,
              "article_content":e.detail.value.content,
              "article_post_time":time,
              "article_type":this.data.article_sort_index,
            },
            header: header,
            success (res) {
              console.log(res);
              if(res.statusCode==200){
                wx.navigateBack({
                    delta: 1
                  })
              }
            }
          })
    }
})