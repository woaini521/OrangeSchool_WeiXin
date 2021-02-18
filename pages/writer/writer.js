// import {navList,getLabel} from '../../utils/utils'
const util = require('/../../utils/util.js');
const app = getApp();
Page({
    data:{
        sendForm:{},
        // topicArray:getLabel(navList),
        article_sort:["侃侃而谈","怼天怼地","互助时空","我的动态"],
        article_sort_index:0,
        disabled:false,
        loginInfo:{},
        imgList:[]
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
    ChooseImage() {
        wx.chooseImage({
          count: 9, //默认9
          sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album','camera'], //从相册选择
          success: (res) => {
            if (this.data.imgList.length != 0) {
              this.setData({
                imgList: this.data.imgList.concat(res.tempFilePaths)
              })
            } else {
              this.setData({
                imgList: res.tempFilePaths
              })
            }
          }
        });
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
            header: {
                'content-type': "application/x-www-form-urlencoded"
            },
            success (res) {
              console.log(res);
              if(res.statusCode==200){
                  wx.showToast({
                      title:'发布成功',
                      icon:'success',
                      duration:2000
                  })
              }else{
                  wx.showModal({
                      title:'发文提醒',
                      content:"发文失败",
                      success: function (res) {
                        if (res.confirm) {//这里是点击了确定以后
                          console.log('用户点击确定');
                            wx.navigateBack({
                                delta: 1,
                            })
                        } else {//这里是点击了取消以后
                          console.log('用户点击取消');
                            wx.navigateBack({
                                delta: 1,
                            })
                        }
                      }
                  })
              }
            }
          })
    }
})